# 🔐 Fuck 2FA - Modern TOTP Management Tool

A sleek, modern TOTP (Time-based One-Time Password) management application with a beautiful dark theme, built with Next.js and Supabase.

## ✨ Features

- 🌙 **Modern Dark Theme** with glassmorphism effects
- 🔐 **Secure TOTP Generation** using Supabase Edge Functions
- 👤 **Multi-user Support** with email magic link authentication
- 💾 **Cloud Storage** with Supabase PostgreSQL
- 🔗 **Share Links** for temporary TOTP access
- 📱 **Responsive Design** works on all devices
- ⚡ **Real-time Updates** with automatic code refresh
- 🎨 **Beautiful UI** using shadcn/ui components
- 🔒 **Row Level Security** ensuring data isolation

## 🏗 Architecture

### **Frontend**
- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework  
- **shadcn/ui** - Modern component library
- **Open Sans** - Clean, readable typography

### **Backend** 
- **Supabase** - Authentication, database, and Edge Functions
- **PostgreSQL** - Robust data storage with RLS
- **Edge Functions** - Serverless TOTP generation (replaced Cloudflare Workers)

### **Security**
- **JWT Authentication** - Secure user sessions
- **Row Level Security** - Database-level access control
- **Encrypted Secrets** - TOTP secrets stored securely

## 📁 Project Structure

```
fuck-2fa/
├── frontend/fuck-2fa/           # Next.js Application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   │   ├── ui/              # shadcn/ui base components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   └── totp/            # TOTP-related components
│   │   ├── contexts/            # React Context providers
│   │   └── lib/                 # Utilities and configurations
├── supabase/
│   ├── functions/               # Edge Functions
│   │   ├── generate-totp/       # User TOTP generation
│   │   └── shared-totp/         # Shared TOTP access
│   └── schema.sql               # Database schema
└── SUPABASE_EDGE_FUNCTIONS.md   # Deployment guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Supabase account
- Supabase CLI (for Edge Functions)

### 1. Clone Repository

```bash
git clone <repository-url>
cd fuck-2fa
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql`
3. Deploy Edge Functions (see [deployment guide](SUPABASE_EDGE_FUNCTIONS.md))

### 3. Frontend Setup

```bash
cd frontend/fuck-2fa
npm install --legacy-peer-deps
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features

### **Authentication System**
- **Email Magic Links** - Passwordless login via Supabase Auth
- **Persistent Sessions** - Automatic session restoration
- **Protected Routes** - Authentication-based access control

### **TOTP Management** 
- **Add Secrets** - Support for custom algorithms, digits, and periods
- **Real-time Codes** - Auto-refreshing TOTP codes with countdown
- **Share Links** - Temporary public access (24-hour expiry)
- **Bulk Operations** - Manage multiple TOTP secrets efficiently

### **Modern UI/UX**
- **Dark Theme** - Sophisticated black color scheme
- **Glassmorphism** - Translucent cards with backdrop blur
- **Smooth Animations** - Button glows, hover effects, progress bars
- **Responsive Layout** - Optimized for desktop, tablet, and mobile

## 🔧 API Endpoints

### User TOTP Generation
```
GET /functions/v1/generate-totp?secret_id=xxx
Authorization: Bearer <jwt_token>
```

### Shared TOTP Access
```  
GET /functions/v1/shared-totp?share_token=abc123
```

## 🗄️ Database Schema

### `totp_secrets` Table
- `id` - UUID primary key
- `user_id` - Foreign key to auth.users
- `label` - Display name for the secret
- `issuer` - Optional issuer name
- `secret` - Base32 encoded TOTP secret
- `algorithm` - Hash algorithm (SHA1, SHA256, SHA512)
- `digits` - Code length (6-8)
- `period` - Refresh interval in seconds

### `shared_secrets` Table
- `id` - UUID primary key  
- `secret_id` - Foreign key to totp_secrets
- `share_token` - Public access token
- `expires_at` - Optional expiration timestamp

## 🔒 Security Features

### **Row Level Security (RLS)**
- Users can only access their own secrets
- Shared secrets are publicly accessible with valid tokens
- Service role bypasses RLS for Edge Functions

### **Authentication Flow**
1. User requests magic link via email
2. Supabase sends secure login link
3. JWT token issued upon successful login
4. Edge Functions validate JWT for API access

## 🚀 Deployment

### **Frontend Deployment**
Deploy to Vercel, Netlify, or any Next.js-compatible platform:

```bash
npm run build
```

### **Edge Functions Deployment**
See detailed guide: [SUPABASE_EDGE_FUNCTIONS.md](SUPABASE_EDGE_FUNCTIONS.md)

```bash
supabase functions deploy generate-totp
supabase functions deploy shared-totp
```

## 🧪 Development

### **Local Supabase**
```bash
supabase start
supabase functions serve
```

### **Frontend Development**
```bash
cd frontend/fuck-2fa
npm run dev
```

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)  
- **Authentication**: Supabase Auth
- **TOTP Library**: otplib
- **Typography**: Open Sans font family
- **Icons**: Lucide React
- **Language**: TypeScript

## 🔄 Migration from Cloudflare Workers

We've migrated from Cloudflare Workers to **Supabase Edge Functions** for better integration:

### **Benefits**
- ✅ Unified ecosystem (auth + db + functions)
- ✅ Automatic JWT validation
- ✅ Built-in CORS handling
- ✅ Simplified deployment
- ✅ Better TypeScript support

### **Migration Steps**
1. ✅ Frontend code updated automatically
2. ✅ Edge Functions replace Workers
3. ✅ Remove `NEXT_PUBLIC_WORKER_URL` env var
4. ✅ No breaking changes for end users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**🔐 Fuck 2FA** - Making two-factor authentication management beautiful and effortless. 