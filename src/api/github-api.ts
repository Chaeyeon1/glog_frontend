import { Repository, RepositoryParams } from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

export const getRepositoryApi = async ({ token }: { token: TokenType }) => {
  const { data } = await defaultInstance(token).get('/repository');

  return data;
};

export const useGetRepositoryQuery = ({ token }: { token: TokenType }) => {
  const {
    isLoading,
    error,
    data: backendData,
  } = useQuery([`repository`, token], () => getRepositoryApi({ token }), { enabled: !!token });
  const data: Repository = backendData;
  return { data, isLoading, error };
};

export const PostRepository = async ({
  token,
  body,
}: {
  body: RepositoryParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post(
    `/repository?categoryId=${body.categoryId}&repo=${body.repo}`,
  );

  return data;
};
