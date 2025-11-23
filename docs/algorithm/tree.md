---
title: 树
tags:
 - tree
createTime: 2025/11/19 11:34:08
permalink: /algorithm/tree/
---
[在线动画地址](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html)

**内存处理**：[二叉搜索树](#二叉搜索树),[AVL树](#avl树严格平衡的二叉搜索树bst),[红黑树](#红黑树)

**磁盘处理**：[B树](#b树),[B+树](#b-树)

## 树的遍历
::: info ==**遍历**==
- 广度优先
    - 层序遍历：1 2 3 4 5 6 7
- 深度优先
    - 前序遍历：**根** 左 右 
    - 中序遍历：左 **根** 右 {#中序遍历}
    - 后序遍历：左 **根** 中

![Alt text](https://www.hello-algo.com/chapter_tree/binary_tree_traversal.assets/binary_tree_dfs.png)
:::

## 二叉搜索树
所有节点 左 < 根 < 右 (不允许存在重复节点)
- 天然满足**中序为升序**
- 时间复杂度：平衡为$O(logn$)，最差退化成链表为$O(n)$

![Alt text](https://www.hello-algo.com/chapter_tree/binary_search_tree.assets/binary_search_tree.png)

### 删除
1. 度=0||1：直接删除
2. 度=2：取左子树最大节点||右子树最小节点（中序遍历的下一个节点）

::: warning 插入删除都可能导致结构退化为链表
![Alt text](https://www.hello-algo.com/chapter_tree/avl_tree.assets/avltree_degradation_from_removing_node.png)
:::

## ==AVL树==（严格平衡的二叉搜索树（BST））
- 节点的平衡因子（balance factor）定义为节点左子树的高度减去右子树的高度
- 一棵 AVL 树的任意节点的平衡因子皆满足 $|x| \le 1$
- 插入/删除会自动旋转维持平衡（靠 [LL、RR、LR、RL](https://www.hello-algo.com/chapter_tree/avl_tree/#752-avl) 旋转）

### 典型应用
- 组织和存储大型数据，适用于高频查找、低频增删的场景。
- 用于构建数据库中的索引系统。
- 红黑树也是一种常见的平衡二叉搜索树。相较于 AVL 树，红黑树的平衡条件更宽松，插入与删除节点所需的旋转操作更少，节点增删操作的平均效率更高

## ==红黑树==
**针对于AVL修改性能高做出的修改。以最多$2O(logn$)的时间，换取更少的旋转**
- 插入为红节点
- 插入节点是根节点 => 直接变黑
- 插入节点的叔叔是红色 => 叔,父,爷变色,爷爷变插入节点 再重新判断
- 插入节点的叔叔是黑色 => **LL、RR、LR、RL**旋转,然后变色 再重新判断
@[bilibili autoplay=false](BV1Xm421x7Lg)

## ==B树==
**最大化一次磁盘读取的有效内容，降低树高。降低磁盘IO**

- m阶树 最多m个子树，m-1个元素 
  - 每个节点最多有m个子节点
  - 每个非叶子节点（除了根）至少有⌈m/2⌉个子节点
  - 根节点至少有2个子节点（除非根就是叶子）
- 每个节点内的key是有序的
- 所有叶子节点都在同一层

**插入**
- 直接插入到对应的叶子节点
- 保持节点内有序
- 若溢出取m/2(向上取整)位置的数向上分裂

@[bilibili autoplay=false](BV1tJ4m1w7yR)

[//]: # (![loading]&#40;https://files.cnblogs.com/yangecnu/btreebuild.gif&#41;)

## ==B+树==
> B+ 树的设计目标只有一个：减少磁盘 IO，让一次查询尽可能少访问磁盘页（Page）。
> 
> 数据库性能瓶颈是磁盘，而不是 CPU。所以 B+ 树 = 专为“磁盘 + 范围查询”而生的结构。

B+树是B树的改进版
B树虽然好，但还有3个问题：
- 数据分散在所有节点 => 节点既存索引又存数据，一个节点存不了太多索引
- 范围查询低效 => 需要中序遍历
- 查询性能不稳定 => 有的数据在上层，有的在叶子层(比如按照按照升序遍历，B树走[中序遍历](#中序遍历)，B+树直接走链表顺序遍历)

**改进：**
- 非叶子节点只存索引，不存数据
```ts ts:no-line-numbers
B树的节点：
[key1, data1 | key2, data2 | key3, data3]
↑
data占很多空间

B+树的节点：
[key1 | key2 | key3 | key4 | ... | keyₙ]
只存key，空间省了！

同样大小的节点，B+树能存更多key
→ 树更矮
→ IO次数更少
```

- 所有数据都在叶子节点，且叶子节点之间有链表
```ts ts:no-line-numbers
B+树结构：

非叶子层（索引）：
              [50]
         /            \
    [20, 30]        [60, 80]

叶子层（数据+链表）：
[10,data] → [20,data] → [30,data] → [50,data] → [60,data] → [80,data]
    ↓           ↓           ↓           ↓           ↓           ↓
   指向实际数据记录
```
==设计缘由==
```sql ts:no-line-numbers
-- 范围查询
-- 分别思考B树和B+树的实现过程
SELECT * FROM users WHERE age BETWEEN 20 AND 60;
```
:::details
B树的做法：
1. 找到20（可能在某一层）
2. 中序遍历到60
3. 需要上下反复跳跃

B+树的做法：
1. 找到20（必定在叶子层）
2. 沿着叶子层的链表，顺序扫描到60
3. 一条直线，超快！
:::

- 叶子节点包含所有key
  - 所有查询都走到叶子节点，性能稳定 
  - 叶子节点包含全部信息，可以单独扫描
```ts ts:no-line-numbers
在B树中：如果30在非叶子节点，那叶子节点就没有30

在B+树中：
       [30]       ← 30作为索引出现
      /    \
    ...    [30, 35, 40]  ← 30也在叶子节点
                          叶子有完整数据
```

### 场景 ⭐⭐
- 主键查询
```sql ts:no-line-numbers
SELECT * FROM users WHERE id = 100;
```
:::details
过程：
1. 从根节点开始，读取节点（1次IO）
2. 在节点内二分查找，确定走哪个子树
3. 读取下一层节点（1次IO）
4. ...重复
5. 到达叶子节点，找到id=100的完整数据（最后1次IO）

假设100万数据，3层B+树，只需3次IO！
:::

- 范围查询
```sql ts:no-line-numbers
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
```
:::details
过程：
1. 找到age=20的叶子节点（2-3次IO）
2. 沿着链表顺序扫描到age=30
3. 不需要回到根节点，不需要上下跳！
:::

- 全表扫描
```sql ts:no-line-numbers
SELECT * FROM users;
```
:::details
过程：
直接扫描叶子节点的链表，从左到右
不需要关心上层的索引节点
:::

### Mysql实际应用 ⭐⭐
- 聚簇索引（主键索引）
```sql ts:no-line-numbers
用户表：
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT
);

B+树结构：
叶子节点直接存储完整的行数据：
[id=1, name='Alice', age=25] → [id=2, name='Bob', age=30] → ...
```

- 二级索引（非主键索引）
```sql ts:no-line-numbers
CREATE INDEX idx_age ON users(age);

B+树结构：
叶子节点存储：age + 对应的主键id
[age=20, id=5] → [age=25, id=1] → [age=30, id=2] → ...

查询时需要"回表"：
1. 先在age索引找到id
2. 再用id去主键索引找完整数据
```

- 覆盖索引（优化）
```sql ts:no-line-numbers
CREATE INDEX idx_age_name ON users(age, name);

如果查询：
SELECT name FROM users WHERE age = 25;

叶子节点已经有age和name：
[age=25, name='Alice'] → [age=25, name='Charlie'] → ...

不需要回表，直接返回！
```

### B树与B+树对比
::: table title="B树与B+树对比"
| 特性 | B树 | B+树 |
|----------|----------|----------|
| 数据位置 | 所有节点 | 只在叶子 |
| 非叶子节点存储 | 索引+数据 | 只存索引 |
| 叶子节点关系 | 独立 | 有链表连接 |
| 单次查询 | 可能提前结束 | 必到叶子（稳定）|
| 范围查询 | 中序遍历（慢）| 链表扫描（快）⭐ |
| 节点容量 | 较少key | 更多key（树更矮）⭐ |
:::

## 平衡二叉树
平衡二叉树（balanced binary tree）中任意节点的左子树和右子树的高度之差的绝对值不超过 1 
![Alt text](https://www.hello-algo.com/chapter_tree/binary_tree.assets/balanced_binary_tree.png)

## 完全二叉树
完全二叉树（complete binary tree）仅允许最底层的节点不完全填满，且最底层的节点必须从左至右依次连续填充。请注意，完美二叉树也是一棵完全二叉树
![Alt text](https://www.hello-algo.com/chapter_tree/binary_tree.assets/complete_binary_tree.png)

## 完美二叉（又称满二叉）= 完全二叉
完美二叉树（perfect binary tree）所有层的节点都被完全填满。在完美二叉树中，叶节点的度为 0 ，其余所有节点的度都为 2 ，若树的高度为 h ，则节点总数为 $2^{h+1}-1$
![Alt text](https://www.hello-algo.com/chapter_tree/binary_tree.assets/perfect_binary_tree.png)

## 完满二叉树
完满二叉树（full binary tree）除了叶节点之外，其余所有节点都有两个子节点
![Alt text](https://www.hello-algo.com/chapter_tree/binary_tree.assets/full_binary_tree.png)
