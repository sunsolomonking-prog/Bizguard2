# BizGuard - Intelligent Business Management Platform

🚀 **The Complete Business OS for African SMEs**

BizGuard is a comprehensive business management platform designed to serve traders, retailers, pharmacies, restaurants, schools, churches, and SMEs across Africa. Built with modern technologies and AI-powered insights.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Development Roadmap](#development-roadmap)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [VS Code Setup](#vs-code-setup)
- [Deployment](#deployment)

## ✨ Features

### Phase 1: Core Business Management (Current)
- ✅ **Dashboard** - Real-time business metrics and insights
- ✅ **Sales Management** - Track and manage all sales transactions
- ✅ **Inventory Management** - Product catalog, stock levels, and alerts
- ✅ **Debtors Management** - Customer accounts and payment tracking
- ✅ **AI Assistant** - Intelligent business companion for insights and actions

### Phase 2: Risk & Intelligence (Coming Soon)
- 🔄 **Risk Score** - Business health monitoring and risk assessment
- 🔄 **Action Cards** - Prioritized task management
- 🔄 **Smart Alerts** - AI-powered notifications
- 🔄 **Customer Intelligence** - Deep customer analytics

### Phase 3: Predictive Analytics (Future)
- 📅 **Demand Prediction** - AI-powered sales forecasting
- 📅 **Smart Restock** - Automated inventory recommendations
- 📅 **Daily AI Briefing** - Morning business summary
- 📅 **Weekly Reports** - Automated performance reports

### Phase 4: Growth & Expansion (Future)
- 🔮 **Business Opportunity Finder** - Growth recommendations
- 🔮 **Multi-Business Mode** - Manage multiple businesses
- 🔮 **WhatsApp Integration** - Customer communication
- 🔮 **Industry Templates** - Pre-configured setups

### Phase 5: Enterprise (Future)
- 🎯 **Full Business OS** - Complete business management
- 🎯 **Investor Dashboard** - Stakeholder reporting
- 🎯 **Franchise Dashboard** - Multi-location management
- 🎯 **Enterprise Version** - Advanced features and API

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📅 Development Roadmap

```
Phase 1 (Current) ────────────────────────── ✓ Complete
├── Sales Management
├── Inventory Management
├── Debtors Management
├── Dashboard
└── AI Assistant

Phase 2 (Next) ───────────────────────────── 🔄 In Progress
├── Risk Score System
├── Action Cards
├── Smart Alerts
└── Customer Intelligence

Phase 3 ──────────────────────────────────── 📅 Planned
├── Demand Prediction
├── Smart Restock
├── Daily AI Briefing
└── Weekly Reports

Phase 4 ──────────────────────────────────── 🔮 Future
├── Business Opportunity Finder
├── Multi-Business Mode
├── WhatsApp Integration
└── Industry Templates

Phase 5 ──────────────────────────────────── 🎯 Vision
├── Full Business OS
├── Investor Dashboard
├── Franchise Dashboard
└── Enterprise Version
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
bizguard/
├── .vscode/                    # VS Code configuration
│   ├── settings.json           # Editor settings
│   └── extensions.json         # Recommended extensions
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   └── layout/             # Layout components
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── Layout.tsx
│   ├── lib/                    # Library configurations
│   │   ├── supabase.ts         # Supabase client
│   │   └── database.types.ts   # Database types
│   ├── pages/                  # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Sales.tsx
│   │   ├── Inventory.tsx
│   │   ├── Debtors.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── RiskScore.tsx
│   │   ├── Alerts.tsx
│   │   ├── Reports.tsx
│   │   ├── Predictions.tsx
│   │   ├── Opportunities.tsx
│   │   └── Settings.tsx
│   ├── store/                  # State management
│   │   └── index.ts            # Zustand store
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   ├── cn.ts               # Class name utility
│   │   └── helpers.ts          # Helper functions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   └── vite-env.d.ts           # Vite type declarations
├── .env                        # Environment variables
├── .env.example                # Environment template
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
└── README.md                   # This file
```

## 🔐 Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME=BizGuard
VITE_APP_VERSION=1.0.0

# AI Configuration (for future phases)
VITE_AI_API_KEY=your_ai_api_key
VITE_AI_ENDPOINT=your_ai_endpoint

# WhatsApp Integration (Phase 4)
VITE_WHATSAPP_API_KEY=your_whatsapp_api_key

# Feature Flags
VITE_ENABLE_PHASE_1=true
VITE_ENABLE_PHASE_2=false
VITE_ENABLE_PHASE_3=false
VITE_ENABLE_PHASE_4=false
VITE_ENABLE_PHASE_5=false
```

## 💻 VS Code Setup

### Recommended Extensions

Install these extensions for the best development experience:

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **ES7+ React/Redux/React-Native snippets** - React snippets
- **Path Intellisense** - Path autocomplete
- **Auto Rename Tag** - Auto-rename HTML tags
- **Code Spell Checker** - Spell checking
- **Vite** - Vite integration
- **Supabase** - Supabase integration

### Settings

The project includes `.vscode/settings.json` with optimized settings for:
- Auto-formatting on save
- Tailwind CSS support
- TypeScript configuration
- File exclusions

## 🌍 Target Markets

BizGuard is designed for:

- 🏪 **Retailers** - Shops, stores, boutiques
- 💊 **Pharmacies** - Drug stores, medical supplies
- 🍽️ **Restaurants** - Food service, cafes
- 🏫 **Schools** - Educational institutions
- ⛪ **Churches** - Religious organizations
- 📦 **Wholesalers** - Distribution businesses
- 🔧 **Service Providers** - Various service businesses

## 📊 Key Metrics

- **5 Development Phases**
- **20+ Core Features**
- **Multi-Currency Support** (NGN, USD, EUR, GBP, KES, GHS, ZAR)
- **AI-Powered Insights**
- **Real-time Analytics**
- **Mobile-Responsive Design**

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and inquiries:
- Email: support@bizguard.africa
- Documentation: https://docs.bizguard.africa

---

**Built with ❤️ for African Businesses**

*Empowering SMEs with intelligent business management tools.*
