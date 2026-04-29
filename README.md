# Nexus CRM

A modern, high-performance customer relationship management system built with Next.js 15, TypeScript, and Tailwind CSS 4.

## 🚀 Features

- **Executive Dashboard**: Real-time sales metrics, revenue growth charts, and pipeline conversion analytics.
- **Sales Pipeline (Kanban)**: Interactive drag-and-drop board for managing deals through stages.
- **Contact Management**: Comprehensive customer database with grid and list views.
- **Command Palette (⌘K)**: Instant global search and navigation across the entire platform.
- **Dark Mode**: Fully optimized, high-contrast dark theme for professional use.
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop devices.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS 4, Lucide Icons, Framer Motion
- **Components**: Radix UI Primitives, Sonner (Notifications)
- **Charts**: Recharts
- **State/Drag & Drop**: @hello-pangea/dnd
- **API**: Express (TypeScript) + Prisma (PostgreSQL)

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Run the API server** (separate terminal):
   ```bash
   npm run dev:api
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **API health check**:
   - `http://localhost:3001/health`

### 🐳 Docker Setup

Run the entire stack (including mock services) using Docker:

```bash
docker compose up --build
```

## ✅ Tests

```bash
npm test
```

## 🔐 Authentication

If you seed the database (`npm run db:seed`), you can use:

- **Email**: `admin@crm.com`
- **Password**: `admin123`

## 📂 Project Structure

- `src/app`: Next.js App Router (pages and layouts)
- `src/components`: Reusable UI and shared components
- `src/lib`: API clients, utilities, and configuration
- `docs/`: Technical documentation and project requirements

## 📄 Documentation

- [Architecture Overview](./docs/architecture.md)
- [MVP Scope](./docs/mvp-scope.md)
- [Requirements](./docs/requirements.md)
- [API Spec](./docs/api-spec.md)
- [Testing](./docs/testing.md)
- [Deployment](./docs/deployment.md)
- [Data Model](./docs/data-model.md)

## 🤝 Contributing

This project follows professional software development standards. Please ensure all code changes include appropriate documentation and pass linting/type checks.

---
Built with Nexus CRM - Empowering Sales Teams.
