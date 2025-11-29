import {defineClientConfig} from 'vuepress/client'
// import 'vuepress-theme-plume/client'
// import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
// import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
// import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
// import Swiper from 'vuepress-theme-plume/features/Swiper.vue'

// import CustomComponent from './theme/components/Custom.vue'

import './theme/styles/custom.css'

export default defineClientConfig({
    enhance({app}) {
        // built-in components
        // app.component('RepoCard', RepoCard)
        // app.component('NpmBadge', NpmBadge)
        // app.component('NpmBadgeGroup', NpmBadgeGroup)
        // app.component('Swiper', Swiper) // you should install `swiper`
        // // 强制客户端激活，避免 collapsed-lines 在 mobile 上初始化失败
        // app.mixin({
        //     mounted() {
        //         if (typeof window !== 'undefined') {
        //             window.dispatchEvent(new Event('scroll'))
        //         }
        //     }
        // })
        // your custom components
        // app.component('CustomComponent', CustomComponent)
    },
    mounted() {
        ensureInit()
        window.addEventListener('scroll', fixCollapsedLines, { passive: true })
    },
})

// 强制修复 collapsed-lines 在移动端（Safari/微信）初始化失败的问题
function fixCollapsedLines() {
    const collapsedBlocks = document.querySelectorAll('.has-collapsed-lines')

    collapsedBlocks.forEach((block) => {
        const collapsed = block.querySelector('.collapsed-lines')

        // 如果主题还没渲染 collapsed，手动补上
        if (collapsed && collapsed.childElementCount === 0) {
            const btn = document.createElement('div')
            btn.className = 'collapsed-lines__btn'
            btn.innerText = '展开更多代码'

            btn.onclick = () => {
                block.classList.remove('collapsed')
            }

            collapsed.appendChild(btn)
        }
    })
}

// 更稳的触发逻辑（移动端一定执行）
function ensureInit() {
    // 1. DOM 准备好后执行
    requestAnimationFrame(() => {
        fixCollapsedLines()
    })

    // 2. Safari/微信 WebView 延迟执行兜底
    setTimeout(() => {
        fixCollapsedLines()
    }, 500)

    setTimeout(() => {
        fixCollapsedLines()
    }, 1500)
}