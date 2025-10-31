import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { TGIFSearchQuery } from '@src/schemas';
import { TenorClient } from '@src/services/gif.service';
import type { Request, Response } from 'express';

const tenorClient = TenorClient.getInstance();

export const getGIFs = async (req: Request, res: Response) => {
  const { query } = req.query as TGIFSearchQuery;

  const resp = await tenorClient.search(query);

  res.status(HttpStatusCodes.OK).json({ success: true, data: resp });
};