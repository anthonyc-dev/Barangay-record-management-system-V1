# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Barangay Record Management System** - a web application for managing Philippine barangay (village) records, residents, documents, and community services. Built as a React TypeScript frontend with Vite, it currently contains a fully functional UI prototype with mock data, ready for backend integration.

## Development Commands

### Essential Commands

```bash
# Start development server (port 5173 by default)
pnpm run dev

# Build for production (TypeScript compilation + Vite build)
pnpm run build

# Lint all files
pnpm run lint

# Preview production build locally
pnpm run preview
```

### TypeScript

- Use `tsc -b` to check TypeScript errors without building
- Full TypeScript strict mode is enabled
- All components must be properly typed

## Architecture Overview

### Tech Stack

- **Framework**: React 19.1.1 + TypeScript 5.8.3
- **Build Tool**: Vite 7.1.3
- **Styling**: Tailwind CSS 4.1.12 with Shadcn/ui (New York style)
- **Forms**: React Hook Form 7.62.0 + Zod 4.1.3 validation
- **Routing**: React Router DOM 7.8.2
- **UI Components**: Radix UI primitives for accessibility
- **Charts**: Recharts 3.1.2
- **Maps**: React Leaflet 5.0.0 + Leaflet 1.9.4
- **Icons**: Lucide React + React Icons
- **Notifications**: Sonner 2.0.7
- **Theme**: Next Themes 0.4.6 (dark mode support)

### Project Structure

```
src/
├── components/
│   ├── adminComponents/     # Admin-specific UI (forms, sidebar, navbar)
│   ├── userComponents/      # User-facing components (header, footer)
│   ├── analytics/           # Dashboard analytics components
│   └── ui/                  # Shadcn/ui base components (button, card, input, etc.)
├── pages/
│   ├── adminPage/           # Admin dashboard pages + auth
│   ├── userSide/            # Resident/user pages + auth
│   └── general/             # General authentication
├── layouts/
│   ├── adminLayout.tsx      # Admin sidebar layout with responsive mobile support
│   └── ResidentLayout.tsx   # Resident layout with navigation
├── routers/
│   └── index.tsx            # Centralized route configuration
├── lib/
│   └── utils.ts             # Tailwind class merging utilities
└── hooks/
    └── use-toast.ts         # Toast notification hook
```

### Dual Layout System

- **Admin Layout**: Full sidebar navigation with responsive mobile overlay, header with status indicators
- **Resident Layout**: User-friendly navigation with header/footer structure
- Layouts wrap their respective route groups and handle sidebar state management

### Route Organization

Routes are defined centrally in `routers/index.tsx`:

- `/admin/*` - Admin dashboard routes (residents, documents, analytics, settings)
- `/resident/*` - Resident portal routes (home, documents, complaints, announcements)
- `/general/auth/*` - General authentication flows
- Each route group uses its corresponding layout

## Key Features

### Admin Dashboard

- **Resident Management**: Comprehensive CRUD for resident records with family info
- **Document Issuance**: Track barangay clearances, certificates of residency, indigency certificates
- **Analytics Dashboard**: 6 analytics modules (population, documents, health, financial, incidents, geographical with maps)
- **Announcements**: Community announcements management
- **Folder Storage**: Document storage system
- **Settings**: System configuration

### Resident Portal

- **Document Requests**: Online document request submission
- **Complaint System**: File complaints/incidents with categorization and urgency levels
- **Announcements**: View community events and announcements
- **Profile Management**: Personal settings and information

## Important Implementation Details

### Current Data Layer

**Critical**: This is a UI prototype with **no persistent backend**. All data is:

- Mocked with `useState` hooks in components
- Hardcoded arrays of objects simulating database records
- Lost on page refresh
- Uses setTimeout to simulate API delays (1000-1200ms)

Examples:

- Resident records array in `Resident.admin.tsx`
- Document requests in `Documents.tsx`
- Analytics data hardcoded in analytics components

### Authentication Status

- **Admin Login**: Hardcoded credentials (username/password validation only)
- **User Login**: Email-based with Zod validation, hardcoded test account (admin@gmail.com/admin123)
- **No Session Management**: No JWT, cookies, or persistent auth state
- **Clerk Integration**: @clerk/clerk-react is installed but not configured
- **TODO Comments**: Found in Login.tsx - "Replace with actual authentication logic"

