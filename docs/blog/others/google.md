---
title: Google SEO 全流程
tags:
  - seo
createTime: 2025/11/16 16:20:27
permalink: /blog/h7fg20mz/
---

1. 添加站点**根域名**到 [Google Search Console](https://search.google.com/search-console/)
    ::: important 这是整个 SEO 的第一步，没有它就不存在爬取
    :::
2. 验证会跳转到Cloudflare 自动添加 DNS TXT 验证记录
3. 让 Google 能找到你所有页面（sitemap）
    - VuePress / Plume 会自动生成 [sitemap](https://blog.eqxph.com/sitemap.xml)
    - 提交到 Search Console
4. robots.txt 必须允许 Googlebot（开启cloudflare AI Crawl Control 也会自动新建）
5. Cloudflare 规则：禁止缓存 HTML
    - 确保 Google 永远抓的是最新页面
    - [配置方式](/blog/fqtjyt9u/)
    ::: info 防止 Google 抓旧版本页面（会影响排名）
    :::
6. 主动提交
    - Search Console → URL 检查 输入你的[首页](https://blog.eqxph.com/)
    - 请求编入索引，Google 会立即派出爬虫抓取你的首页

