---
title: git
tags:
  - command
  - git
createTime: 2026/01/06 01:38:59
permalink: /blog/tw4c84lt/
---

## branch
```bash
# 本地添加分支
git switch -c <branch-name> = git checkout -b <branch-name>

# 删除本地分支
git branch -d <branch-name>

# 新建远程分支 推送 绑定
git push -u origin <branch-name>

# 删除远程分支
git push origin --delete <branch-name>
```

## git reset
```bash
git reset                # 将暂存区 回滚到最新提交状态 工作区不变
git reset --soft HEAD~x  # 删除提交历史 工作区不变 已提交文件按最后提交状态返回到暂存区 可进行重新提交
git reset --hard HEAD~x  # 删除提交历史 工作区变化 回滚到历史提交状态
```

## merge
```bash
# merge a to b
# git switch b
# merge前 先提交b
git merge <branch-name-a>

# 解决冲突
# 保留当前分支
git checkout --ours xxx.go
git add xxx.go

# 保留对方分支
git checkout --ours xxx.go
git add xxx.go

# 解决后 提交
git commit

```

## diff
```bash
git diff  # 暂存区和工作区 差别
```

