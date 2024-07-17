import { IDeleteReply, IPatchReplyLike, IPutReply, IReply, IReplyParams } from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

export const getReplyApi = async ({
  params,
  token,
}: {
  params: IReplyParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get(`/replies`, { params });

  return data;
};

export const useGetReplyQuery = ({ params, token }: { params: IReplyParams; token: TokenType }) => {
  const { isLoading, error, data } = useQuery(
    [`replies`, params, token],
    () => getReplyApi({ params, token }),
    { enabled: !!params && !!token },
  );
  return { data, isLoading, error };
};

export const PostReplyApi = async ({ token, body }: { body: IReply; token: TokenType }) => {
  const { data } = await defaultInstance(token).post('/replies', body);

  return data;
};

export const PatchReplyLikeApi = async ({
  params,
  token,
}: {
  params: IPatchReplyLike;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).patch(`/replies/like/${params.replyId}`, params);
  return data;
};

export const putReplyApi = async ({ token, body }: { body: IPutReply; token: TokenType }) => {
  const { data } = await defaultInstance(token).put('/replies', body);
  return data;
};

export const DeleteReplyApi = async ({
  token,
  params,
}: {
  params: IDeleteReply;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).delete('/replies', {
    params,
  });

  return data;
};
