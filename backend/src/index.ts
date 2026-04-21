import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";
import { authRouter } from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { uploadRouter } from "./routes/uploadRouter.js";
import { shareRouter } from "./routes/shareRouter.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./libs/socket.js";

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
});

initSocket(io);

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("emit", (data) => {
    console.log(`Socket ${data} emitted`);
  });

  socket.on("disconnect", (socket) => {
    console.log(`Socket ${socket} disconnected`);
  });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DropZone API",
      version: "1.0.0",
      description: "Real-time file sharing API with Cloudinary storage",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/share", shareRouter);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
