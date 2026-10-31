import path from 'node:path';
import { createRequestHandler } from 'expo-server/adapter/vercel';

// Static assets are served by Vercel; Expo handles pages, middleware and API routes.
export default createRequestHandler({
  build: path.join(__dirname, '../dist/server'),
});
