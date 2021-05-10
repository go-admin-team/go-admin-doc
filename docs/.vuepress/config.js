var nav = require('./nav.js')
var { EcosystemNav, ComponentNav } = nav

var utils = require('./utils.js')
var { genNav, getComponentSidebar, deepClone } = utils

module.exports = {
  title: 'go-admin',
  description: 'A magical vue admin',
  base: '/1.3.2/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ]
  ],
  themeConfig: {
    repo: 'go-admin-team/go-admin',
    docsRepo: 'go-admin-team/go-admin-doc',
    lastUpdated: '上次更新',
    docsDir: 'docs',
    editLinks: true,
    sidebarDepth: 3,
    algolia: {
      apiKey: '',
      indexName: 'go-admin'
    },
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: '指南',
            link: '/guide/'
          },
          {
            text: '捐赠',
            link: '/donate/'
          },
          {
            text: '最新doc',
            link: 'https://doc.go-admin.dev/'
          }
        ],
        sidebar: {
          '/guide/': [
            {
              title: '指南',
              collapsable: false,
              children: genEssentialsSidebar()
            },
            {
              title: '规范',
              collapsable: false,
              children: ['/guide/norm.md', '/guide/db.md']
            },
            {
              title: '第一个go-admin应用',
              collapsable: false,
              children: genAdvancedSidebar()
            },
            {
              title: '进阶',
              collapsable: false,
              children: [
                '/guide/advanced/api.md',
                '/guide/advanced/models.md',
                '/guide/advanced/dto.md',
                '/guide/advanced/service.md',
                '/guide/advanced/router.md',
                '/guide/advanced/advanced.md',
                '/guide/advanced/bus.md'
              ]
            },
            {
              title: '其他',
              collapsable: false,
              children: ['/guide/other/faq.md', '/guide/other/ide.md']
            }
          ]
        }
      },
      '/en/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Guide',
            link: '/en/guide/'
          },
          {
            text: 'Donate',
            link: '/en/donate/'
          }
        ],
        sidebar: {
          '/en/guide/': [
            {
              title: 'Docment',
              collapsable: false,
              children: genEssentialsSidebar('/en')
            },
            {
              title: 'First go admin app',
              collapsable: false,
              children: genAdvancedSidebar('/en')
            },
            {
              title: 'Advanced',
              collapsable: false,
              children: []
            },
            {
              title: 'Other',
              collapsable: false,
              children: []
            },
            {
              title: 'Norm',
              collapsable: false,
              children: ['/guide/norm.md']
            }
          ]
        }
      }
    }
  },
  locales: {
    '/': {
      lang: 'zh-CN',
      description: '基于Gin+Vue+Element UI的中后台系统脚手架'
    },
    '/en/': {
      lang: 'en-US',
      description: 'A magical go-admin'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@public': './public'
      }
    }
  },
  ga: 'UA-109340118-1'
}

function genEssentialsSidebar(type = '') {
  const mapArr = [
    '/guide/',
    '/guide/ksks.md',
    '/guide/env.md',
    '/guide/path.md',
    '/guide/settings.md',
    '/guide/spjc.md',
    '/guide/hjbs.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genAdvancedSidebar(type = '') {
  const mapArr = ['/guide/intro/tutorial01.md', '/guide/intro/tutorial02.md']
  return mapArr.map(i => {
    return type + i
  })
}
