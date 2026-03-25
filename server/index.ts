import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import os from "os";

const app = express();

// Enable gzip/brotli compression for all responses
app.use(compression());
const httpServer = createServer(app);

if (process.env.NODE_ENV !== "production") {
  const openaiKey = (process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "").trim();
  console.log(openaiKey ? "[Config] OpenAI API key: loaded" : "[Config] OpenAI API key: not set (AI chat will be unavailable)");
}

const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;

if (isProduction && !sessionSecret) {
  // In production we require a strong, explicit session secret.
  throw new Error(
    "SESSION_SECRET environment variable must be set in production for secure sessions.",
  );
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

app.use(
  express.json({
    /** Default 100kb breaks contact + AI chat payloads (base64 images in transcript). */
    limit: "15mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Session middleware is set up below after we know if DB is available

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  let useMemoryStore = !process.env.DATABASE_URL;
  if (process.env.DATABASE_URL) {
    try {
      const pg = await import("pg");
      const pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL });
      const client = await pool.connect();
      client.release();
      await pool.end();
    } catch {
      useMemoryStore = true;
    }
  }

  if (useMemoryStore) {
    const { setStorage } = await import("./storage");
    const { MemoryStorage } = await import("./storage-memory");
    setStorage(new MemoryStorage());
    log("Using in-memory storage (PostgreSQL not available).");
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const MemoryStore = require("memorystore")(session);
    app.use(
      session({
        store: new MemoryStore({ checkPeriod: 86400000 }),
        secret: sessionSecret ?? "dev-webstudio-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
        },
      }),
    );
  } else {
    const PgStore = connectPgSimple(session);
    app.use(
      session({
        store: new PgStore({
          conString: process.env.DATABASE_URL,
          createTableIfMissing: true,
        }),
        secret: sessionSecret ?? "dev-webstudio-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
        },
      }),
    );
  }

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      // Note: reusePort is not supported on all platforms (e.g. Windows),
      // so we omit it to avoid ENOTSUP errors when listening.
    },
    () => {
      const url = `http://localhost:${port}`;
      log("Server is up.");
      log(`Website: ${url}`);
      // Show LAN address so you can open from another device on the same network
      const ifaces = os.networkInterfaces();
      for (const name of Object.keys(ifaces)) {
        for (const iface of ifaces[name] ?? []) {
          if (iface.family === "IPv4" && !iface.internal) {
            log(`On this network: http://${iface.address}:${port}`);
          }
        }
      }
    },
  );
})();
