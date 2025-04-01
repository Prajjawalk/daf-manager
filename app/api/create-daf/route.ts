import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ndao_token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, fundAdvisor } = body;

  if (!name || !description || !fundAdvisor) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const fundCreationResponse = await fetch(
    `${process.env.ENDAOMENT_API_URL}/v1/funds`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        fundInput: {
          name,
          description,
          advisor: fundAdvisor,
        },
      }),
    }
  );

  const responseData = await fundCreationResponse.json();
  return NextResponse.json(responseData);
}
