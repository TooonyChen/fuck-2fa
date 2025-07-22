# 🚀 Supabase Edge Functions Deployment Guide

## 🛠️ **Deployment Steps**

### 1. Install Supabase CLI

```bash
# Install using npm
npm install -g supabase

# Or using brew (macOS)
brew install supabase/tap/supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Initialize Project

```bash
# Run in project root directory
supabase init
```

### 4. Link to Your Supabase Project

```bash
supabase link --project-ref your-project-ref
```

### 5. Deploy Edge Functions

```bash
# Deploy TOTP generation function
supabase functions deploy generate-totp

# Deploy shared TOTP function
supabase functions deploy shared-totp
```

## 🔧 **Environment Variables Configuration**

### Frontend (.env.local)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Edge Functions Environment Variables

Set the following environment variables in Supabase Dashboard:

1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Edge Functions** → **Settings**
4. Add environment variables (generally these three are available by default, no need to add repeatedly, just check):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📁 **File Structure**

```
supabase/
├── functions/
│   ├── generate-totp/
│   │   └── index.ts        # User TOTP generation
│   └── shared-totp/
│       └── index.ts        # Shared TOTP generation
└── schema.sql              # Database schema
```

## 🔗 **API Endpoints**

### User TOTP Generation

```
GET https://your-project.supabase.co/functions/v1/generate-totp?secret_id=xxx
Authorization: Bearer <user_jwt_token>
```

**Response Example:**
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

### Shared TOTP Generation

```
GET https://your-project.supabase.co/functions/v1/shared-totp?share_token=abc123
```

**Response Example:**
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

## 🧪 **Local Development**

### Start Local Supabase

```bash
supabase start
```

### Run Edge Functions Locally

```bash
# Start Edge Functions service
supabase functions serve

# Test specific function
supabase functions serve generate-totp --no-verify-jwt
```

### Test API

```bash
# Test TOTP generation
curl -X GET 'http://localhost:54321/functions/v1/generate-totp?secret_id=test' \
  -H 'Authorization: Bearer your-jwt-token'

# Test shared TOTP  
curl -X GET 'http://localhost:54321/functions/v1/shared-totp?share_token=test'
```

## 🔒 **Security Configuration**

### Row Level Security (RLS)

Ensure RLS is enabled in Supabase:

```sql
-- Already configured in schema.sql
ALTER TABLE totp_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_secrets ENABLE ROW LEVEL SECURITY;
```

### CORS Configuration

Edge Functions handle CORS automatically, no additional configuration needed.

## 🚀 **Production Deployment Checklist**

- [ ] ✅ Deploy Edge Functions to Supabase
- [ ] ✅ Configure environment variables
- [ ] ✅ Test TOTP generation functionality
- [ ] ✅ Test sharing link functionality  
- [ ] ✅ Verify RLS policies
- [ ] ✅ Update frontend environment variables
- [ ] ✅ Test end-to-end workflow

## 🐛 **Troubleshooting**

### Common Issues

1. **Function deployment fails**
   ```bash
   # Check function syntax
   supabase functions serve generate-totp --no-verify-jwt
   ```

2. **JWT validation fails**
   ```bash
   # Check if token is correct
   curl -X GET 'your-url' -H 'Authorization: Bearer your-token' -v
   ```

3. **Environment variables not taking effect**
   - Check environment variable settings in Supabase console
   - Redeploy function: `supabase functions deploy function-name`

### Debugging Tips

```typescript
// Add logs in Edge Function
console.log('Debug info:', { userId, secretId })
```

View logs:
```bash
supabase functions logs generate-totp
```

## 📚 **Related Documentation**

- [Supabase Edge Functions Official Documentation](https://supabase.com/docs/guides/functions)
- [Deno Runtime Documentation](https://deno.land/manual)
- [TOTP Algorithm Specification](https://tools.ietf.org/html/rfc6238)

## 🆚 **Migration Guide**

If you previously used Cloudflare Workers, you can now safely:

1. ✅ Delete the `backend/` directory
2. ✅ Remove `NEXT_PUBLIC_WORKER_URL` environment variable
3. ✅ Frontend code has been automatically updated to use Edge Functions
4. ✅ Enjoy a simpler deployment process! 