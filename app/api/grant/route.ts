import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, fundId, orgId, purpose } = await request.json();

    if (!amount || !fundId || !orgId || !purpose) {
      // Return an error response if any of the required fields are missing

      NextResponse.json({ error: "Missing required fields" }, { status: 400 });

      return;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("ndao_token");
    if (!token) throw new Error("No access token found in cookies");
    const access_token = token.value;

    const idempotencyKey = crypto.randomUUID();
    const requestedAmount = (BigInt(amount) * BigInt(1000000)).toString();

    const grantRequest = await fetch(
      `${process.env.ENDAOMENT_API_URL}/v1/transfers/async-grants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Pass the user's token in the Authorization header
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          originFundId: fundId,
          destinationOrgId: orgId,
          requestedAmount,
          purpose,
          idempotencyKey,
        }),
      }
    );

    const grantResult = await grantRequest.json();
    console.log(grantResult);

    if (!grantResult.ok) {
      throw new Error("error granting Daf");
    }

    return NextResponse.json(grantResult);
  } catch (error) {
    console.error("Error submitting grant:", error);
    return NextResponse.json(
      { error: "Failed to submit grant" },
      { status: 500 }
    );
  }
}
