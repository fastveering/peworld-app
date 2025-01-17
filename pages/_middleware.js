import { NextResponse } from 'next/server';
import jwtDecode from 'jwt-decode';

export default function middleware(req) {
  const { token } = req.cookies;
  const { pathname, origin } = req.nextUrl;

  let decoded = '';
  if (token) {
    decoded = jwtDecode(token);
  }

  // Private Route
  if (
    !token &&
    pathname !== '/auth/login' &&
    pathname !== '/auth/register' &&
    pathname !== '/auth/forgot-password' &&
    pathname !== '/auth/reset-password' &&
    pathname !== '/'
  ) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  // Public Route
  if (
    token &&
    (pathname === '/auth/login' ||
      pathname === '/auth/register' ||
      pathname === '/auth/forgot-password' ||
      pathname === '/auth/reset-password')
  ) {
    return NextResponse.redirect(`${origin}`);
  }

  // Validate Worker
  if (
    decoded.role === 0 &&
    (pathname === '/recruiter' || pathname === '/recruiter/edit')
  ) {
    return NextResponse.redirect(`${origin}/worker`);
  }

  // Validate Recruiter
  if (
    decoded.role === 1 &&
    (pathname === '/worker' ||
      pathname === '/worker/edit' ||
      pathname === '/worker/:id')
  ) {
    return NextResponse.redirect(`${origin}/recruiter`);
  }
}
