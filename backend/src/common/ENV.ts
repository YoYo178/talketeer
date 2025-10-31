import jetEnv, { num, str } from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { NodeEnvs } from './constants';


/******************************************************************************
                                 Setup
******************************************************************************/

const ENV = jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num,

  /** General */
  AppName: str,

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
