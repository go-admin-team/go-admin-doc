(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{184:function(s,t,n){"use strict";n.r(t);var a=n(0),e=Object(a.a)({},(function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("div",{staticClass:"content"},[s._m(0),s._v(" "),s._m(1),n("div",{staticClass:"tip custom-block"},[n("p",{staticClass:"custom-block-title"},[s._v("⚠️ 注意")]),s._v(" "),n("p",[s._v("在 windows 环境中会出现这个问题；")]),s._v(" "),s._m(2),n("p",[s._v("or")]),s._v(" "),s._m(3),n("p",[n("router-link",{attrs:{to:"/guide/other/faq.html#_5-cgo-exec-missing-cc-exec-missing-cc-file-does-not-exist"}},[s._v("解决 cgo 问题进入")])],1)]),s._v(" "),s._m(4),s._v(" "),n("table",[s._m(5),s._v(" "),n("tbody",[n("tr",[n("td",[n("a",{attrs:{href:"https://github.com/go-admin-team/go-admin/issues",target:"_blank",rel:"noopener noreferrer"}},[s._v("go-admin/issues"),n("OutboundLink")],1)]),s._v(" "),s._m(6),s._v(" "),s._m(7)])])])])}),[function(){var s=this.$createElement,t=this._self._c||s;return t("h2",{attrs:{id:"_5-分钟上手-go-admin"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-分钟上手-go-admin"}},[this._v("#")]),this._v(" 5 分钟上手 go-admin")])},function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 创建目录")]),s._v("\n$ "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("mkdir")]),s._v(" myproject "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" myproject\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# clone 项目")]),s._v("\n$ "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" clone https://github.com/go-admin-team/go-admin.git\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 进入go-admin根目录")]),s._v("\n$ "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" ./go-admin\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 编译server")]),s._v("\n$ go build\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 修改数据库连接")]),s._v("\n$ "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("vi")]),s._v(" config/settings.yml\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# database:")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#     # 数据库类型 mysql")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#     driver: mysql")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#     # 数据库连接字符串 mysql 缺省信息 charset=utf8&parseTime=True&loc=Local&timeout=1000ms")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#     source: user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8&parseTime=True&loc=Local&timeout=1000ms")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 初始化数据库")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# macOS or linux 下使用")]),s._v("\n$ ./go-admin migrate -c"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("config/settings.dev.yml\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# ⚠️注意:windows 下使用")]),s._v("\n$ go-admin.exe migrate -c"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("config/settings.dev.yml\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 启动服务")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# macOS or linux 下使用")]),s._v("\n$ ./go-admin server -c"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("config/settings.yml\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# ⚠️注意:windows 下使用")]),s._v("\n$ go-admin.exe server -c"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("config/settings.yml\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br"),n("span",{staticClass:"line-number"},[s._v("32")]),n("br"),n("span",{staticClass:"line-number"},[s._v("33")]),n("br"),n("span",{staticClass:"line-number"},[s._v("34")]),n("br")])])},function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("E:"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("go-admin"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("go build\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# github.com/mattn/go-sqlite3")]),s._v("\ncgo: "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exec")]),s._v(" /missing-cc: exec: "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/missing-cc"')]),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("file")]),s._v(" does not exist\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br")])])},function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("D:"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("Code"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("go-admin"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("go build\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# github.com/mattn/go-sqlite3")]),s._v("\ncgo: "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exec")]),s._v(" gcc: exec: "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"gcc"')]),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" executable "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("file")]),s._v(" not found "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" %"),n("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("PATH")]),s._v("%\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br")])])},function(){var s=this.$createElement,t=this._self._c||s;return t("h2",{attrs:{id:"反馈"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#反馈"}},[this._v("#")]),this._v(" 反馈")])},function(){var s=this.$createElement,t=this._self._c||s;return t("thead",[t("tr",[t("th",[this._v("Github Issue")]),this._v(" "),t("th",[this._v("微信群")]),this._v(" "),t("th",[this._v("QQ 群")])])])},function(){var s=this.$createElement,t=this._self._c||s;return t("td",[t("img",{attrs:{src:"https://gitee.com/mydearzwj/image/raw/master/img/wx.png",width:"60"}})])},function(){var s=this.$createElement,t=this._self._c||s;return t("td",[t("img",{attrs:{src:"https://gitee.com/mydearzwj/image/raw/master/img/qq2.png",width:"60"}})])}],!1,null,null,null);t.default=e.exports}}]);