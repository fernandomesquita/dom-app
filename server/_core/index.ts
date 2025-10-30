import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Upload de arquivos para S3
  app.post("/api/upload", express.json(), async (req, res) => {
    try {
      const { storagePut } = await import("../storage");
      
      // Espera receber { file: base64String, filename: string, mimeType: string }
      const { file, filename, mimeType } = req.body;
      
      if (!file || !filename) {
        return res.status(400).json({ error: "Missing file or filename" });
      }
      
      // Converter base64 para Buffer
      const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      // Gerar nome único
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileKey = `bugs/${timestamp}-${randomSuffix}-${filename}`;
      
      // Upload para S3
      const { url } = await storagePut(fileKey, buffer, mimeType || "image/png");
      
      res.json({ url, key: fileKey });
    } catch (error) {
      console.error("[/api/upload] Erro:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    
    // Iniciar scheduler de jobs (apenas em produção)
    if (process.env.NODE_ENV === "production") {
      import("../jobs/scheduler").then(({ iniciarScheduler }) => {
        iniciarScheduler();
      });
    }
  });
}

startServer().catch(console.error);
