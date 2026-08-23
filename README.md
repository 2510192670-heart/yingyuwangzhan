# 翯翯英语阅读 · Web

这是从原 uni-app 小程序独立出来的可交互式英语阅读网页项目。原项目目录不参与本项目的构建和修改。

## 当前能力

- 书架：展示 4 本本地精选读物，支持打开书籍并切换章节
- 阅读器：章节内容、阅读进度记忆、标记章节已读
- 生词本 / 我的：保留网页端信息架构，学习状态由 Pinia 管理
- 本地优先：学习状态按浏览器用户命名空间保存，后续通过 Supabase 同步
- Supabase：已初始化 CLI 配置和学习数据表迁移，使用匿名会话实现无登录界面的用户隔离

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

## Supabase 下一步

1. 在 Supabase Dashboard 的 Authentication > Providers 中启用 Anonymous Sign-Ins。
2. 使用 `supabase db push --linked` 部署 `supabase/migrations/`。
3. 如本地 CLI 因远端 TLS 连接失败，改用 Dashboard 的 SQL Editor 执行迁移文件，并回读表结构与 RLS 策略。

## 后续路线

1. 完成单词高亮、点击释义、生词本卡片和掌握状态交互。
2. 增加 Supabase 同步队列、离线重试和冲突合并。
3. 加入搜索、阅读设置、桌面端安装能力（PWA / Tauri 评估）。
4. 完成浏览器端视觉验收、可访问性、性能和发布检查。
