# Japan Youth Summit

A modern, scalable Next.js application built with international standards.

## 🚀 Features

- ⚡ **Next.js 14** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🌍 **Internationalization** (i18n) support
- 📦 **Clean Architecture** with organized folder structure
- 🛠️ **ESLint & Prettier** for code quality
- 🎯 **Best Practices** for enterprise applications

## 📁 Project Structure

```
.
├── app/                          # Next.js App Router (pages & layouts)
│   ├── api/                      # API routes
│   │   └── health/               # Health check endpoint
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── metadata.ts              # Default metadata configuration
│   ├── loading.tsx              # Loading UI
│   ├── error.tsx                # Error boundary
│   └── not-found.tsx            # 404 page
├── components/                   # React components
│   ├── pages/                   # Page-specific components
│   │   └── home/                # Home page components
│   └── ui/                      # Reusable UI components
│       ├── button/              # Button component
│       └── card/                # Card component
├── lib/                         # Utility functions & helpers
│   ├── utils.ts                 # Common utilities (cn, formatDate, etc.)
│   ├── constants.ts             # App constants
│   ├── validation.ts            # Validation functions
│   └── i18n.ts                  # Internationalization helpers
├── hooks/                       # Custom React hooks
│   └── use-media-query.ts       # Media query hook
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Global types
├── constants/                   # Application constants
│   ├── routes.ts                # Route constants
│   └── api.ts                   # API endpoint constants
├── config/                      # Configuration files
│   └── site.ts                  # Site configuration
├── locales/                     # Internationalization files
│   ├── en/                      # English translations
│   └── id/                      # Indonesian translations
├── public/                      # Static assets (images, fonts, etc.)
├── styles/                      # Additional global styles
├── middleware.ts                # Next.js middleware
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🌍 Internationalization

The project includes internationalization support with English and Indonesian locales. The structure is ready for full i18n implementation:

- Translation files are stored in `locales/[locale]/` directory
- Use `lib/i18n.ts` helpers for loading translations
- For production apps, consider using `next-intl` or similar library
- Middleware is set up and ready for locale routing

To add more languages:

1. Create translation files in `locales/[new-locale]/` directory
2. Update `types/index.ts` to include new locale
3. Extend middleware for locale detection/routing

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
```

## 📚 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Code Quality**: ESLint, Prettier
- **Package Manager**: npm

## 🎯 Best Practices

- ✅ TypeScript strict mode enabled
- ✅ Component-based architecture
- ✅ Path aliases for clean imports
- ✅ Separation of concerns
- ✅ Reusable utilities and hooks
- ✅ International standards compliance

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. Please follow the established code standards and practices.
# YBBWEBSITE
