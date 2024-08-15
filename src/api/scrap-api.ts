import { IScrap } from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

// 스크랩 얻어오기
const getScrapApi = async ({ params, token }: { params: IScrap; token: TokenType }) => {
  const { data } = await defaultInstance(token).get('/scrap', {
    params,
  });

  return data;
};

export const useGetScrapQuery = ({ params, token }: { params: IScrap; token: TokenType }) => {
  const { isLoading, error, data } = useQuery(
    [`scrap`, params, token],
    () => getScrapApi({ params, token }),
    { enabled: typeof params.page === 'number' && !!token },
  );
  return { data, isLoading, error };
};

export const addScrapApi = async ({
  params,
  token,
}: {
  params: { postId: number };
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).patch(`/scrap?postId=${params?.postId}`);

  return data;
};
