import { useQuery } from '@tanstack/react-query';
import { defaultInstance } from '.';
import { IDeleteGuestbook, IGuestbookParams, IPostGuestbook, IPutGuestbook } from '@/types/dto';
import { TokenType } from '@/types/common';

//방명록 메시지 불러오기
export const GetGuestbookApi = async ({
  token,
  params,
}: {
  params: IGuestbookParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/guestbook', { params });

  return data;
};

export const useGetGuestbookQuery = ({
  token,
  params,
}: {
  params: IGuestbookParams;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    ['guestbook', params, token],
    () => GetGuestbookApi({ params, token }),
    { enabled: !!params.blogId && !!token },
  );

  return { isLoading, error, data };
};

//방명록 작성
export const PostGuestbookApi = async ({
  token,
  body,
}: {
  body: IPostGuestbook;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post('/guestbook', body);
  return data;
};

//방명록 수정
export const PutGuestbookApi = async ({
  token,
  body,
}: {
  body: IPutGuestbook;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).put('/guestbook', body);
  return data;
};

//방명록 삭제
export const DeleteGuestbookApi = async ({
  token,
  params,
}: {
  params: IDeleteGuestbook;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).delete('/guestbook', {
    params,
  });
  return data;
};
