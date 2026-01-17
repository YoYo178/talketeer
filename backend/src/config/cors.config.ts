import ENV from '@src/common/ENV';
import { CorsOptions } from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5173/talketeer/',
  'https://yoyo178.github.io',
  ENV.FrontendOrigin,
];

export const CORSConfig: CorsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS Policy'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};