import { IIntroduceParams } from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

//유저 정보 가져오기
export const getIntroducedApi = async ({
  params,
  token,
}: {
  params: IIntroduceParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/introduce', { params });

  return data;
};

export const useGetIntroduceQuery = ({
  params,
  token,
}: {
  params: IIntroduceParams;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    ['friend', params, token],
    () => getIntroducedApi({ params, token }),
    { enabled: !!params.userId && !!token },
  );
  return { data, isLoading, error };
};
