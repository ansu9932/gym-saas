# FlexBoard

Premium multi-gym membership monitoring SaaS built with React, Tailwind CSS, Framer Motion, Express, and MongoDB.

## What It Includes

- Multi-tenant gym registration and isolated JWT-secured dashboards
- Premium dark/light UI with glassmorphism, neon accents, animated dashboard cards, and responsive layout
- Member management with profile photo upload, search, filters, pagination, renewals, and CSV export
- Plan management for monthly, quarterly, yearly, and custom packages
- Dashboard analytics for total members, active memberships, expiring soon, expired members, revenue, new members, and plan mix
- Notification center for renewals, expiry reminders, check-ins, and operational events
- QR-based member pass generation plus attendance logging
- Role support for `admin` and `staff`
- Automated reminder job for 3-day-before-expiry and on-expiry email flows
- Optional WhatsApp reminder hook when API credentials are configured

## Project Structure

```text
.
├── apps
│   ├── client   # React + Tailwind + Framer Motion dashboard
│   └── server   # Express + MongoDB REST API, reminder jobs, uploads
├── .env.example
├── package.json
└── README.md
```

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts, React Router
- Backend: Node.js, Express, Mongoose, JWT, Multer, Nodemailer, QRCode, Node Cron
- Database: MongoDB

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB and SMTP credentials.

4. Start the API:

```bash
npm run dev:server
```

5. Start the frontend:

```bash
npm run dev:client
```

6. Open [http://localhost:5173](http://localhost:5173)

## Environment Variables

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/gym-membership-monitoring
JWT_SECRET=replace-with-a-strong-secret
TIMEZONE=Asia/Kolkata
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=mailer@example.com
SMTP_PASS=app-password
SMTP_FROM="FlexBoard <no-reply@example.com>"
ENABLE_WHATSAPP=false
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=
VITE_API_URL=http://localhost:5000/api
```

## Main API Areas

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/dashboard/overview`
- `GET/POST/PUT/DELETE /api/plans`
- `GET/POST/PUT/DELETE /api/members`
- `POST /api/members/:id/renew`
- `GET /api/members/export/csv`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/attendance`
- `GET /api/attendance/:memberId/qrcode`
- `POST /api/attendance/check-in`

## Verification

- Backend syntax check:

```bash
find apps/server/src -name '*.js' -exec node --check {} +
```

- Frontend production build:

```bash
npm run build --workspace client
```

## Notes

- Member reminder jobs run daily at `09:00` in the configured server time zone.
- File uploads are stored in `apps/server/uploads`.
- The current build is production-ready in code structure, but you still need real MongoDB and SMTP credentials for live operations.
