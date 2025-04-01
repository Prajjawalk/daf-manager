import { connectToDatabase } from "../../../lib/mongodb";
import { User } from "../../../models/User";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get("state");
  const code = searchParams.get("code");

  if (!state || !code) {
    return NextResponse.json(
      { error: "Missing state or code" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ state });
  if (!user) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const staticUrl = `${process.env.ENDAOMENT_AUTH_URL}/token`;
  const formData = new URLSearchParams();
  formData.append("grant_type", "authorization_code");
  formData.append("code", code);
  formData.append("code_verifier", user.codeVerifier);
  formData.append("redirect_uri", process.env.ENDAOMENT_REDIRECT_URI!);

  const tokenResponse = await fetch(staticUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.ENDAOMENT_CLIENT_ID}:${process.env.ENDAOMENT_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: formData,
  });

  const tokenResponseJson = await tokenResponse.json();

  // Update user with access token
  await User.findByIdAndUpdate(user._id, {
    accessToken: tokenResponseJson.access_token,
  });

  const cookieStore = await cookies();
  cookieStore.set("ndao_token", tokenResponseJson.access_token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  return NextResponse.redirect(new URL("/", request.url));
}
