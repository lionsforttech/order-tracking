import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { message: "API_URL is not set" },
        { status: 500 }
      );
    }

    const res = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message ?? "Login failed" },
        { status: res.status }
      );
    }

    const accessToken = data?.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { message: "No accessToken returned from API" },
        { status: 502 }
      );
    }

    const response = NextResponse.json({ ok: true });

    // Store JWT in httpOnly cookie (safer than localStorage)
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}