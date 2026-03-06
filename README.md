# PingMyDb - Frontend

The client-side application for PingMyDb, a specialized database monitoring utility built to prevent cold starts and track infrastructure health.

## 🚀 Key Features
- **Interactive Dashboard**: Real-time monitoring of database health and latency.
- **Visual Analytics**: Beautifully rendered uptime statistics and latency graphs.
- **Dynamic Pricing**: Integration with Razorpay for Tiered/Student plans.
- **Interactive Demos**: Step-by-step walkthroughs for new users.
- **Theme Support**: Premium dark/light modes with glassmorphism aesthetics.

## 🛠 Tech Stack
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS for specific components.
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide-React](https://lucide.dev/)
- **State Management**: Zustand / React Context
- **Notifications**: [Sonner](https://sonner.stevenly.me/)

## 🏁 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` or `.env.local` file:
```env
VITE_API_URL=http://localhost:5001
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### 3. Development
```bash
npm run dev
```

## 🏗 Build
To generate a production build:
```bash
npm run build
```
