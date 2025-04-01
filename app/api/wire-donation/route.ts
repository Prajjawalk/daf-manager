import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { amount, fundId } = await request.json();

    if (!amount || !fundId) {
      return NextResponse.json(
        { error: "Missing amount or fundId" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("ndao_token");
    if (!token) throw new Error("No access token found in cookies");
    const access_token = token.value;

    const idempotencyKey = crypto.randomUUID();
    const pledgedAmountMicroDollars = (
      BigInt(amount) * BigInt(1000000)
    ).toString();

    const donationRequest = await fetch(
      `${process.env.ENDAOMENT_API_URL}/v1/donation-pledges/wire`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Pass the user's token in the Authorization header
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          pledgedAmountMicroDollars,
          fundId,
          idempotencyKey,
        }),
      }
    );

    const data = await donationRequest.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to process donation" },
      { status: 500 }
    );
  }
}
