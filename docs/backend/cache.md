---
title: 缓存
createTime: 2025/11/17 18:45:02
permalink: /backend/cache/
---

## Redis数据类型
- **字符串（String）**：最基本的数据类型，存储文本或二进制数据，支持多种操作如设置、获取、追加等。
- **列表（List）**：有序的字符串列表，支持从两端插入和弹出元素，适合实现队列和栈。
- **集合（Set）**：无序的字符串集合，支持添加、删除、检查成员等操作，适合实现标签和关系。
- **有序集合（Sorted Set）**：类似集合，但每个元素关联一个分数，支持按分数排序，适合实现排行榜。
- **哈希（Hash）**：键值对集合，适合存储对象属性，如用户信息。
- **位图（Bitmap）**：使用字符串的位操作，适合实现布隆过滤器等。
- **HyperLogLog**：用于基数统计，估算唯一元素数量，节省内存。
- **地理空间（Geospatial）**：存储地理位置数据，支持距离计算和范围查询。

## 缓存三大问题

### ==穿透==
::: note 请求查询一个不存在的数据，缓存和数据库都没有，导致每次请求都打到数据库
:::

```text ts:no-line-numbers
请求 user_id=-1（恶意攻击）
  ↓
Redis没有 → 查MySQL → 仍然没有 → 返回空
  ↓
下次请求 user_id=-1
  ↓
又查MySQL（缓存没起作用！）
```

::: details 解法

- ==设置空值==
1. 查缓存，未命中
2. 查数据库，发现不存在
3. 在缓存中写入一个空值（如"NULL"），并设置较短的过期时间
4. 下次请求时，命中空值缓存，直接返回空结果，避免查询数据库
```go :collapsed-lines=5
// 方案1：缓存空值（简单有效）
func GetUser(uid int) (*User, error) {
    // 1. 查缓存
    cacheKey := fmt.Sprintf("user:%d", uid)
    val, err := rdb.Get(ctx, cacheKey).Result()

    if err == redis.Nil {
        // 缓存未命中
    } else if err != nil {
        return nil, err
    } else {
        if val == "NULL" {
            return nil, ErrUserNotFound // 命中空值缓存
        }
        // 正常数据
        return unmarshal(val), nil
    }
    
    // 2. 查数据库
    user, err := db.First(&User{}, uid).Error
    if err == gorm.ErrRecordNotFound {
        // 缓存空值，防止穿透
        rdb.Set(ctx, cacheKey, "NULL", 5*time.Minute) // 短过期时间
        return nil, ErrUserNotFound
    }
    
    // 3. 回写缓存
    data, _ := json.Marshal(user)
    rdb.Set(ctx, cacheKey, data, 30*time.Minute)
    return user, nil
}
```

- ==布隆过滤器==
1. 在应用启动时，将所有合法的ID加载到布隆过滤器
2. 每次请求时，先通过布隆过滤器判断ID是否存在
3. 如果布隆过滤器判断不存在，直接返回空结果，避免查询数据库
4. 如果布隆过滤器判断存在，再继续查缓存和数据库
```go :collapsed-lines=5
// 在应用启动时，将所有user_id加载到布隆过滤器
var bf *bloom.BloomFilter

func Init() {
    bf = bloom.NewWithEstimates(10000000, 0.01) // 1000万用户，1%误判率
    
    // 加载所有ID
    var ids []int
    db.Model(&User{}).Pluck("id", &ids)
    for _, id := range ids {
        bf.AddString(fmt.Sprintf("user:%d", id))
    }
}

func GetUser(uid int) (*User, error) {
    key := fmt.Sprintf("user:%d", uid)
    
    // 先过布隆过滤器
    if !bf.TestString(key) {
        return nil, ErrUserNotFound // 一定不存在
    }
    
    // 后续逻辑同上...
}
```

:::

### ==击穿==
::: note 热点Key突然过期，大量请求同时打到数据库
:::

```text ts:no-line-numbers
热点商品 product:1001 的缓存过期
  ↓
1000个并发请求同时到来
  ↓
Redis都未命中 → 1000个请求都去查MySQL
  ↓
数据库瞬间压力暴增，可能挂掉
```

::: details 解法

- ==互斥锁（推荐）==
1. 查缓存，未命中
2. 获取分布式锁，防止缓存重建时的并发请求（只允许一个请求去查数据库）
3. 获取到锁的请求，查数据库，回写缓存，释放锁
4. 未获取到锁的请求，等待一段时间后重试
```go :collapsed-lines=5
// 方案1：互斥锁（推荐）
func GetProduct(pid int) (*Product, error) {
    cacheKey := fmt.Sprintf("product:%d", pid)
    
    // 1. 查缓存
    val, err := rdb.Get(ctx, cacheKey).Result()
    if err == nil {
        return unmarshal(val), nil
    }
    
    // 2. 获取分布式锁
    lockKey := fmt.Sprintf("lock:product:%d", pid)
    lockValue := uuid.New().String()
    
    // SET NX EX 10 原子操作
    ok, err := rdb.SetNX(ctx, lockKey, lockValue, 10*time.Second).Result()
    if !ok {
        // 未获取到锁，等待后重试
        time.Sleep(50 * time.Millisecond)
        return GetProduct(pid) // 递归重试
    }
    
    // 3. 获取到锁，查数据库
    defer func() {
        // 使用Lua脚本确保只删除自己的锁
        script := `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `
        rdb.Eval(ctx, script, []string{lockKey}, lockValue)
    }()
    
    // Double Check：可能其他线程已经加载
    val, err = rdb.Get(ctx, cacheKey).Result()
    if err == nil {
        return unmarshal(val), nil
    }
    
    // 查数据库
    var product Product
    db.First(&product, pid)
    
    // 回写缓存
    data, _ := json.Marshal(product)
    rdb.Set(ctx, cacheKey, data, 30*time.Minute)
    
    return &product, nil
}
```

