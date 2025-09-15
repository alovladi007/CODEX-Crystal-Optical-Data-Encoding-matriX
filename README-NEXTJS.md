# 🔮 CODEX Crystal Archive - Next.js Website

A comprehensive, modern website for CODEX Crystal Archive built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Responsive Design** - Mobile-first approach with beautiful layouts
- **Dark Theme** - Sleek dark theme with crystal-inspired gradients
- **Animations** - Smooth Framer Motion animations throughout
- **Interactive Elements** - Hover effects, transitions, and micro-interactions

### 🚀 **Advanced Components**
- **3D Crystal Visualization** - Interactive Three.js crystal model
- **Typewriter Effect** - Dynamic text animations
- **Particle Background** - Animated particle system
- **File Upload Demo** - Drag & drop file processing
- **Real-time Stats** - Animated counters and progress indicators

### 📱 **Pages & Sections**
- **Hero Section** - Compelling landing with 3D crystal
- **Features** - Comprehensive feature showcase
- **How It Works** - Step-by-step process explanation
- **Technology** - Technical specifications and architecture
- **Pricing** - Multiple pricing tiers with comparisons
- **Testimonials** - Customer reviews and success stories
- **Live Demo** - Interactive file processing demonstration
- **Stats** - Performance metrics and achievements

### 🛠 **Technical Stack**
- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Three.js** - 3D graphics and visualizations
- **React Hook Form** - Form handling
- **Zustand** - State management
- **React Hot Toast** - Notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build production
npm run build
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── demo/              # Demo page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── hero.tsx          # Hero section
│   ├── features.tsx      # Features section
│   ├── technology.tsx    # Technology section
│   ├── pricing.tsx       # Pricing section
│   ├── testimonials.tsx  # Testimonials
│   ├── crystal-3d.tsx    # 3D crystal component
│   └── ...               # Other components
├── lib/                  # Utility functions
├── types/                # TypeScript types
└── public/               # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3b82f6 to #8b5cf6)
- **Crystal**: Cyan to blue (#0ea5e9 to #3b82f6)
- **Dark**: Dark slate (#0f172a to #1e293b)
- **Accent**: Various colors for features

### Typography
- **Font**: Inter (Google Fonts)
- **Mono**: JetBrains Mono
- **Sizes**: Responsive scale from 0.875rem to 4rem

### Components
- **Buttons**: Multiple variants with hover effects
- **Cards**: Glass morphism with borders
- **Badges**: Status indicators
- **Forms**: Styled inputs and controls

## 🔧 Customization

### Adding New Pages
1. Create new file in `app/` directory
2. Export default component
3. Add navigation links in `navbar.tsx`

### Styling
- Use Tailwind CSS classes
- Custom styles in `globals.css`
- Component-specific styles with CSS modules

### Animations
- Framer Motion for page transitions
- CSS animations for micro-interactions
- Intersection Observer for scroll animations

## 📱 Responsive Design

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
```bash
# Build
npm run build

# Deploy build folder to your platform
```

## 🔧 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Excellent
- **Bundle Size**: Optimized with code splitting
- **Images**: Next.js Image optimization

## 🛡️ Security

- **CSP Headers**: Content Security Policy
- **XSS Protection**: Built-in Next.js protection
- **HTTPS**: Enforced in production
- **Dependencies**: Regular security updates

## 📈 Analytics

Ready for integration with:
- Google Analytics
- Mixpanel
- PostHog
- Custom analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: `/docs`
- **Issues**: GitHub Issues
- **Email**: support@codex-crystal-archive.com

---

**Built with ❤️ for data preservation**
