# 安全与发布审查

最后审查日期：2026-08-23

## 已核验

- 前端仅读取 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_PUBLISHABLE_KEY`。
- 未在仓库中发现 `service_role`、Secret key、数据库密码或硬编码令牌。
- `.env.local` 被 `.gitignore` 忽略，`.env.example` 不包含真实密钥。
- 学习相关表均在迁移中启用 RLS，策略按 `auth.uid() = user_id` 限制数据归属，并包含 `WITH CHECK`。
- 阅读进度、生词掌握、生词本和学习会话均有用户维度唯一约束或唯一索引，支持幂等同步。
- `npm audit --registry=https://registry.npmjs.org --omit=dev --audit-level=high`：0 vulnerabilities。
- Supabase Data API 只读可达性检查返回 HTTP 200，当前未读出任何行。
- 本地单元测试：30/30 通过；生产构建通过。
- Dashboard Policies 页面确认 6 张用户表均显示 RLS 已开启，策略为 ALL，目标角色显示为 authenticated（匿名登录在 Dashboard 中作为 anonymous sign-ins 展示）。
- `reading progress own rows` 策略只读核验确认同时包含 `USING (auth.uid() = user_id)` 和 `WITH CHECK (auth.uid() = user_id)`；其余表使用同一迁移模板，仍建议逐表抽查。

## 发布前仍需人工确认

- 在 Supabase Dashboard 回读每张表的 RLS 开关、策略和 Data API 暴露状态。
- 当前 CLI 对远端 Postgres 的迁移回读失败（`LegacyDbConnectError`），因此不能把远端数据库核验标记为已通过。
- 仅凭匿名 Data API 的空结果不能证明跨用户隔离已通过，仍需在 Dashboard 或有效用户会话下验证 RLS。
- Security Advisor 当前报告 0 errors、10 warnings：包括 `public.rls_auto_enable()` 可公开执行、6 条匿名登录策略提示，以及 Auth 泄露密码保护关闭。
- 待授权的远端修复：撤销 `public.rls_auto_enable()` 对 `PUBLIC`、`anon`、`authenticated` 的 EXECUTE 权限；在 Auth Protection 中按产品需要开启 Leaked Password Protection。
- 公开部署前为匿名登录启用 CAPTCHA、速率限制和滥用监控。
- 发布正式版前完成 HTTPS、PWA Service Worker 更新、Tauri 安装包签名和实机安装验收。
- 不在前端环境变量、日志、Issue 或提交信息中写入 Supabase Secret key、数据库密码或其他凭据。
