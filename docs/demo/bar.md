---
title: bar
createTime: 2025/11/13 00:18:30
permalink: /demo/vqhdxnof/
---


[foo](./foo.md)


# 并发优化

## Redis缓存 + singleflight

**优化外部IO，减少DB查询**

### 场景问题

**高并发查询相同数据**：

- 1000个请求同时查询"用户ID=123"的信息
- 如果只用Redis，缓存失效瞬间，1000个请求都会打到数据库
- 这就是**缓存击穿**问题

### 问题拆解

```
请求1 → 查Redis → 没有 → 查DB → 返回
请求2 → 查Redis → 没有 → 查DB → 返回
请求3 → 查Redis → 没有 → 查DB → 返回
...（同时发生）
```
