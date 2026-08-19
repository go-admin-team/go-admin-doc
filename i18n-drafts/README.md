# 翻译草稿

存放尚未启用的语种文件。

`.dumirc.ts` 中的 `locales` 目前是注释状态，此时放在 `docs/` 下的 `.en-US.md`
会被 dumi 当作普通页面处理，生成 `/index/en--us` 这类路由并混入顶部导航。因此
在启用多语言之前，译稿先放在这里。

启用步骤：

1. 取消 `.dumirc.ts` 中 `locales` 的注释；
2. 同步 `scripts/postbuild-seo.mjs` 的 `LOCALE_BASES`;
3. 把本目录下的文件移回 `docs/` 对应位置。

注意 dumi 不做语言回退——缺少 `.{id}.md` 的页面在该语种下不会生成路由，因此
启用前需要确保至少 guide 一组已完整翻译，否则语言切换器会指向一个残缺的站点。
