var EcosystemNav = [
  {
    textEN: 'Repositories',
    textES: 'Repositorios',
    textZH: '项目',
    items: [
      {
        text: 'go-admin',
        link: 'https://github.com/go-admin-team/go-admin'
      }
    ]
  },
  {
    textEN: 'Help',
    textES: 'Ayuda',
    textZH: '帮助',
    items: [
      {
        textZH: '常见问题',
        link: '/guide/other/faq.md',
        type: 'ZH'
      },
      {
        textZH: 'QQ群',
        link: 'https://github.com/go-admin-team/go-admin/issues',
        type: 'ZH'
      },
      {
        text: 'Changelog',
        textES: 'Registro de cambios',
        textZH: '更新记录',
        link: 'https://github.com/go-admin-team/go-admin/releases'
      }
    ]
  }
]

var ComponentNav = [
  {
    text: 'Component',
    textES: 'Componente',
    textZH: '组件',
    items: [
      {
        text: 'Rich Text Editor',
        textES: 'Editor de Texto Enriquecido',
        textZH: '富文本',
        link: '/feature/component/rich-editor.md'
      },
      {
        text: 'Markdown Editor',
        textES: 'Editor de Markdown',
        textZH: 'Markdown 编辑器',
        link: '/feature/component/markdown-editor.md'
      },
      {
        text: 'Svg Icon',
        textES: 'Icono Svg',
        textZH: 'Svg Icon 图标',
        link: '/feature/component/svg-icon.md'
      },
      {
        text: 'Clipboard',
        textES: 'Portapapeles',
        textZH: '复制粘贴',
        link: '/feature/component/clipboard.md'
      },
      {
        text: 'Excel',
        textZH: 'Excel',
        link: '/feature/component/excel.md'
      },
      {
        text: 'Pagination',
        textES: 'Paginación',
        textZH: 'Pagination 分页',
        link: '/feature/component/pagination.md'
      },
      {
        text: 'Tree Table',
        textES: 'Tabla de Árbol',
        textZH: 'Tree Table 树形表格',
        link: '/feature/component/tree-table.md'
      }
    ]
  },
  {
    text: 'Script',
    items: [
      {
        text: 'Svgo',
        link: '/feature/script/svgo.md'
      },
      {
        text: 'New',
        textES: 'Nuevo',
        link: '/feature/script/new.md'
      }
    ]
  }
]

module.exports = {
  EcosystemNav,
  ComponentNav
}
