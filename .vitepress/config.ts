import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'ChenyuHeee',
  description: '个人网站门户（Gateway）',
  base: '/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
    ['meta', { name: 'theme-color', content: '#6366F1' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Blog', link: 'https://chenyuheee.github.io/blog/' },
      { text: 'Portfolio', link: 'https://chenyuheee.github.io/portfolio/' },
      { text: 'Life', link: 'https://chenyuheee.github.io/life/' },
      { text: 'Links', link: 'https://chenyuheee.github.io/links/' },
      { text: 'Email', link: 'mailto:hechenyu@zju.edu.cn' }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/chenyuheee' }]
  }
})
