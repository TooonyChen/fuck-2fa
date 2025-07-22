# 🔐 Fuck 2FA - Frontend

A modern React frontend for the TOTP management tool built with Next.js 15, Tailwind CSS, and shadcn/ui.

## 🚀 Quick Start

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

## 🏗 Technology Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **React 19** - Latest React features

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible UI components
- **Lucide React** - Beautiful icon library
- **CSS Variables** - Dynamic theming support

### Authentication & Data
- **Supabase** - Authentication, database, and real-time features
- **Supabase Auth** - Email magic links and OAuth providers

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page with auth routing
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── auth/             # Authentication components
│   │   └── LoginForm.tsx
│   ├── dashboard/        # Dashboard components
│   │   ├── Dashboard.tsx
│   │   └── AddSecretDialog.tsx
│   └── totp/             # TOTP-related components
│       └── TOTPCard.tsx
├── contexts/             # React Context providers
│   └── AuthContext.tsx  # Authentication state management
└── lib/                  # Utility functions and configurations
    ├── supabase.ts      # Supabase client configuration
    └── utils.ts         # General utility functions
```

## 🧩 Key Features

### Authentication System
- **Email Magic Links** - Passwordless authentication via Supabase
- **GitHub OAuth** - Social login integration
- **Protected Routes** - Automatic redirect based on auth state
- **Persistent Sessions** - Automatic session restoration

### TOTP Management
- **Add Secrets** - Form-based TOTP secret addition
- **View Codes** - Real-time TOTP code display with countdown
- **Delete Secrets** - Remove unwanted TOTP entries
- **Share Links** - Generate temporary public access links
- **Auto-refresh** - Automatic code regeneration every 30 seconds

### User Interface
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - Automatic theme detection
- **Modern Components** - Clean, accessible UI with shadcn/ui
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Development with specific options
npm run dev -- --port 3001    # Run on different port
npm run dev -- --turbo        # Use Turbopack (default)
```

## 🔨 Development Guide

### Adding New Components

1. **UI Components**: Add to `src/components/ui/` following shadcn/ui patterns
2. **Feature Components**: Add to appropriate feature directories
3. **Use TypeScript**: All components should be strongly typed
4. **Follow Conventions**: Use consistent naming and file structure

### State Management

- **Authentication**: Managed via `AuthContext`
- **Local State**: Use React's `useState` and `useEffect`
- **Server State**: Direct Supabase queries with error handling

### Styling Guidelines

- **Tailwind First**: Use Tailwind utility classes
- **Component Variants**: Use `class-variance-authority` for component variants
- **Custom Styles**: Add to `globals.css` if needed
- **Responsive Design**: Mobile-first approach

### API Integration

```typescript
// Example: Fetching TOTP secrets
const { data, error } = await supabase
  .from('totp_secrets')
  .select('*')
  .order('created_at', { ascending: false })
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify** - Static export or server-side rendering
- **Railway** - Full-stack deployment
- **Heroku** - Container or buildpack deployment

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_WORKER_URL=your-cloudflare-worker-url
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Dependency Conflicts
```bash
# If you encounter peer dependency issues
npm install --legacy-peer-deps
```

#### 2. Supabase Connection Issues
- Verify your environment variables are correct
- Check Supabase project status
- Ensure Row Level Security (RLS) policies are properly configured

#### 3. Authentication Problems
- Check Supabase Auth settings
- Verify redirect URLs in Supabase dashboard
- Ensure OAuth providers are properly configured

#### 4. Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 5. TypeScript Errors
- Ensure all dependencies are properly typed
- Check `tsconfig.json` configuration
- Verify import paths are correct

### Debug Mode

Enable debug mode by setting environment variables:

```env
NEXT_PUBLIC_DEBUG=true
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can register with email
- [ ] User can login with magic link
- [ ] User can login with GitHub OAuth
- [ ] User can add TOTP secrets
- [ ] TOTP codes display and refresh correctly
- [ ] User can delete TOTP secrets
- [ ] Share links work correctly
- [ ] User can logout
- [ ] App works on mobile devices

### Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### UI Library Resources
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

### Backend Integration
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](../../LICENSE) file for details.
