import { cookies } from "next/headers";
import { getEndaomentUrls } from "../../utils/endaoment-urls";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ndao_token");
  if (!token) throw new Error("No access token found in cookies");
  const access_token = token.value;
  try {
    const usersDafListResponse = await fetch(
      `${getEndaomentUrls().api}/v1/funds/mine`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Pass the user's token in the Authorization header
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const usersDafList = await usersDafListResponse.json();

    return NextResponse.json(usersDafList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching DAFs" },
      { status: 500 }
    );
  }
}
