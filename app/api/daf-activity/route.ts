import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fundId = searchParams.get("fundId");

  if (!fundId) {
    return NextResponse.json({ error: "Fund ID is required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("ndao_token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dafActivityResponse = await fetch(
      `${process.env.ENDAOMENT_API_URL}/v1/activity/fund/${fundId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    const dafActivity = await dafActivityResponse.json();

    if (dafActivity.statusCode === 500) {
      return NextResponse.json({ error: dafActivity.message }, { status: 500 });
    }

    return NextResponse.json(dafActivity);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
