# 安全与发布审查

最后审查日期：2026-08-23

## 已核验

- 前端仅读取 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_PUBLISHABLE_KEY`。
- 未在仓库中发现 `service_role`、Secret key、数据库密码或硬编码令牌。
- `.env.local` 被 `.gitignore` 忽略，`.env.example` 不包含真实密钥。
- 学习相关表均在迁移中启用 RLS，策略按 `auth.uid() = user_id` 限制数据归属，并包含 `WITH CHECK`。
- 阅读进度、生词掌握、生词本和学习会话均有用户维度唯一约束或唯一索引，支持幂等同步。
- `npm audit --registry=https://registry.npmjs.org --omit=dev --audit-level=high`：0 vulnerabilities。
- 本地单元测试：30/30 通过；生产构建通过。

## 发布前仍需人工确认

- 在 Supabase Dashboard 回读每张表的 RLS 开关、策略和 Data API 暴露状态。
- 当前 CLI 对远端 Postgres 的迁移回读失败（`LegacyDbConnectError`），因此不能把远端数据库核验标记为已通过。
- 公开部署前为匿名登录启用 CAPTCHA、速率限制和滥用监控。
- 发布正式版前完成 HTTPS、PWA Service Worker 更新、Tauri 安装包签名和实机安装验收。
- 不在前端环境变量、日志、Issue 或提交信息中写入 Supabase Secret key、数据库密码或其他凭据。
