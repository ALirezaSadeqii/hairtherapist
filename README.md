# AURA | Appointment Booking Frontend

A minimal, editorial appointment booking web application focused on evidence-based hair care, cellular energy, and creatine wellness consultations.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🎨 Design System & Philosophy

- **Warm Minimalist Aesthetic**: Warm off-white backgrounds (`#FAF8F5`), charcoal text (`#1C1917`), hairline borders (`#E5E0D8`), and restrained muted sage green accents (`#2E3D31`) with deep burgundy alerts (`#6B2D38`).
- **Typography**: Editorial serif headings paired with clean sans-serif and native Persian typography via `Vazirmatn`.
- **Factual & Ethical Tone**: Neutral, evidence-backed scientific statements regarding cellular energy (ATP) and hair health, without medical claims, prices, or ecommerce checkout.
- **Bi-Directional Localization**: Turkish (`tr`, LTR) and Persian (`fa`, RTL) support with instant language switching and persisted locale.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- Running NestJS backend (defaults to `http://localhost:3001`)

### 2. Environment Configuration
The frontend automatically connects to `http://localhost:3001` by default. You can configure custom endpoints via `.env.local`:

```bash
# Copy example configuration
cp .env.example .env.local
```

`.env.local` contents:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> **Note**: `.env.local` is ignored by Git in `.gitignore` to avoid leaking local environment secrets.

### 3. Installation & Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run linting (zero warnings / errors)
npm run lint

# Run production build & type checks
npm run build
```

---

## 🗺️ Application Routes

| Route | Purpose | Public / Protected |
| :--- | :--- | :--- |
| `/` | Editorial landing page introducing creatine & hair care science, methodology, and booking CTA | Public |
| `/book` | Monthly availability calendar & appointment booking form | Public |
| `/admin/login` | Minimal administrator login screen | Public |
| `/admin` | Private appointment management console (calendar, list, details, cancellations, logout) | Admin Only (auth-guarded) |

---

## 🔌 API Integration Contract

The frontend integrates directly with the NestJS backend at `http://localhost:3001`:

- **Public Endpoints**:
  - `GET /appointments/availability?month=YYYY-MM`: Fetches monthly availability.
  - `POST /appointments`: Books a date (`customerName`, `email`, optional `phone`, `date`). Handles `409 Conflict` by auto-refreshing calendar and notifying customer to select another day.
- **Admin Authentication**:
  - `POST /auth/login`: Authenticates administrator and sets secure HTTP-only cookie `admin_token`.
  - `POST /auth/logout`: Clears session cookie.
  - `GET /auth/me`: Verifies active session on admin entrance.
- **Admin Appointment Management**:
  - `GET /appointments?month=YYYY-MM`: Retrieves monthly appointments with full customer contact information.
  - `GET /appointments/{id}`: Inspects individual appointment details.
  - `PATCH /appointments/{id}/cancel`: Cancels an appointment and automatically frees up the calendar date for new public bookings.

All authenticated requests use `credentials: 'include'` for secure cookie exchange.
