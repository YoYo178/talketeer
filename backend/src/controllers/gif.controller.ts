import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';
import type { TGIFSearchQuery } from '@src/schemas/gif.schema.js';
import { TenorClient } from '@src/services/gif.service.js';
import type { Request, Response } from 'express';

const tenorClient = TenorClient.getInstance();

export const getGIFs = async (req: Request, res: Response) => {
  const { query } = req.query as TGIFSearchQuery;

  const resp = await tenorClient.search(query);

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: resp });
};
