# DropZone 🚀

A real-time file sharing API with cloud storage, shareable links, and WebSocket notifications. Discover, upload, and share your files securely — all with instant updates.

---

## Features

- **🔐 Secure Authentication**: Register, login, and logout with JWT-based HTTP-only cookies for maximum security.
- **📁 File Management**: Seamlessly upload, list, download, and delete files with robust cloud storage integration.
- **🔗 Smart Sharing**: Generate secure shareable links with optional password protection and expiration dates.
- **⚡ Real-time Notifications**: Get instant desktop updates via Socket.io for file uploads, deletions, and shared access.
- **🛡️ Robust Security**: Built-in rate limiting, password hashing, and schema-based input validation.
- **📚 Interactive API Docs**: Fully documented REST API with Swagger UI accessible at `/api-docs`.

## Tech Stack

- **React 19 & Vite**: Ultra-fast frontend with modern React features and Tailwind CSS 4.
- **Node.js 18+ & Express 5**: Modern server-side architecture with TypeScript.
- **Prisma & PostgreSQL**: Type-safe ORM and reliable relational database.
- **Socket.io**: Bi-directional, real-time communication for instant event delivery.
- **Cloudinary**: Scalable cloud-based asset management for all file types.
- **Zod**: Robust, type-safe schema validation for all API requests.

---

## Installation & Setup

**Prerequisites:**

- Node.js 18+
- Docker (optional for local PostgreSQL)
- Cloudinary account for file storage

```bash
# Clone the repository
git clone https://github.com/ericmignardi/dropzone.git
cd dropzone

# Setup the backend
cd backend
npm install
cp .env.example .env # Configure your Cloudinary and Database credentials
npx prisma migrate dev
npx prisma generate

# Setup the frontend
cd ../frontend
npm install
```

## Usage

**Run the Backend (Local Dev):**

```bash
cd backend
npm run dev
```

**Run the Frontend:**

```bash
cd frontend
npm run dev
```

**Docker (PostgreSQL only):**

```bash
docker compose up -d
```

---

## Things Learned

Throughout the development of DropZone, several core systems and modern web patterns were explored:

- **Prisma 7 & Data Adapters**: Implementing the new `@prisma/adapter-pg` for optimized PostgreSQL connections.
- **Cloud Binary Streams**: Managing raw file buffers and converting them for direct cloud uploads.
- **Socket.io Event Hub**: Designing a decoupled emit utility pattern for user-specific real-time notifications.
- **Express 5 Async Flow**: Leveraging modern async error handling and middleware patterns.
- **Secure Auth Patterns**: Implementing HTTP-only JWT cookies to mitigate XSS and CSRF risks.
- **Resource Typing**: Handling varied file types (images, video, audio) with dynamic cloud storage configurations.