- ==逻辑过期（适合极端热点）==
1. 缓存中存储数据和逻辑过期时间
2. 查缓存，命中后检查逻辑过期时间
3. 如果未过期，直接返回数据
4. 如果已过期，返回旧数据，并异步启动协程更新缓存
```go :collapsed-lines=5
type CacheData struct {
    Data      string    `json:"data"`
    ExpireAt  time.Time `json:"expire_at"`
}

func GetProductWithLogicExpire(pid int) (*Product, error) {
    cacheKey := fmt.Sprintf("product:%d", pid)
    
    val, err := rdb.Get(ctx, cacheKey).Result()
    if err != nil {
        return nil, err
    }
    
    var cached CacheData
    json.Unmarshal([]byte(val), &cached)
    
    // 检查逻辑过期时间
    if time.Now().Before(cached.ExpireAt) {
        // 未过期，直接返回
        return unmarshal(cached.Data), nil
    }
    
    // 已过期，异步更新
    go func() {
        lockKey := "lock:" + cacheKey
        if ok, _ := rdb.SetNX(ctx, lockKey, 1, 10*time.Second).Result(); ok {
            defer rdb.Del(ctx, lockKey)
            
            // 查数据库并更新缓存
            var product Product
            db.First(&product, pid)
            data, _ := json.Marshal(product)
            
            newCache := CacheData{
                Data:     string(data),
                ExpireAt: time.Now().Add(30 * time.Minute),
            }
            cacheData, _ := json.Marshal(newCache)
            rdb.Set(ctx, cacheKey, cacheData, 0) // 永不过期
        }
    }()
    
    // 返回旧数据
    return unmarshal(cached.Data), nil
}
```

:::

### ==雪崩==
::: note 大量Key同时过期，或Redis宕机，请求全部打到数据库
:::

```text ts:no-line-numbers
场景1：批量导入数据，设置相同过期时间
  ↓
1小时后，10000个Key同时过期
  ↓
数据库瞬间崩溃

场景2：Redis服务器宕机
  ↓
所有请求打到MySQL
  ↓
整个系统不可用
```

::: details 解法

- ==过期时间加随机值==
```go :collapsed-lines=5
// 方案1：过期时间加随机值
func SetCacheWithRandomExpire(key string, value interface{}) error {
    data, _ := json.Marshal(value)
    
    baseExpire := 30 * time.Minute
    randomExpire := time.Duration(rand.Intn(300)) * time.Second // 0-5分钟随机
    
    return rdb.Set(ctx, key, data, baseExpire+randomExpire).Err()
}
```

- ==热点数据永不过期（配合逻辑过期）==
```go :collapsed-lines=5
// 方案2：热点数据永不过期（配合逻辑过期）
func SetHotCache(key string, value interface{}) error {
    cached := CacheData{
        Data:     marshal(value),
        ExpireAt: time.Now().Add(24 * time.Hour),
    }
    data, _ := json.Marshal(cached)
    return rdb.Set(ctx, key, data, 0).Err() // TTL为0，永不过期
}
```

- ==多级缓存==
```go :collapsed-lines=5
// 方案3：多级缓存
type CacheManager struct {
    localCache *bigcache.BigCache // 本地缓存
    redis      *redis.Client       // Redis缓存
    db         *gorm.DB           // 数据库
}

func (m *CacheManager) Get(key string) (string, error) {
    // L1: 本地缓存（进程内，微秒级）
    if val, err := m.localCache.Get(key); err == nil {
        return string(val), nil
    }
    
    // L2: Redis（毫秒级）
    if val, err := m.redis.Get(ctx, key).Result(); err == nil {
        m.localCache.Set(key, []byte(val))
        return val, nil
    }
    
    // L3: 数据库（百毫秒级）
    var data string
    m.db.Raw("SELECT data FROM cache WHERE key = ?", key).Scan(&data)
    
    // 回写缓存
    m.redis.Set(ctx, key, data, 10*time.Minute)
    m.localCache.Set(key, []byte(data))
    
    return data, nil
}

```

- ==熔断降级（Redis挂了也能撑住）==
```go :collapsed-lines=5
// 方案4：熔断降级（Redis挂了也能撑住）
import "github.com/sony/gobreaker"

var cb *gobreaker.CircuitBreaker

func init() {
    cb = gobreaker.NewCircuitBreaker(gobreaker.Settings{
        Name:        "redis",
        MaxRequests: 3,
        Interval:    time.Minute,
        Timeout:     30 * time.Second,
        ReadyToTrip: func(counts gobreaker.Counts) bool {
            return counts.ConsecutiveFailures > 5
        },
    })
}

func GetWithCircuitBreaker(key string) (string, error) {
    val, err := cb.Execute(func() (interface{}, error) {
        return rdb.Get(ctx, key).Result()
    })
    
    if err == gobreaker.ErrOpenState {
        // 熔断打开，直接查数据库
        log.Warn("Redis circuit breaker is open, fallback to DB")
        return queryDB(key)
    }
    
    return val.(string), err
}
```

:::
