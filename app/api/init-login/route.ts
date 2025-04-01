import { connectToDatabase } from "../../../lib/mongodb";
import { User } from "../../../models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

// Helper functions remain the same
function toUrlSafe(base64: string) {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function generateCodeVerifier() {
  const randomBytes = crypto.randomBytes(32);
  return toUrlSafe(Buffer.from(randomBytes).toString("base64"));
}

async function generateCodeChallenge(codeVerifier: string) {
  const hash = crypto.createHash("sha256");
  hash.update(codeVerifier);
  return toUrlSafe(hash.digest("base64"));
}

export async function GET() {
  await connectToDatabase();

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString("hex");

  // Store in MongoDB instead of file system
  await User.create({
    state,
    codeVerifier,
    codeChallenge,
  });

  const staticUrl = `${process.env.ENDAOMENT_AUTH_URL}/auth`;
  const urlParams = new URLSearchParams({
    response_type: "code",
    prompt: "consent",
    scope: "openid offline_access accounts transactions profile",
    client_id: process.env.ENDAOMENT_CLIENT_ID!,
    redirect_uri: process.env.ENDAOMENT_REDIRECT_URI!,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  });

  const urlToRedirect = `${staticUrl}?${urlParams
    .toString()
    .replace(/\+/g, "%20")}`;
  return NextResponse.json({ url: urlToRedirect });
}
