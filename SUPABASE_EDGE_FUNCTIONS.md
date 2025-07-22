# 🚀 Supabase Edge Functions 部署指南

使用 **Supabase Edge Functions** 代替 Cloudflare Workers 来生成TOTP代码。

## 📋 **优势对比**

| 功能 | Supabase Edge Functions | Cloudflare Workers |
|------|------------------------|-------------------|
| **生态系统整合** | ✅ 与Supabase完美整合 | ❌ 需要单独配置 |
| **JWT验证** | ✅ 内置支持 | ❌ 需要手动验证 |
| **数据库访问** | ✅ 直接访问 | ❌ 需要配置连接 |
| **部署便利性** | ✅ 一键部署 | ❌ 需要单独部署 |
| **CORS处理** | ✅ 自动处理 | ❌ 需要手动配置 |

## 🛠️ **部署步骤**

### 1. 安装Supabase CLI

```bash
# 使用npm安装
npm install -g supabase

# 或使用brew (macOS)
brew install supabase/tap/supabase
```

### 2. 登录Supabase

```bash
supabase login
```

### 3. 初始化项目

```bash
# 在项目根目录运行
supabase init
```

### 4. 链接到你的Supabase项目

```bash
supabase link --project-ref your-project-ref
```

### 5. 部署Edge Functions

```bash
# 部署TOTP生成函数
supabase functions deploy generate-totp

# 部署共享TOTP函数
supabase functions deploy shared-totp
```

## 🔧 **环境变量配置**

### Frontend (.env.local)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Edge Functions 环境变量

在Supabase控制台设置以下环境变量：

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Edge Functions** → **Settings**
4. 添加环境变量：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📁 **文件结构**

```
supabase/
├── functions/
│   ├── generate-totp/
│   │   └── index.ts        # 用户TOTP生成
│   └── shared-totp/
│       └── index.ts        # 共享TOTP生成
└── schema.sql              # 数据库架构
```

## 🔗 **API端点**

### 用户TOTP生成

```
GET https://your-project.supabase.co/functions/v1/generate-totp?secret_id=xxx
Authorization: Bearer <user_jwt_token>
```

**响应示例：**
```json
{
  "code": "123456",
  "label": "Gmail",
  "issuer": "Google",
  "expires_in": 22,
  "algorithm": "SHA1",
  "digits": 6
}
```

### 共享TOTP生成

```
GET https://your-project.supabase.co/functions/v1/shared-totp?share_token=abc123
```

**响应示例：**
```json
{
  "code": "654321",
  "label": "Gmail",
  "issuer": "Google", 
  "expires_in": 22,
  "readonly": true,
  "share_expires_at": "2024-01-01T00:00:00Z"
}
```

## 🧪 **本地开发**

### 启动本地Supabase

```bash
supabase start
```

### 本地运行Edge Functions

```bash
# 启动Edge Functions服务
supabase functions serve

# 测试特定函数
supabase functions serve generate-totp --no-verify-jwt
```

### 测试API

```bash
# 测试TOTP生成
curl -X GET 'http://localhost:54321/functions/v1/generate-totp?secret_id=test' \
  -H 'Authorization: Bearer your-jwt-token'

# 测试共享TOTP  
curl -X GET 'http://localhost:54321/functions/v1/shared-totp?share_token=test'
```

## 🔒 **安全配置**

### Row Level Security (RLS)

确保在Supabase中启用RLS：

```sql
-- 已在schema.sql中配置
ALTER TABLE totp_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_secrets ENABLE ROW LEVEL SECURITY;
```

### CORS配置

Edge Functions自动处理CORS，无需额外配置。

## 🚀 **生产部署检查清单**

- [ ] ✅ 部署Edge Functions到Supabase
- [ ] ✅ 配置环境变量
- [ ] ✅ 测试TOTP生成功能
- [ ] ✅ 测试共享链接功能  
- [ ] ✅ 验证RLS策略
- [ ] ✅ 更新前端环境变量
- [ ] ✅ 测试端到端流程

## 🐛 **故障排除**

### 常见问题

1. **函数部署失败**
   ```bash
   # 检查函数语法
   supabase functions serve generate-totp --no-verify-jwt
   ```

2. **JWT验证失败**
   ```bash
   # 检查token是否正确
   curl -X GET 'your-url' -H 'Authorization: Bearer your-token' -v
   ```

3. **环境变量未生效**
   - 检查Supabase控制台中的环境变量设置
   - 重新部署函数：`supabase functions deploy function-name`

### 调试技巧

```typescript
// 在Edge Function中添加日志
console.log('Debug info:', { userId, secretId })
```

查看日志：
```bash
supabase functions logs generate-totp
```

## 📚 **相关文档**

- [Supabase Edge Functions 官方文档](https://supabase.com/docs/guides/functions)
- [Deno Runtime 文档](https://deno.land/manual)
- [TOTP Algorithm 规范](https://tools.ietf.org/html/rfc6238)

## 🆚 **迁移指南**

如果你之前使用Cloudflare Workers，现在可以安全地：

1. ✅ 删除 `backend/` 目录
2. ✅ 移除 `NEXT_PUBLIC_WORKER_URL` 环境变量
3. ✅ 前端代码已自动更新使用Edge Functions
4. ✅ 享受更简单的部署流程！ 