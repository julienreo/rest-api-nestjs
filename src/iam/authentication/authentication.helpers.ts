import { Response } from 'express';

/**
 * Set a cookie in user's browser
 *
 * @param res
 * @param key
 * @param value
 */
export const setCookie = (res: Response, key: string, value: string) => {
  const options = { secure: true, httpOnly: true, sameSite: true };
  res.cookie(key, value, options);
};
