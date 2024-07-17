import {
  ICollect,
  ICollectContent,
  ISearch,
  ISearchContent,
  ISearchHashtag,
  ISearchTitle,
  ISearchUser,
} from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

const getCollectDataApi = async ({ token, params }: { params: ICollect; token: TokenType }) => {
  const { data } = await defaultInstance(token).get(
    `/post/previews/${params.kind}?page=${params.page}`,
  );

  return data;
};

export const useGetCollectDataQuery = ({
  params,
  token,
}: {
  params: ICollect;
  token: TokenType;
}) => {
  const {
    isLoading,
    error,
    data: queryData,
  } = useQuery([`collectData`, params, token], () => getCollectDataApi({ params, token }), {
    enabled: !!params.kind && !!params.page,
  });
  const data: ICollectContent = queryData;
  return { data, isLoading, error };
};

const getColletSearchApi = async ({ params, token }: { params: ISearch; token: TokenType }) => {
  const { data } = await defaultInstance(token).get(`/search`, { params });

  return data;
};

export const useGetCollectSearchQuery = ({
  params,
  token,
}: {
  params: ISearch;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    [`search`, params, token],
    () => getColletSearchApi({ params, token }),
    {
      enabled: !!params.value && !!params.type,
    },
  );
  return { data, isLoading, error };
};

const GetColletSearchUserApi = async ({
  params,
  token,
}: {
  params: ISearchUser;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get(`/search/user`, { params });

  return data;
};

export const useGetCollectSearchUserQuery = ({
  params,
  token,
}: {
  params: ISearchUser;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    [`searchUser`, params, token],
    () => GetColletSearchUserApi({ params, token }),
    { enabled: !!params.nickname && !!token },
  );
  return { data, isLoading, error };
};

const GetColletSearchTitleApi = async ({
  params,
  token,
}: {
  params: ISearchTitle;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get(`/search/title`, { params });

  return data;
};

export const useGetCollectSearchTitleQuery = ({
  params,
  token,
}: {
  params: ISearchTitle;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    [`searchTitle`, params, token],
    () => GetColletSearchTitleApi({ params, token }),
    { enabled: !!params.title && !!token },
  );
  return { data, isLoading, error };
};

const GetColletSearchHashtagApi = async ({
  params,
  token,
}: {
  params: ISearchHashtag;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get(`/search/hashtag`, { params });

  return data;
};

export const useGetCollectSearchHashtagQuery = ({
  params,
  token,
}: {
  params: ISearchHashtag;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    [`searchHashtag`, params, token],
    () => GetColletSearchHashtagApi({ params, token }),
    { enabled: !!params.hashtag && !!token },
  );
  return { data, isLoading, error };
};

const GetColletSearchContentApi = async ({
  params,
  token,
}: {
  params: ISearchContent;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get(`/search/content`, { params });

  return data;
};

export const useGetCollectSearchContentQuery = ({
  params,
  token,
}: {
  params: ISearchContent;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    [`searchContent`, params, token],
    () => GetColletSearchContentApi({ params, token }),
    { enabled: !!token },
  );
  return { data, isLoading, error };
};
