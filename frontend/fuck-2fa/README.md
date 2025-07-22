# 🔐 Fuck 2FA - Frontend

A modern React frontend for the TOTP management tool built with Next.js 15, Tailwind CSS, and shadcn/ui.

## 🚀 Quick Start

### Recommended Ways to Deploy the Frontend

## Deploy on Cloudflare Pages

Cloudflare Pages provides excellent performance with global edge distribution and seamless integration with Cloudflare Workers.

```bash
# 1. Build the project
npm run build

# 2. Install Wrangler CLI (if not already installed)
npm install -g wrangler

# 3. Login to Cloudflare
wrangler login

# 4. Create a new Cloudflare Pages project
wrangler pages create fuck-2fa-frontend

# 5. Deploy to Cloudflare Pages
wrangler pages deploy out --project-name fuck-2fa-frontend
```

### Environment Variables for Cloudflare Pages

Set these in your Cloudflare Pages dashboard under Settings → Environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Automatic Deployments

1. Connect your GitHub repository to Cloudflare Pages
2. Set build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `frontend/fuck-2fa`
   - **Node.js version**: `20.x`

## Deploy on Vercel 

Vercel offers the best Next.js deployment experience with zero-configuration and automatic optimizations.

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from your project directory
vercel

# 4. For production deployment
vercel --prod
```

### Vercel Deployment Steps

1. **Connect GitHub Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `frontend/fuck-2fa`

2. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty (auto-detected)
   - **Install Command**: `npm install --legacy-peer-deps`

3. **Environment Variables**:
   Set these in your Vercel project dashboard:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Custom Domain** (Optional):
   - Go to project settings
   - Add your custom domain
   - Configure DNS records as instructed

### Automatic Deployments

- **Production**: Deploys automatically on pushes to `main` branch
- **Preview**: Creates preview deployments for pull requests
- **Rollback**: Easy rollback to previous deployments

## Deploy Locally

### Prerequisites

- Node.js 20+ 
- npm or yarn
- A Supabase project (for authentication and data storage)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Create environment variables file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Cloudflare Worker URL (optional, for TOTP generation)
NEXT_PUBLIC_WORKER_URL=https://your-worker.your-subdomain.workers.dev
```

### Getting Supabase Credentials

1. Visit [supabase.com](https://supabase.com) and create a new project
2. Go to Settings → API
3. Copy your `Project URL` and `anon/public key`
4. Execute the SQL schema from `/supabase/schema.sql` in your Supabase SQL Editor