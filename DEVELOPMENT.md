# 🔐 Fuck 2FA - 开发指南

## 📋 开发进度

- ✅ **1. 搭建 Supabase 项目 & TOTP 表结构**
- ✅ **2. 前端使用 Supabase auth 登录**
- ✅ **3. 构建 Cloudflare Worker 验证 Supabase token 并生成 TOTP**
- ✅ **4. 前端 dashboard 获取并展示 TOTP code（轮询或实时）**
- ⏳ **5. 支持 CRUD 管理 TOTP 项目**
- ⏳ **6. 增加分享链接（公共读取某个 secret）**

## 🚀 快速开始

### 1. 准备 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 创建新项目
2. 在 SQL Editor 中执行 `supabase/schema.sql` 文件中的 SQL 语句
3. 在 Settings → API 中获取：
   - `Project URL`
   - `anon/public key`
   - `service_role key`（用于 Cloudflare Worker）

### 2. 配置前端环境

```bash
cd frontend/fuck-2fa
npm install --legacy-peer-deps

# 创建环境变量文件
cp .env.local.example .env.local
```

在 `.env.local` 中配置：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_WORKER_URL=https://your-worker.your-subdomain.workers.dev
```

启动前端开发服务器：
```bash
npm run dev
```

### 3. 配置 Cloudflare Worker 后端

```bash
cd backend
npm install

# 配置 Supabase 环境变量
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# 本地开发
npm run dev

# 部署到 Cloudflare
npm run deploy
```

## 🔧 技术栈详解

### 前端 (Next.js + Tailwind + shadcn/ui)

- **认证**: Supabase Auth（邮箱 + GitHub 登录）
- **UI 组件**: shadcn/ui (不直接依赖 Radix UI)
- **状态管理**: React Context API
- **样式**: Tailwind CSS
- **类型**: TypeScript

### 后端 (Cloudflare Workers)

- **TOTP 生成**: `otplib` 库
- **数据库**: Supabase PostgreSQL
- **认证**: JWT 验证
- **API**: RESTful endpoints

### 数据库 (Supabase PostgreSQL)

#### 主要表结构：

**totp_secrets**
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key to auth.users)
- label: text (用户定义的标签)
- secret: text (TOTP 密钥)
- issuer: text (可选，发行方)
- algorithm: text (default: 'SHA1')
- digits: integer (default: 6)
- period: integer (default: 30)
- created_at/updated_at: timestamptz
```

**shared_secrets**
```sql
- id: uuid (primary key)
- secret_id: uuid (foreign key to totp_secrets)
- share_token: text (unique, 公共分享令牌)
- expires_at: timestamptz (可选过期时间)
- created_at: timestamptz
```

## 🔐 API 端点

### Worker APIs

#### GET `/api/totp?secret_id=<uuid>`
**需要认证**: 是  
**描述**: 生成指定 secret 的 TOTP 验证码

**响应**:
```json
{
  "code": "123456",
  "label": "Gmail",
  "issuer": "Google",
  "expires_in": 23
}
```

#### GET `/api/share/<share_token>`
**需要认证**: 否  
**描述**: 通过分享令牌获取 TOTP 验证码

**响应**:
```json
{
  "code": "123456",
  "label": "Gmail",
  "issuer": "Google", 
  "expires_in": 23,
  "readonly": true
}
```

## 📱 前端组件架构

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/
│   ├── ui/                # 基础 UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── auth/              # 认证相关
│   │   └── LoginForm.tsx
│   ├── dashboard/         # 仪表盘
│   │   ├── Dashboard.tsx
│   │   └── AddSecretDialog.tsx
│   └── totp/              # TOTP 相关
│       └── TOTPCard.tsx
├── contexts/              # React Context
│   └── AuthContext.tsx
└── lib/                   # 工具函数
    ├── supabase.ts
    └── utils.ts
```

## 🧪 测试和开发

### 前端测试
```bash
cd frontend/fuck-2fa
npm run lint
npm run build
```

### 后端测试
```bash
cd backend
npm run build
npm test  # (可选，需要设置 Vitest)
```

## 🚀 部署

### Supabase 配置
1. 在 Authentication → Settings 中配置允许的重定向 URLs
2. 启用 GitHub OAuth (可选)

### 前端部署 (Vercel 推荐)
```bash
cd frontend/fuck-2fa
npm run build
# 部署到 Vercel/Netlify 等
```

### 后端部署 (Cloudflare Workers)
```bash
cd backend
wrangler deploy
```

## 🔍 故障排除

### 常见问题

1. **React 19 依赖冲突**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Supabase 连接失败**
   - 检查环境变量配置
   - 确认 RLS 策略正确设置

3. **TOTP 生成失败**
   - 检查 Cloudflare Worker 环境变量
   - 确认 secret 格式正确（Base32）

4. **认证问题**
   - 检查 JWT token 是否正确传递
   - 确认 Supabase service role key 配置

## 📚 下一步开发

- [ ] 添加二维码扫描功能
- [ ] 支持批量导入/导出
- [ ] 添加搜索和过滤功能
- [ ] 实现数据备份功能
- [ ] 添加 PWA 支持
- [ ] 优化移动端体验 