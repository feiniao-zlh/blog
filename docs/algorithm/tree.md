---
title: 树
tags:
 - tree
createTime: 2025/11/19 11:34:08
permalink: /algorithm/tree/
---

## 树的遍历
::: info ==**遍历**==
- 广度优先
    - 层序遍历：1 2 3 4 5 6 7
- 深度优先
    - 前序遍历：**根** 左 右 
    - 中序遍历：左 **根** 右
    - 后序遍历：左 **根** 中
:::
![Alt text](https://www.hello-algo.com/chapter_tree/binary_tree_traversal.assets/binary_tree_dfs.png)

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
- 插入/删除会自动旋转维持平衡（靠 **LL、RR、LR、RL** 旋转）


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
