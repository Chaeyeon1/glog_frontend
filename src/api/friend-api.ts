import {
  IDeleteFriend,
  IFriendAllow,
  IFriendReadParams,
  IFriendRequest,
  IFriendSearchParams,
  IFriendsParams,
} from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

//친구 정보 불러오기
export const GetFriendApi = async ({
  params,
  token,
}: {
  params: IFriendsParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get(`/friend/${params.kind}`);

  return data;
};

export const useGetFriendQuery = ({
  params,
  token,
}: {
  params: IFriendsParams;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    ['friend', params, token],
    () => GetFriendApi({ params, token }),
    { enabled: !!params.kind && !!token },
  );
  return { data, isLoading, error };
};

//친구 검색
export const GetFriendSearchApi = async ({
  params,
  token,
}: {
  params: IFriendSearchParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/search/friend/name', { params });

  return data;
};

export const useGetFriendSearchQuery = ({
  params,
  token,
}: {
  params: IFriendSearchParams;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    ['search', params, token],
    () => GetFriendSearchApi({ params, token }),
    { enabled: !!params.name && !!token },
  );

  return { isLoading, error, data };
};

//친구 요청
export const PutFriendRequestApi = async ({
  body,
  token,
}: {
  body: IFriendRequest;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).put(`/friend?userId=${body.userId}`, body);

  return data;
};

//친구 요청 수락/거절
export const PutFriendAllowApi = async ({
  body,
  token,
}: {
  body: IFriendAllow;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).put(
    `/friend/allow?isAccept=${body.isAccept}&userId=${body.userId}`,
    body,
  );

  return data;
};

//친구 삭제
export const DeleteFriendApi = async ({
  params,
  token,
}: {
  params: IDeleteFriend;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).delete('/friend', {
    params,
  });

  return data;
};

//새 포스트 읽음 유무
export const GetFriendReadApi = async ({
  params,
  token,
}: {
  params: IFriendReadParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/friend/read', { params });

  return data;
};

export const useGetFriendReadQuery = ({
  params,
  token,
}: {
  params: IFriendReadParams;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    ['friendRead', params, token],
    () => GetFriendReadApi({ params, token }),
    { enabled: !!params.userId && !!token },
  );
  return { data, isLoading, error };
};
