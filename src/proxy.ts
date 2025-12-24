import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function proxy(request: NextRequest) {
  const cookiesStore = await cookies();
  const authToken = cookiesStore.get("auth_chat_token")?.value;
  if (authToken) {
    try {
      jwt.verify(authToken, process.env.TOKEN_SECRET as string);
    } catch (e) {
      cookiesStore.delete("auth_chat_token");
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/rooms:path*",
};
