import {
  ICategoryParams,
  IDeleteCategory,
  IPostCategory,
  IPutCategory,
  ISearchCategoryParams,
} from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

//카테고리 이름/pr연동여부 가져오기
export const GetCategoryApi = async ({
  params,
  token,
}: {
  params: ICategoryParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/category', { params });

  return data;
};

export const useGetCategoryQuery = ({
  params,
  token,
}: {
  params: ICategoryParams;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    ['category', params, token],
    () => GetCategoryApi({ params, token }),
    { enabled: !!params.categoryId && !!token },
  );

  return { isLoading, error, data };
};

//카테고리 생성
export const PostCategoryApi = async ({
  body,
  token,
}: {
  body: IPostCategory;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post('/category', body);
  return data;
};

//카테고리 이름 수정
export const PutCategoryApi = async ({ body, token }: { body: IPutCategory; token: TokenType }) => {
  const { data } = await defaultInstance(token).put('/category', body);
  return data;
};

//카테고리 삭제
export const DeleteCategoryApi = async ({
  params,
  token,
}: {
  params: IDeleteCategory;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).delete('/category', {
    params,
  });
  return data;
};

//카테고리별 미리보기
export const GetSearchCategoryApi = async ({
  params,
  token,
}: {
  params: ISearchCategoryParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/search/category', { params });

  return data;
};

export const useGetSearchCategoryQuery = ({
  params,
  token,
}: {
  params: ISearchCategoryParams;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    ['searchCategory', params, token],
    () => GetSearchCategoryApi({ params, token }),
    { enabled: !!params.categoryId && !!params.page && !!token },
  );

  return { isLoading, error, data };
};
