import { NextResponse } from "next/server";
import type {
  NextRequest,
} from "next/server";

export function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get(
      "token"
    )?.value;

  const path =
    request.nextUrl.pathname;

  console.log(
    "path:",
    path
  );
  console.log(
    "token:",
    token
  );

  // protect only home page
  if (
    path === "/" &&
    !token
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  // user déjà login
  // ma ydkholch login
  if (
    path ===
      "/login" &&
    token
  ) {
    return NextResponse.redirect(
      new URL(
        "/",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
  ],
};