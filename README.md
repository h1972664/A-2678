# 作品集网站 / Portfolio

个人作品集展示网站，包含平面设计（产品主图、海报/Banner、详情页、IP、Logo）、视频（TVC 广告、漫剧、数字人、MV）等模块。

## 技术栈

- 纯静态站点：`index.html` + `style.css` + `main.js`
- 无构建步骤，直接托管于 GitHub Pages

## 目录结构

```
index.html      # 页面主结构
style.css       # 样式
main.js         # 交互逻辑（灯箱放大、首页轮播、滑块等）
images/         # 图片资源（主图 / 海报 / IP / Logo / 详情页）
videos/         # 视频资源（TVC / 漫剧 / 数字人 / MV）
作品/           # 原始素材（已 gitignore，不进入仓库）
```

## 本地预览

直接用浏览器打开 `index.html` 即可；或启动一个静态服务器：

```bash
python -m http.server 8000
# 访问 http://localhost:8000
```

## 部署

仓库已关联 GitHub（`main` 分支），修改后：

```bash
git add -A
git commit -m "更新说明"
git push origin main
```

GitHub Pages 会自动重新发布。
