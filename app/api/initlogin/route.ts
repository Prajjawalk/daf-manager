import { getAccessToken } from "../../utils/access-token";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    getAccessToken(req);

    NextResponse.json({ isSignedIn: true });
    return;
  } catch {
    NextResponse.json({ isSignedIn: false });
  }
};
