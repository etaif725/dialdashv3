# DialWise Frontend

## Overview
DialWise Frontend is a modern React application built with TypeScript, Tailwind CSS, and Vite. It provides a responsive and intuitive user interface for the DialWise CRM platform.

## Features

- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- 🔒 **Authentication**: JWT-based auth with protected routes
- 📱 **Responsive Design**: Mobile-first approach
- 🌙 **Dark Mode**: Built-in dark mode support
- 🎯 **Type Safety**: Full TypeScript support
- ⚡ **Fast Development**: Powered by Vite
- 📊 **Data Visualization**: Interactive charts and graphs
- 🔄 **State Management**: Zustand for simple and effective state
- 🚀 **API Integration**: Axios with React Query
- 🧪 **Testing Ready**: Jest and React Testing Library

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── ui/        # UI components
│   │   ├── layout/    # Layout components
│   │   └── shared/    # Shared components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilities and helpers
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript types
│   ├── App.tsx        # Root component
│   └── main.tsx       # Entry point
├── public/            # Static assets
└── index.html         # HTML template
```

## Development Tools

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Zustand** for state management
- **React Query** for data fetching
- **React Router** for routing
- **Zod** for validation

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

## Contributing

1. Create a feature branch
2. Write clean, documented code
3. Follow the style guide
4. Write tests for new features
5. Create a Pull Request

## License

Private - All rights reserved 