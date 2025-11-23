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
    - 中序遍历：左 **根** 右
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
- 若溢出取m/2(向上取整)位置的数向上变化
- 插入一定为叶子节点

@[bilibili autoplay=false](BV1tJ4m1w7yR)

[//]: # (![loading]&#40;https://files.cnblogs.com/yangecnu/btreebuild.gif&#41;)

[//]: # (- 插入节点是根节点 => 直接变黑)

[//]: # (- 插入节点的叔叔是红色 => 叔,父,爷变色,爷爷变插入节点 再重新判断)

[//]: # (- 插入节点的叔叔是黑色 => **LL、RR、LR、RL**旋转,然后变色 再重新判断)


## ==B+树==
**针对于AVL修改性能高做出的修改。以最多$2O(logn$)的时间，换取更少的旋转**
- 插入为红节点
- 插入节点是根节点 => 直接变黑
- 插入节点的叔叔是红色 => 叔,父,爷变色,爷爷变插入节点 再重新判断
- 插入节点的叔叔是黑色 => **LL、RR、LR、RL**旋转,然后变色 再重新判断 

[//]: # (@[bilibili autoplay=false]&#40;BV1Xm421x7Lg&#41;)

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
