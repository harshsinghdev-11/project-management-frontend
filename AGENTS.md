<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Camp — Architecture & Developer Documentation

## 1. Project Overview & Ethos
**Project Camp** is a modern, production-grade project management application designed around a **Tactile Stationery & Papercraft Metaphor**.

### The Core Premise:
Modern digital tools suffer from "software fatigue": dark gradients with neon glowing purple blobs, 40-deep nested menus, confusing enterprise jargon, and overwhelming dashboards.
Project Camp provides the cognitive warmth, visual clarity, and focus of physical stationery—notebooks, index cards, double-ruled accounting ledgers, brass paperclips, pushpins, washi tape, and wax seals—backed by modern cloud performance, instant reactivity, and strict type safety.

---

## 2. Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS + Physical Papercraft Utility Tokens (`globals.css`)
- **Typography**: Google Fonts loaded via `next/font`:
  - **Fraunces** (`--font-fraunces`): High-contrast humanist editorial serif for headings, branding, and status marks.
  - **Geist** (`--font-geist-sans`): Clean, geometric sans-serif for body copy and metadata.
  - **Geist Mono** (`--font-geist-mono`): Monospace font for dates, identifiers, and progress capsules.
- **Iconography**: [Lucide React](https://lucide.dev/) + Custom SVG Stationery components (`components/stationery/`).
- **State Management**:
  - `AuthContext` (`context/auth-context.tsx`): React Context managing JWT token storage in `localStorage`, user session state, and reactive auth status.
  - Local component state for interactive boards, modals, and filters.
- **HTTP Client**: Singleton Axios client (`lib/api-client.ts`) with automatic bearer token injection and error normalization via `ApiError`.
- **API Proxy**: Configured in `next.config.ts` to route `/api/v1/:path*` to `http://localhost:3000/api/v1/:path*` to eliminate CORS issues in local development.

---

## 3. Strict Terminology Rule

> [!IMPORTANT]
> **Always use simple, intuitive terminology.**
> Overly complex or archaic metaphors create confusion. Never reintroduce terms like "dossier", "docket", "slip", "memorandum", or "writer".
> 
> - Use **Project** (NOT "Dossier" or "Docket")
> - Use **Project Settings** (NOT "Dossier Metadata")
> - Use **Task** (NOT "Slip" or "Task Slip")
> - Use **To Do / In Progress / Done** (NOT "Drafting Slip", "Active Docket", "Archive Docket")
> - Use **Team Members** (NOT "Personnel Roster" or "Enrolled Scribes")
> - Use **Assignee** (NOT "Writer" or "Collaborator Slip")
> - Use **Description** (NOT "Scope Memorandum")

---

## 4. Key Modules & Directory Structure

```
project-manager-frontend/
├── app/
│   ├── (workspace)/                 # Authenticated workspace layout & pages
│   │   ├── layout.tsx               # Workspace wrapper with sidebar & auth guard
│   │   └── projects/
│   │       ├── page.tsx             # Projects dashboard (grid & table views, metrics)
│   │       └── [projectId]/
│   │           └── page.tsx         # Project details (Roadmap, Kanban, List, Members, Settings)
│   ├── forgot-password/page.tsx     # Password recovery request page
│   ├── login/page.tsx               # Sign in page with sample credential filler
│   ├── register/page.tsx            # Account registration page
│   ├── reset-password/[token]/      # Password reset confirmation page
│   ├── layout.tsx                   # Root layout (Fonts, AuthProvider, ToastProvider, SEO metadata)
│   ├── page.tsx                     # Public landing page with Interactive Live Desk & Bento Grid
│   ├── manifest.ts                  # Web app manifest for PWA & mobile discovery
│   ├── robots.ts                    # Dynamic robots.txt (allows public pages, shields workspace)
│   ├── sitemap.ts                   # Dynamic sitemap.xml
│   └── globals.css                  # Papercraft tokens (ledger-ruled, drafting-grid, paper-shadow)
│
├── components/
│   ├── auth/                        # ChangePasswordModal & auth helpers
│   ├── landing/                     # Public landing page components
│   │   ├── navbar.tsx               # Sticky nav with wax seal & dynamic auth buttons
│   │   ├── hero.tsx                 # Single H1 hero section with paperclip trust badge
│   │   ├── interactive-desk.tsx     # Interactive preview of real sprint roadmap & Kanban board
│   │   ├── feature-bento.tsx        # 4 tactile craft cardstock cards
│   │   ├── comparison-section.tsx   # Contrast table: Generic SaaS vs. Project Camp
│   │   ├── workflow-section.tsx     # 3-step pinned onboarding cards
│   │   ├── cta-section.tsx          # Bottom call to action with wax seal
│   │   └── footer.tsx               # Semantic footer with sitemap links
│   ├── layout/
│   │   ├── header.tsx               # Workspace top navigation bar with breadcrumbs & user badge
│   │   └── sidebar.tsx              # Deckle-torn sidebar with wax seal and project quick-links
│   ├── members/
│   │   ├── invite-member-modal.tsx  # Add team member modal by email with role selector
│   │   └── project-members-tab.tsx  # Member roster table with role editor and removal actions
│   ├── projects/
│   │   ├── create-project-modal.tsx # Create project modal with validation
│   │   ├── project-card.tsx         # Manila folder project card with paperclip accent
│   │   └── project-settings-tab.tsx # Edit project details & danger zone (deletion)
│   ├── stationery/                  # Reusable SVG physical stationery components
│   │   ├── paperclip.tsx            # Brass, silver, and copper wire paperclips
│   │   ├── pushpin.tsx              # Colored pushpins with light reflections
│   │   ├── torn-edge.tsx            # Deckle-torn paper edges
│   │   ├── washi-tape.tsx           # Textured washi tape strips with serrated edges
│   │   └── wax-seal.tsx             # Radial gradient wax seal stamp with custom monogram
│   ├── tasks/
│   │   ├── create-task-modal.tsx    # Create task modal with title, description, status, assignee
│   │   ├── kanban-board.tsx         # 3-column physical Kanban board with paper lift shadows
│   │   ├── task-detail-modal.tsx    # Task drawer with subtasks, checklists, status, and delete
│   │   ├── task-list-view.tsx       # Double-ruled accounting ledger table with status selector
│   │   └── timeline-matrix.tsx      # Collapsible 4-phase Sprint Roadmap & Timeline banner
│   ├── seo/
│   │   └── json-ld.tsx              # Schema.org SoftwareApplication JSON-LD component
│   └── ui/                          # Design system primitives (Avatar, Toast, StatusBadge, RoleBadge)
│
├── context/
│   └── auth-context.tsx             # AuthProvider and useAuth hook
├── lib/
│   ├── api-client.ts                # Axios singleton with error normalization
│   └── project-utils.ts             # Project extraction and normalization utilities
└── types/
    └── api.ts                       # TypeScript interfaces (User, Project, Task, Subtask, Role)
```

---

## 5. Visual Metaphors & Design System

1. **Canvas & Surfaces**:
   - Canvas: Warm Ivory (`#FBF9F5`)
   - Surface Cards: Pure Cardstock (`#FFFFFF`) with subtle warm tone
   - Muted Cardboard: `#FAF7F0` / `#ECE2D0`
   - Borders: Hand-drawn style soft linen `#DDD3C4` and `#E3D8C8`
2. **Color Accents**:
   - **Terracotta Clay** (`#C86446`): Primary action buttons, wax seals, active indicators
   - **Botanical Sage** (`#4E7545`): Completed tasks, positive status pills
   - **Mustard Ochre** (`#B87C1E`): In-progress tasks, highlights, washi tape
   - **Slate Navy** (`#2C4258`): Administrative roles and secondary accents
3. **Papercraft Effects** (`globals.css`):
   - `.paper-shadow`: Layered subtle ambient shadow simulating physical paper elevation
   - `.paper-lift`: Hover transition elevating card depth by 2px with shadow expansion
   - `.ledger-ruled`: Alternating subtle horizontal ruled lines mimicking physical accounting paper
   - `.drafting-grid`: Subtle blueprint/graph-paper background for sprint roadmap banners

---

## 6. Public Landing Page & SEO Architecture

- **Single `<h1>`**: *"Project management crafted with the tactile clarity of paper."*
- **Interactive Live Desk**: A fully functional hero preview where visitors can move tasks across To Do, In Progress, and Done, toggle the 4-phase sprint roadmap banner, and switch to the accounting ledger view.
- **Structured Data**: Schema.org `SoftwareApplication` and `Organization` JSON-LD injected in the page head.
- **Dynamic Crawling Control**:
  - `app/robots.ts`: Allows public discovery for `/`, `/login`, `/register`, `/forgot-password`; shields workspace `/projects/*` and `/api/*`.
  - `app/sitemap.ts`: Generates sitemap with weekly change frequency for public routes.
  - `app/manifest.ts`: Generates web app manifest for PWA and mobile search engines.
- **Core Web Vitals**: Google Fonts configured with `display: 'swap'` to eliminate FOIT (Flash of Invisible Text) and ensure LCP < 1.2s.

---

## 7. Development & Runtime Configuration

- **Frontend Port**: `3001` (configured in `package.json`: `next dev -p 3001`)
- **Backend Port**: `http://localhost:3000`
- **Reverse Proxy**: `next.config.ts` rewrites `/api/v1/:path*` to `http://localhost:3000/api/v1/:path*`
- **TypeScript Verification**: `npx tsc --noEmit`
- **Production Build**: `npm run build`
