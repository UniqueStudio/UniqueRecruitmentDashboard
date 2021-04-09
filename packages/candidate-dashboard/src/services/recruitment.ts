import { Status } from '@uniqs/config';

const HOST = process.env.HOST;
const prefix = 'recruitment';

export interface GetPendingTitlesResp {
  type: Status;
  data?: string[];
  message?: string;
}

export const getPendingTitles = async () => {
  const resp = await fetch(`${HOST}/${prefix}/pending`);
  const result: GetPendingTitlesResp = await resp.json();
  return result;
};
