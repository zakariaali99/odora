const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const ORIGIN = API.replace(/\/api\/v1\/?$/, '');

export const mediaUrl = (path: string | null | undefined): string | null =>
  !path ? null : path.startsWith('http') ? path : `${ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
