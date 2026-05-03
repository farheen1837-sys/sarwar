import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const rawAppUrl = process.env.APP_URL || "http://localhost:3000";
const appUrl = rawAppUrl.replace(/\/$/, ""); 

const client = new OAuth2Client(googleClientId, googleClientSecret);

async function startServer() {
  app.use(express.json());

  // API Route for Google Auth URL
  app.get("/api/auth/google/url", (req, res) => {
    if (!googleClientId || googleClientId.includes("YOUR_GOOGLE_CLIENT_ID") || !googleClientId.startsWith("AIza") && !googleClientId.includes(".apps.googleusercontent.com")) {
      return res.status(400).json({ 
        error: "Google Client ID not configured",
        details: "Please add VITE_GOOGLE_CLIENT_ID to your AI Studio Secrets."
      });
    }

    const redirectUri = `${appUrl}/auth/google/callback`;
    
    try {
      const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile", 
          "https://www.googleapis.com/auth/userinfo.email"
        ],
        redirect_uri: redirectUri,
      });
      res.json({ url });
    } catch (err) {
      res.status(500).json({ error: "Failed to generate auth URL" });
    }
  });

  // API Route for Google Auth Callback
  app.get(["/auth/google/callback", "/auth/google/callback/"], async (req, res) => {
    const code = req.query.code as string;
    const redirectUri = `${appUrl}/auth/google/callback`;

    try {
      const { tokens } = await client.getToken({
        code,
        redirect_uri: redirectUri
      });
      
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();
      
      res.send(`
        <html>
          <head><title>Authenticating...</title></head>
          <body style="background: #050505; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="text-align: center;">
              <h2 style="font-weight: 300; letter-spacing: 0.1em;">FLAMEWORK</h2>
              <p style="opacity: 0.5; font-size: 12px; margin-top: 20px;">Identity synchronized. Closing...</p>
            </div>
            <script>
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                user: ${JSON.stringify({
                  email: payload?.email,
                  name: payload?.name,
                  picture: payload?.picture
                })} 
              }, '*');
              setTimeout(() => window.close(), 500);
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      res.status(500).send("Authentication failed. Please check your credentials.");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
