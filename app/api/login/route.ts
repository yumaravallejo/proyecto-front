import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Llama al backend (Spring Boot)
  const URL = process.env.NEXT_PUBLIC_API;
  const res = await fetch(URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // Setea la cookie desde el dominio del frontend
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