### Form Patterns

All forms follow this pattern:

1. Define Zod schema for validation
2. Use `useForm` with `zodResolver`
3. Build form with Shadcn/ui form components
4. Handle submission with mock setTimeout
5. Show success/error toast notifications

Example reference: `AddResidentForm` in `src/components/adminComponents/form/`

### Shadcn/ui Component System

- Components are in `src/components/ui/`
- Built on Radix UI primitives for accessibility
- Styled with Tailwind CSS using CSS variable theming
- Support dark mode via next-themes
- Use Class Variance Authority for component variants

To add new Shadcn components:

```bash
npx shadcn@latest add <component-name>
```

### Styling Conventions

- **Tailwind CSS** for all styling - no inline styles or CSS modules
- Use `cn()` utility from `lib/utils.ts` for conditional classes
- Responsive design: mobile-first approach with `lg:` breakpoints for desktop
- Color theming via CSS variables in HSL format
- Dark mode supported via `next-themes` ThemeProvider

## Backend Integration Readiness

When connecting to a backend API:

1. **Replace Mock Data**: Remove `useState` arrays, replace with API calls using fetch/axios
2. **Add State Management**: Consider Redux Toolkit or Zustand for global state
3. **Implement Authentication**:
   - Configure Clerk or implement JWT-based auth
   - Add protected route wrappers
   - Implement role-based access control (admin vs resident)
4. **API Endpoints**: Create services layer in `src/services/` for API calls
5. **Error Handling**: Add proper error boundaries and API error handling
6. **Loading States**: Use React Query or SWR for data fetching with loading/error states

## Code Quality Notes

### TypeScript Usage

- All components must be properly typed
- No `any` types - use proper interfaces or type aliases
- Form types should be inferred from Zod schemas using `z.infer<typeof schema>`
- Props interfaces should be explicit

### Form Validation

- Always use Zod schemas for validation
- Client-side validation only currently - backend validation needed
- Use React Hook Form's `handleSubmit` wrapper for proper error handling
- Display field errors using form component's error states

### Component Patterns

- Functional components only (no class components)
- Use hooks for state management and side effects
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Analytics components follow StatsCard + ChartCard pattern

## Known Limitations

1. **No Backend**: All data is mocked, no persistence
2. **No Authentication**: Login screens are UI-only with hardcoded credentials
3. **No Testing**: No unit tests or integration tests configured
4. **No Error Boundaries**: Limited error handling infrastructure
5. **No API Integration**: No services layer or HTTP client configured
6. **Limited Accessibility**: While using Radix UI, no comprehensive a11y audit done
7. **No Internationalization**: All text is hardcoded in English

## Development Workflow

### Adding New Admin Pages

1. Create page component in `src/pages/adminPage/`
2. Add route in `routers/index.tsx` under admin routes
3. Add navigation link to `adminComponents/SidebarMenu.tsx`
4. Ensure page uses `adminLayout` wrapper

### Adding New Resident Pages

1. Create page component in `src/pages/userSide/pages/`
2. Add route in `routers/index.tsx` under resident routes
3. Add navigation link to `userComponents/Header.tsx`
4. Ensure page uses `ResidentLayout` wrapper

### Creating Forms

1. Define Zod schema for validation
2. Create form component using `react-hook-form` + `zodResolver`
3. Use Shadcn/ui form components (Form, FormField, FormItem, FormLabel, FormControl, FormMessage)
4. Add submit handler with mock setTimeout (replace with API call later)
5. Show toast notification on success/error using `useToast` hook

### Adding Analytics Components

1. Create component in `src/components/analytics/`
2. Use `StatsCard` for KPI displays
3. Use `ChartCard` wrapper for visualizations
4. Use Recharts components (BarChart, LineChart, PieChart, etc.)
5. Follow existing analytics component patterns for consistency

## Dependencies Management

### Critical Dependencies

- Keep React and React DOM versions in sync
- Tailwind CSS version must match @tailwindcss/vite plugin version
- All Radix UI components should use compatible versions
- TypeScript version ~5.8.3 (tilde range for patch updates)

### Future Considerations

- Add React Query for server state management when backend is ready
- Consider Axios or similar HTTP client for API calls
- Add testing libraries (Vitest, React Testing Library)
- Consider adding Storybook for component documentation
