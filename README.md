# 翯翯英语阅读 · Web

这是从原 uni-app 小程序独立出来的可交互式英语阅读网页项目。原项目目录不参与本项目的构建和修改。

## 当前能力

- 书架：展示 4 本本地精选读物，支持网格 / 列表视图、真实阅读进度和继续阅读定位
- 阅读器：章节内容、字体调节、滚动位置记忆、上一章 / 下一章、标记章节已读
- 生词本：搜索、全部 / 未掌握 / 已掌握筛选、A-Z 排序、移除和复习模式
- 我的：掌握单词、生词本、已读章节、累计阅读时长和学习天数
- 本地优先：学习状态按浏览器用户命名空间保存，配置环境变量后自动尝试 Supabase 同步
- Supabase：已初始化 CLI 配置和学习数据表迁移，使用匿名会话实现无登录界面的用户隔离
- PWA：提供 Web App Manifest、Service Worker 缓存和浏览器安装提示，支持离线打开应用壳
- 桌面端准备：已加入 Tauri 2 工程，可复用同一套 Vue 前端构建 Windows 桌面应用

## 本地运行

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

在 `.env.local` 中填写 Supabase URL 和 publishable key。不要把 `.env.local`、数据库密码或任何 secret 提交到 Git。

## 检查命令

```bash
npm test -- --run
npm run build
```

构建产物位于 `dist/`，可部署到任意静态网站托管服务。生产环境只需要提供两个前端公开配置：`VITE_SUPABASE_URL` 和 `VITE_SUPABASE_PUBLISHABLE_KEY`。禁止把 Secret key、数据库密码或服务端密钥放入前端环境变量。

## PWA 与桌面端

- PWA：生产环境通过 HTTPS 提供 `dist/`（`localhost` 开发环境例外），浏览器满足安装条件后会显示安装提示。
- PWA 更新：Service Worker 采用网络优先策略，并缓存应用壳；发布新版本时会清理旧缓存并在页面显示“新版本已准备好”，用户确认后激活并刷新。
- Tauri 开发：`npm run tauri:dev`
- Tauri 构建：`npm run tauri:build`
- Tauri 检查：`npm run tauri:check`

当前 Tauri 阶段完成了桌面端工程骨架、应用标识、窗口配置、Supabase 网络访问 CSP 和 Windows 打包图标；正式发布仍需完成安装包实机验收、签名和自动更新策略。

## Supabase 下一步

1. 在 Supabase Dashboard 的 Authentication > Providers 中启用 Anonymous Sign-Ins。
2. 使用 `supabase db push --linked` 部署 `supabase/migrations/`。
3. 如本地 CLI 因远端 TLS 连接失败，改用 Dashboard 的 SQL Editor 执行迁移文件，并回读表结构与 RLS 策略。

## 当前边界

- 学习统计包含本地即时计算，并通过 Supabase 同步学习时长与复习数据；离线时会进入同步队列。
- 当前匿名登录适合自用和小范围使用；若公开发布，需要增加 CAPTCHA、速率限制和账号迁移方案。
- PWA 的 Service Worker 只缓存应用壳和成功访问过的同源静态资源，不代替 Supabase 数据同步。

## 发布前清单

1. 在目标托管服务配置 `.env.local` 中同名的两个 Vite 变量。
2. 在 Supabase Authentication 中确认 Anonymous Sign-Ins 已启用，并检查所有表的 RLS。
3. 执行 `npm test -- --run` 和 `npm run build`。
4. 上传 `dist/`，验证书架、阅读位置、生词本复习和个人统计四条主流程。
5. 生产环境关闭调试日志，并为匿名用户配置 CAPTCHA 或访问限制。
6. 阅读 `SECURITY.md`，完成远端 RLS/Data API 回读、安装包验收和凭据复核。
