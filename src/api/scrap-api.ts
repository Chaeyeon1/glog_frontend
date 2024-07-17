import { IScrap } from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

// 스크랩 얻어오기
const GetScrapApi = async ({ params, token }: { params: IScrap; token: TokenType }) => {
  const { data } = await defaultInstance(token).get('/scrap', {
    params,
  });

  return data;
};

export const useGetScrapQuery = ({ params, token }: { params: IScrap; token: TokenType }) => {
  const { isLoading, error, data } = useQuery(
    [`scrap`, params, token],
    () => GetScrapApi({ params, token }),
    { enabled: !!params.page && !!token },
  );
  return { data, isLoading, error };
};
