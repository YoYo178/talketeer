import z from 'zod';

export const NODE_ENVS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

const envSchema = z.object({
  NODE_ENV: z.enum(Object.values(NODE_ENVS)).default(NODE_ENVS.DEVELOPMENT),
  PORT: z.coerce.number().default(3000),

  /** General */
  APP_NAME: z.string(),
  DISABLE_HELMET: z.coerce.boolean(),

  /** Frontend */
  FRONTEND_ORIGIN: z.string(),

  /** MongoDB */
  MONGODB_URI: z.string(),

  /** JWT */
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),

  /** Tenor API */
  TENOR_API_BASE_URL: z.string(),
  TENOR_API_KEY: z.string(),
  TENOR_API_CLIENT_KEY: z.string(),

  /** SMTP */
  SMTP_PROVIDER: z.string(),
  SMTP_EMAIL: z.string(),
  SMTP_PASS: z.string(),

  /** Optional SSL config */
  SSL_KEY_PATH: z.string().optional(),
  SSL_CERT_PATH: z.string().optional(),
});

const ENV = envSchema.parse(process.env);

export default ENV;
