---
title: 静态站点 首页异常（CSS 404 / 刷新错乱）
tags:
 - Q&A
createTime: 2025/11/16 02:17:48
permalink: /blog/questions/
---

**场景**：vuepress + vercel + clodflare

::: note 问题：
==**首页异常、刷新错乱、CSS 404**== 
:::

::: important 原因：
1. **生成的静态资源是哈希文件，每次都不一样**
2. **clouflare缓存旧文件，旧文件引旧资源而旧资源已不存在**
:::

**举例**：
- 用户访问首页 → Cloudflare 返回旧 HTML → 里面引用 app-abc.css
- 用户请求 app-abc.css → Vercel 上不存在 → 404 → 首页没样式

::: tip 解决：
- **clouflare增加cache rules(禁止缓存html):**

对路径 **(http.request.uri.path eq "/") or (ends_with(http.request.uri.path, ".html"))**

完全不缓存 **Cache eligibility：Bypass Cache（完全不缓存）**

- **Purge Everything**: 清除所有缓存（全网所有节点、所有文件，不看规则、不看路径、不看类型）
:::

***
## ==**详细原因**==：
1. **VuePress / Plume 的静态资源是“带哈希的文件”** 

如：
```js ts:no-line-numbers
/assets/app-abc123.css
/assets/chunk-def456.js
```

**特点**：
- 每次构建 hash 会变
- 新旧文件名字永远不一样
- 旧文件会被 Vercel 删除

2. **Cloudflare缓存了html文件**

Cloudflare 不是智能判断“哪些文件不能缓存”，它只会根据代理策略尽力缓存所有静态内容。
如果你不开规则，index.html 默认被缓存是正常的