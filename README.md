# Vrrittih.com - Frontend Application

## Overview
Next.js frontend for the Vrrittih.com job portal platform with CV posting and job packages.

## Technology Stack
- **Framework**: Next.js 15.3.1 (React 19)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI
- **TypeScript**: Full type safety

## Features
- CV posting packages (₹99/₹999)
- Job packages (₹499/₹999/₹2,999/₹4,999)
- Auto-renew subscriptions
- Payment integration with Razorpay
- Resume builder with templates
- Job search and application system
- Company profiles and management
- Admin dashboard

## Development
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Project Structure
```
src/
├── app/           # Next.js app router
├── components/    # Reusable components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
└── store/         # Zustand stores
```

## Integration
This frontend connects to the microservices backend:
- Auth Service (port 3001)
- User Service (port 3002) 
- Job Service (port 3003)
- Resume Service (port 3004)
- Payment Service (port 3005)
- And other services via API Gateway (port 7080)