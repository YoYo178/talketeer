import jetEnv, { num, str } from 'jet-env';
import { isValueOf } from 'jet-validators';

import { NODE_ENVS } from './constants';


/******************************************************************************
                                 Setup
******************************************************************************/

const ENV = jetEnv({
  NodeEnv: isValueOf(NODE_ENVS),
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
