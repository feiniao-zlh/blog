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
# 无仓库 拉取指定分支 
git clone -b <branch-name> --single-branch <repo-url>

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
# 拉远端最新代码
git fetch orign

# 合并 会生成一个新的merge commit
git merge --no-ff <branch-name-a>

# fast合并模式 不保留原分支痕迹
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

