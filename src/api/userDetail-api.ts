import { useQuery } from '@tanstack/react-query';
import { defaultInstance } from '.';
import { IUserDetail } from '@/types/dto';
import { TokenType } from '@/types/common';

export const GetUserDetailApi = async ({ token }: { token: TokenType }) => {
  const { data } = await defaultInstance(token).get('/user/detail');

  return data;
};

export const deleteUserApi = async ({ token }: { token: TokenType }) => {
  const { data } = await defaultInstance(token).delete('/user');

  return data;
};

export const useGetUserDetailQuery = ({ token }: { token: TokenType }) => {
  const {
    isLoading,
    error,
    data: backendData,
  } = useQuery(['userDetail', token], () => GetUserDetailApi({ token }), {
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  const data: IUserDetail = backendData;

  return { isLoading, error, data };
};
