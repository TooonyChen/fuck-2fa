# 🔐 Fuck 2FA - Modern TOTP Management Tool

A sleek, modern TOTP (Time-based One-Time Password) management application with a beautiful dark theme, built with Next.js and Supabase.

Demo: https://fuck-2fa.pages.dev/

Demo is hosted on Cloudflare Pages and my free-plan Supabase, all the credentials and secrets are encrypted. If you don't wanna self-host just feel free to use it! But I am not responsible if there is any leakage or loss :/

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
- **HTTPS Only** - All communications encrypted
- **CORS Protection** - Proper cross-origin configuration

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Supabase account** - [Sign up at supabase.com](https://supabase.com)
- **Supabase CLI** - [Install guide](https://supabase.com/docs/guides/cli)

### 1. Clone Repository

```bash
git clone https://github.com/your-username/fuck-2fa.git
cd fuck-2fa
```

### 2. Setup Supabase Project

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key
3. Wait for project initialization (2-3 minutes)

#### Setup Database Schema
```bash
# Copy the schema.sql content and run in Supabase SQL Editor
# Or run via CLI (requires local Supabase setup)
supabase db reset
```

#### Deploy Edge Functions
```bash
# Install and configure Supabase CLI
npm install -g supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy Edge Functions
supabase functions deploy generate-totp
supabase functions deploy shared-totp
```

See detailed deployment guide: [SUPABASE_EDGE_FUNCTIONS.md](SUPABASE_EDGE_FUNCTIONS.md)

### 3. Frontend Setup

See [Frontend README](frontend/fuck-2fa/README.md)

### 4. Environment Configuration

#### Frontend Environment Variables (`.env.local`)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Analytics and Monitoring
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

#### Supabase Configuration
- Enable Row Level Security (RLS) on all tables
- Configure email templates for magic links
- Set up custom domains (optional)
- Configure CORS settings for your domain

## 🎯 Key Features

### **Authentication System**
- **Email Magic Links** - Passwordless login via Supabase Auth
- **Persistent Sessions** - Automatic session restoration
- **Protected Routes** - Authentication-based access control
- **Secure Logout** - Clean session termination

### **TOTP Management** 
- **Add Secrets** - Support for custom algorithms, digits, and periods
- **Real-time Codes** - Auto-refreshing TOTP codes with countdown
- **Share Links** - Temporary public access (24-hour expiry)
- **Bulk Operations** - Manage multiple TOTP secrets efficiently
- **Search & Filter** - Quickly find specific TOTP entries

### **Modern UI/UX**
- **Dark Theme** - Sophisticated black color scheme
- **Glassmorphism** - Translucent cards with backdrop blur
- **Smooth Animations** - Button glows, hover effects, progress bars
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Accessibility** - WCAG 2.1 compliant interface

## 🔧 API Endpoints

### User TOTP Generation
```
GET /functions/v1/generate-totp?secret_id=xxx
Authorization: Bearer <jwt_token>

Response:
{
  "code": "123456",
  "label": "Gmail Account",
  "expires_in": 25
}
```

### Shared TOTP Access
```  
GET /functions/v1/shared-totp?share_token=abc123

Response:
{
  "code": "654321",
  "label": "Shared Service",
  "expires_in": 18,
  "issuer": "Example Corp"
}
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
- `created_at` - Timestamp
- `updated_at` - Timestamp

### `shared_secrets` Table
- `id` - UUID primary key  
- `secret_id` - Foreign key to totp_secrets
- `share_token` - Public access token
- `expires_at` - Optional expiration timestamp
- `created_at` - Timestamp

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
├── docs/                        # Additional documentation
│   ├── DEVELOPMENT.md           # Development and testing guide
│   ├── SECURITY.md              # Security implementation details
│   ├── TROUBLESHOOTING.md       # Common issues and solutions
│   └── PERFORMANCE.md           # Performance optimization guide
├── SUPABASE_EDGE_FUNCTIONS.md   # Deployment guide
└── README.md                    # This file
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Quick Start**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

See [LICENSE](LICENSE) file for details.

---

**🔐 Fuck 2FA** - Making two-factor authentication management beautiful and effortless.

*Built with ❤️ using Next.js and Supabase* 
