import {
  ICollect,
  ICollectPost,
  ISearch,
  ISearchContent,
  ISearchHashtag,
  ISearchTitle,
  ISearchUser,
} from '@/types/dto';
import { defaultInstance } from '.';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';
import { useMemo } from 'react';

const getCollectDataApi = async ({ params }: { params: ICollect }) => {
  const { data } = await defaultInstance().get(`/post/previews/${params.kind}?page=${params.page}`);

  return data;
};

export const useGetCollectDataQuery = () => {
  // const {
  //   isLoading,
  //   error,
  //   data: queryData,

  // } = useQuery([`collectData`, params, token], () => getCollectDataApi({ params, token }), {
  //   enabled: !!params.kind && !!params.page,
  // });

  const {
    data: queryData,
    fetchNextPage: getNextPage,
    isSuccess: getDataIsSuccess,
    hasNextPage: getNextPageIsPossible,
  } = useInfiniteQuery(
    // ['collectData'],
    // ({ pageParam = 1 }) => getCollectDataApi({ params: { kind: 'likes', page: pageParam } }),
    // {
    //   getNextPageParam: (lastPage) => {
    //     if (!lastPage.isLast) return lastPage.current_page + 1;
    //     return undefined;
    //   },
    // },
    {
      queryKey: ['collectData'],
      queryFn: ({ pageParam = 1 }) =>
        getCollectDataApi({ params: { kind: 'likes', page: pageParam } }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    },
  );

  const newData: ICollectPost[] = useMemo(
    () => (queryData ? queryData.pages.flatMap(({ postPreviewDtos }) => postPreviewDtos) : []),
    [queryData],
  );
  return { data: newData, getNextPage, getDataIsSuccess, getNextPageIsPossible };
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
