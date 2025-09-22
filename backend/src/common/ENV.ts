import jetEnv, { num, str } from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { NodeEnvs } from './constants';


/******************************************************************************
                                 Setup
******************************************************************************/

const ENV = jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num,

  /** MongoDB */
  MongodbUri: str,

  /** Tenor API */
  TenorApiBaseUrl: str,
  TenorApiKey: str,
  TenorApiClientKey: str,

  AccessTokenSecret: str,
  RefreshTokenSecret: str,
});


/******************************************************************************
                            Export default
******************************************************************************/

export default ENV;
