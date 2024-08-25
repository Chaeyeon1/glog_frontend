import { IPRParams, IPostedPost, IUnPostedPost } from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

export const getPRApi = async ({ params, token }: { params: IPRParams; token?: TokenType }) => {
  const { data } = await defaultInstance(token).get('/pr/posts/posted', { params });

  return data;
};

export const useGetPRQuery = ({ params, token }: { params: IPRParams; token?: TokenType }) => {
  const {
    isLoading,
    error,
    data: backendData,
  } = useQuery([`prList`, params, token], () => getPRApi({ params, token }), {
    enabled: !!params.categoryId && !token,
  });

  const data: IPostedPost = backendData;

  return { data, isLoading, error };
};

export const getPRUnPostedApi = async ({
  params,
  token,
}: {
  params: IPRParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/pr/posts/unposted', { params });

  return data;
};

export const useGetPRUnpostedQuery = ({
  params,
  token,
  enabled = true,
}: {
  params: IPRParams;
  token: TokenType;
  enabled?: boolean;
}) => {
  const {
    isLoading,
    error,
    data: backendData,
  } = useQuery([`prUnpostedList`, token, enabled], () => getPRUnPostedApi({ params, token }), {
    enabled: !!params.categoryId && !!token && enabled,
  });
  const data: IUnPostedPost = backendData;
  return { data, isLoading, error };
};
