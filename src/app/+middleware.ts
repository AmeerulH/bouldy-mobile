import type { MiddlewareFunction } from 'expo-router/server';
import { notFoundDocument } from '../content/not-found-document.ts';
export const unstable_settings = { matcher: { patterns: ['/history', '/brand-preview', '/loading-preview', '/component-preview'] } };
const middleware: MiddlewareFunction = request => {
  const url = new URL(request.url);
  if (url.pathname === '/history' && ['GET', 'HEAD'].includes(request.method)) return Response.redirect(new URL('/sessions', request.url), 307);
  if (process.env.NODE_ENV === 'production' && ['/brand-preview', '/loading-preview', '/component-preview'].includes(url.pathname)) {
    return new Response(request.method === 'HEAD' ? null : notFoundDocument, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
};
export default middleware;
