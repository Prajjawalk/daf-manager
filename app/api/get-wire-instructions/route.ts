import { NextResponse } from "next/server";

export async function GET() {
  try {
    const wireInstructions = await fetch(
      // For domestic wire instructions
      `${process.env.ENDAOMENT_API_URL}/v1/donation-pledges/wire/details/domestic`,
      // For international wire instructions
      // `${getEndaomentUrls().api}/v1/donation-pledges/wire/details/international`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //   This does not need any authentication since this is public information
        },
      }
    );

    const data = await wireInstructions.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch wire instructions" },
      { status: 500 }
    );
  }
}
