/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', link: '/' ,icon: 'material-symbols:home-outline' },
  { text: '博客', link: '/blog/',icon:'pixelarticons:notes'},
  // { text: '标签', link: '/blog/tags/' },
  // { text: 'leetcode', link: '/blog/tags/' },
  // { text: '归档', link: '/blog/archives/' },
  { text: '后端', link:'/backend/mysql.md' ,icon:'mdi:server'},
  // {
  //   text: '笔记',
  //   items: [{ text: '示例', link: '/demo/README.md' }]
  // },
])
