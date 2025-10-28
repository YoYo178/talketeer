import ENV from '@src/common/ENV';
import { CorsOptions } from 'cors';

const allowedOrigins = [
  'https://localhost:5173',
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