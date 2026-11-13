import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'node:fs'

function sidebarSection(text, folder) {
  const directory = new URL(`../${folder}/`, import.meta.url)
  return {
    text,
    items: readdirSync(directory)
      .filter(name => name.endsWith('.md'))
      .map(name => {
        const source = readFileSync(new URL(name, directory), 'utf8')
        const title = source.match(/^# (.+)$/m)?.[1]
        if (!title) throw new Error(`${folder}/${name} 缺少一级标题`)
        const page = name === 'index.md' ? '' : name.slice(0, -3)
        return { text: title, link: `/${folder}/${page}` }
      })
      .sort((a, b) => a.link.localeCompare(b.link)),
  }
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'WorkTeam',
  description: '团队与 Agent 共用的研发工作空间',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '开始阅读', link: '/guide/' },
      { text: '示例项目', link: '/example/' },
      { text: '仓库配置', link: '/guide/repositories' },
    ],
    sidebar: [
      sidebarSection('使用指南', 'guide'),
      sidebarSection('AI 云存储示例', 'example'),
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/2Rui88/WorkTeam' }],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: { noResultsText: '没有找到文档', resetButtonTitle: '清空搜索', backButtonTitle: '返回' },
        },
      },
    },
    outline: { label: '本页目录', level: [2, 3] },
    sidebarMenuLabel: '文档目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '主题',
    lastUpdated: { text: '更新于' },
    docFooter: { prev: '上一页', next: '下一页' },
  },
})
