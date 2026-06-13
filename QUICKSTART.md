# BizGuard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials (or use demo mode without them).

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open Browser
Navigate to: **http://localhost:5173**

### Step 5: Login
```
Email: owner@bizguard.africa
Password: password
```

---

## 📁 Project Overview

### Current Status: Phase 1 Complete ✅

**Working Features:**
- ✅ Dashboard with real-time metrics
- ✅ Sales management (POS)
- ✅ Inventory tracking
- ✅ Customer/Debtor management
- ✅ AI Assistant with intelligent responses

**Demo Data:**
The app comes with pre-loaded demo data so you can explore all features immediately.

---

## 🎯 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Business overview and metrics |
| Sales | `/sales` | Manage sales transactions |
| Inventory | `/inventory` | Product and stock management |
| Debtors | `/debtors` | Customer accounts and invoices |
| AI Assistant | `/ai-assistant` | Chat with business AI |
| Settings | `/settings` | Configure your business |

---

## 💻 VS Code Setup

### Install Recommended Extensions
When you open the project in VS Code, you'll see a popup recommending extensions. Click "Install All" for:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React Snippets
- And more...

### Keyboard Shortcuts
- `Ctrl+Shift+P` → Command Palette
- `Ctrl+` ` → Toggle Terminal
- `Ctrl+B` → Toggle Sidebar
- `Alt+Shift+F` → Format Document

---

## 🔧 Common Tasks

### Add a New Page
1. Create file in `src/pages/YourPage.tsx`
2. Export component
3. Add to `src/pages/index.ts`
4. Add route in `src/App.tsx`
5. Add to sidebar in `src/components/layout/Sidebar.tsx`

### Add a New Component
1. Create file in `src/components/your-component/`
2. Export component
3. Import where needed

### Update State
Use Zustand store in `src/store/index.ts`:
```typescript
const { someState, setSomeState } = useAppStore();
```

### Add API Call
1. Create service in `src/services/`
2. Use Supabase client from `src/lib/supabase.ts`
3. Handle loading and errors

---

## 🎨 Styling

### Tailwind CSS
This project uses Tailwind CSS v4. All styling is utility-first.

```tsx
<div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
  {/* Your content */}
</div>
```

### Custom Components
Use the `cn` utility for conditional classes:
```tsx
import { cn } from '../utils/cn';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />
```

---

## 📊 State Management

### Zustand Store
Access global state anywhere:
```typescript
import { useAppStore } from '../store';

const { 
  user, 
  currentBusiness, 
  dashboardMetrics,
  alerts 
} = useAppStore();
```

### Update State
```typescript
const { setUser, setDashboardMetrics } = useAppStore();
setUser(newUser);
```

---

## 🗄️ Database

### Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run `supabase/schema.sql` in SQL Editor
4. Copy URL and Anon Key to `.env`

### Local Development
The app works with demo data without a database connection.

---

## 🐛 Debugging

### Check Console
Open browser DevTools (F12) and check Console tab.

### React DevTools
Install React DevTools extension for component inspection.

### Network Tab
Check API calls in Network tab of DevTools.

---

## 📱 Testing

### Mobile Testing
Use browser DevTools device toolbar (Ctrl+Shift+M) to test responsive design.

### Browser Testing
Test in:
- Chrome (primary)
- Firefox
- Safari
- Edge

---

## 🚀 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

---

## 📖 Learn More

### Documentation
- [README.md](./README.md) - Full project documentation
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Complete development roadmap
- [supabase/schema.sql](./supabase/schema.sql) - Database schema

### Code Structure
See [README.md - Project Structure](./README.md#-project-structure)

---

## 🆘 Need Help?

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill
```

**TypeScript errors:**
```bash
# Check types
npx tsc --noEmit
```

**Dependencies issues:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Get Support
- Check existing issues on GitHub
- Read documentation
- Contact: support@bizguard.africa

---

## ✅ Next Steps

1. **Explore the app** - Click through all features
2. **Check the code** - Understand the structure
3. **Make a change** - Try modifying something small
4. **Read the roadmap** - See what's coming next
5. **Start building** - Pick a feature from Phase 2!

---

**Happy Coding! 🎉**

Welcome to the BizGuard development team!
