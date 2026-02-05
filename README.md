# DropZone

A real-time file sharing API with cloud storage, shareable links, and WebSocket notifications.

## Technologies

- **Backend**: Node.js, Express 5, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Cloudinary (cloud file storage)
- **Auth**: JWT with HTTP-only cookies
- **Real-time**: Socket.io
- **Validation**: Zod
- **Docs**: Swagger/OpenAPI

## Features

- 🔐 **Authentication** - Register, login, logout with JWT cookies
- 📁 **File Management** - Upload, list, download, delete files
- 🔗 **Share Links** - Generate links with optional password & expiration
- ⚡ **Real-time Events** - Socket.io notifications for file/share actions
- 🛡️ **Security** - Rate limiting, password hashing, input validation
- 📚 **API Docs** - Interactive Swagger UI at `/api-docs`

## Key Learnings

- **Prisma 7 with Adapters** - Using `@prisma/adapter-pg` for PostgreSQL connections
- **Cloudinary Integration** - Buffer to base64 conversion for direct uploads
- **Resource Type Handling** - Different Cloudinary resource types for images/video/audio
- **Socket.io Architecture** - Emit utility pattern for decoupled real-time events
- **Express 5** - Modern async error handling
- **Zod Validation** - Schema-based request validation
- **Cookie-based Auth** - Secure HTTP-only JWT tokens

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── routes/         # API routes with Swagger docs
│   ├── middleware/     # Auth, rate limiting
│   ├── libs/           # Prisma, Cloudinary, Socket.io
│   ├── types/          # Zod schemas, TypeScript types
│   └── utils/          # Error handler, rate limiter
├── prisma/
│   └── schema.prisma   # Database schema
└── generated/          # Prisma client
```

## Setup

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- Cloudinary account

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/dropzone.git
cd dropzone/backend
npm install
```

### 2. Start PostgreSQL (Docker)

```bash
docker run -d \
  --name dropzone-db \
  -e POSTGRES_USER=dropzone-user \
  -e POSTGRES_PASSWORD=dropzone-password \
  -e POSTGRES_DB=dropzone \
  -p 5432:5432 \
  postgres:16
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://dropzone-user:dropzone-password@localhost:5432/dropzone"
JWT_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Setup Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run

```bash
npm run dev
```

Server: `http://localhost:3000`  
Swagger: `http://localhost:3000/api-docs`

## API Endpoints

| Method | Endpoint                         | Description        |
| ------ | -------------------------------- | ------------------ |
| POST   | `/api/auth/register`             | Register user      |
| POST   | `/api/auth/login`                | Login user         |
| POST   | `/api/auth/logout`               | Logout user        |
| GET    | `/api/auth/verify`               | Verify token       |
| POST   | `/api/upload`                    | Upload file        |
| GET    | `/api/upload/files`              | List files         |
| GET    | `/api/upload/files/:id`          | Get file           |
| DELETE | `/api/upload/files/:id`          | Delete file        |
| GET    | `/api/upload/files/:id/download` | Download file      |
| POST   | `/api/share/:fileId`             | Create share link  |
| GET    | `/api/share/:shortCode`          | Access shared file |

## Socket.io Events

Events are emitted to user-specific channels (`event:userId`):

| Event                    | Trigger              | Data                |
| ------------------------ | -------------------- | ------------------- |
| `file:uploaded:{userId}` | File uploaded        | `{ file }`          |
| `file:deleted:{userId}`  | File deleted         | `{ fileId }`        |
| `share:created:{userId}` | Share link created   | `{ link }`          |
| `file:accessed:{userId}` | Shared file accessed | `{ fileId, views }` |

## License

MIT
