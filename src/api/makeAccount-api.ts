import { IMakeAccount } from '@/types/dto';
import { defaultInstance } from '.';
import { TokenType } from '@/types/common';

export const PostMakeAccountApi = async ({
  body,
  token,
}: {
  body: IMakeAccount;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post('/blog', body);

  return data;
};
