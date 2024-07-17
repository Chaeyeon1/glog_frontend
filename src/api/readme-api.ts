import { IBlogIdParams, IReadMe, IReadMeParams } from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

export const getReadMeApi = async ({
  token,
  params,
}: {
  params: IReadMeParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/read-me', { params });

  return data;
};

export const useGetReadMeQuery = ({
  token,
  params,
}: {
  params: IReadMeParams;
  token: TokenType;
}) => {
  const {
    isLoading,
    error,
    data: backendData,
  } = useQuery([`readMe`, params, token], () => getReadMeApi({ params, token }), {
    enabled: !!params.blogId,
  });

  const data: { blogName: string; content: string; isMe: boolean } = backendData;
  return { data, isLoading, error };
};

export const getBlogIdApi = async ({
  token,
  params,
}: {
  params: IBlogIdParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/blogid', { params });

  return data;
};

export const useGetBlogIdQuery = ({
  token,
  params,
}: {
  params: IBlogIdParams;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    [`blogid`, params, token],
    () => getBlogIdApi({ params, token }),
    { enabled: !!params.blogUrl },
  );
  return { data, isLoading, error };
};

export const PutReadMeApi = async ({ token, body }: { body: IReadMe; token: TokenType }) => {
  const { data } = await defaultInstance(token).put('/read-me', body);

  return data;
};
