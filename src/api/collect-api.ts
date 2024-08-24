import {
  ICollect,
  ICollectContent,
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
import { CollectFilter } from '@/app/collect/_related/types';
import { PostPreviewDtos } from '@/types/data-contracts';

const getCollectDataApi = async ({ params }: { params: ICollect }) => {
  const { data } = await defaultInstance().get(`/post/previews/${params.kind}?page=${params.page}`);

  return data;
};

export const useGetCollectDataQuery = ({ searchType }: { searchType: CollectFilter }) => {
  const {
    data: queryData,
    fetchNextPage,
    isSuccess: getDataIsSuccess,
    hasNextPage,
    isFetching,
    // eslint-disable-next-line @typescript-eslint/ban-types
  } = useInfiniteQuery<ICollectContent, Object>({
    queryKey: ['collectData', searchType],
    queryFn: ({ pageParam = 1 }) =>
      getCollectDataApi({ params: { kind: searchType, page: pageParam } }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.postPreviewDtos.length === 0 ? undefined : nextPage;
    },
  });

  const newData: ICollectPost[] = useMemo(
    () => (queryData ? queryData.pages.flatMap(({ postPreviewDtos }) => postPreviewDtos) : []),
    [queryData],
  );
  return { data: newData, fetchNextPage, getDataIsSuccess, hasNextPage, isFetching };
};

const getColletSearchApi = async ({ params }: { params: ISearch }) => {
  const { data } = await defaultInstance().get(`/search`, { params });

  return data;
};

export const useGetCollectSearchQuery = ({ params }: { params: ISearch }) => {
  const { data } = useQuery<PostPreviewDtos>(
    [`collectData`, params],
    () => getColletSearchApi({ params }),
    {
      enabled: !!params.type && !!params.value,
    },
  );
  return { data };
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
