import jetEnv, { num, str } from 'jet-env';


/******************************************************************************
                                 Setup
******************************************************************************/

const ENV = jetEnv({
  /** General */
  NodeEnv: str,
  AppName: str,
  Port: num,

  /** Google OAuth */
  GoogleClientId: str,
  GoogleClientSecret: str,
  BackendOrigin: str,

  /** Frontend */
  FrontendOrigin: str,

  /** MongoDB */
  MongodbUri: str,

  /** JWT */
  AccessTokenSecret: str,
  RefreshTokenSecret: str,

  /** Tenor API */
  TenorApiBaseUrl: str,
  TenorApiKey: str,
  TenorApiClientKey: str,

  /** SMTP */
  SmtpProvider: str,
  SmtpEmail: str,
  SmtpPass: str,
});


/******************************************************************************
                            Export default
******************************************************************************/

export default ENV;
