import { IBlogInfo, IUserInfo } from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

const getMypageApi = async ({ token }: { token: TokenType }) => {
  const { data } = await defaultInstance(token).get(`/user/detail`);

  return data;
};

export const useGetMypageQuery = ({ token }: { token: TokenType }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [`mypage`, token],
    queryFn: () => getMypageApi({ token }),
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error };
};

const getHistoryApi = async ({ token }: { token: TokenType }) => {
  const { data } = await defaultInstance(token).get(`/history`);

  return data;
};

export const useGetHistoryQuery = ({ token }: { token: TokenType }) => {
  const { isLoading, error, data } = useQuery([`history`, token], () => getHistoryApi({ token }), {
    enabled: !!token,
    refetchOnWindowFocus: false,
  });
  return { data, isLoading, error };
};

export const postChangeUserInfoApi = async ({
  body,
  token,
}: {
  body: IUserInfo;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post('/change/user/info', body);

  return data;
};

export const postChangeUserImageApi = async ({
  body,
  token,
}: {
  body: FormData;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post('/change/user/image', body);

  return data;
};

export const postChangeBlogNameApi = async ({
  body,
  token,
}: {
  body: IBlogInfo;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post(`/change/blog/name`, body);

  return data;
};

export const getVisitApi = async ({ token }: { token: TokenType }) => {
  const { data } = await defaultInstance(token).get(`/visit`);

  return data;
};

export const useGetVisitQuery = ({ token }: { token: TokenType }) => {
  const { isLoading, error, data } = useQuery([`visit`, token], () => getVisitApi({ token }), {
    enabled: !!token,
    refetchOnWindowFocus: false,
  });
  return { data, isLoading, error };
};

export const postVisitApi = async ({
  body,
  token,
}: {
  body: { blogId: number };
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post(`/visit?blogId=${body.blogId}`);

  return data;
};
