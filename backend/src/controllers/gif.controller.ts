import HTTP_STATUS_CODES from '@src/common/HTTP_STATUS_CODES';
import { TGIFSearchQuery } from '@src/schemas';
import { TenorClient } from '@src/services/gif.service';
import type { Request, Response } from 'express';

const tenorClient = TenorClient.getInstance();

export const getGIFs = async (req: Request, res: Response) => {
  const { query } = req.query as TGIFSearchQuery;

  const resp = await tenorClient.search(query);

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: resp });
};