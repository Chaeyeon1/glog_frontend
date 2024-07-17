import { IBlog, IBlogUrlParams, IChangeBlogName, IPost, ISidebar } from '@/types/dto';
import { defaultInstance } from '.';
import { useQuery } from '@tanstack/react-query';
import { TokenType } from '@/types/common';

// 초기 블로그 생성
export const PostBlogApi = async ({ body, token }: { body: IBlog; token: TokenType }) => {
  const { data } = await defaultInstance(token).post('/blog', body);

  return data;
};

// 게시글 조회
export const getPostApi = async ({ params, token }: { params: IPost; token: TokenType }) => {
  const { data } = await defaultInstance(token).get('/post', { params });

  return data;
};

export const useGetPostQuery = ({ token, params }: { token: TokenType; params: IPost }) => {
  const { isLoading, error, data } = useQuery(
    [`post`, params, token],
    () => getPostApi({ params, token }),
    { enabled: !!params.postId },
  );
  return { data, isLoading, error };
};

export const getAlarmsApi = async ({ token }: { token: TokenType }) => {
  const { data } = await defaultInstance(token).get('/alarms');

  return data;
};

export const useGetAlarmsQuery = ({ token, open }: { token: TokenType; open?: boolean }) => {
  const { isLoading, error, data } = useQuery(
    [`alarms`, token, open],
    () => getAlarmsApi({ token: token }),
    { enabled: !!token && open },
  );

  return { data, isLoading, error };
};

// 블로그 이름 변경
export const PostChangeBlogNameApi = async ({
  body,
  token,
}: {
  body: IChangeBlogName;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post('/change/blog/name', body);

  return data;
};

// 사이드바 얻어오기
const getSidebarApi = async ({ params, token }: { params: ISidebar; token: TokenType }) => {
  const { data } = await defaultInstance(token).get(`/category/sidebar/${params.blogId}`, {
    params,
  });

  return data;
};

export const useGetSidebarQuery = ({ params, token }: { params: ISidebar; token: TokenType }) => {
  const { isLoading, error, data } = useQuery(
    [`sidebar`, params, token],
    () => getSidebarApi({ params, token }),
    {
      enabled: !!params.blogId,
    },
  );
  return { data, isLoading, error };
};

export const getIsNewBlogApi = async (token: TokenType) => {
  const { data } = await defaultInstance(token).get('/is/new/blog');

  return data;
};

export const useGetIsNewBlogQuery = (token: TokenType) => {
  const { isLoading, error, data } = useQuery([`isNewBlog`, token], () => getIsNewBlogApi(token), {
    enabled: !!token,
  });
  return { data, isLoading, error };
};

// 카테고리 아이디로 블로그url 불러오기
export const getBlogUrl = async ({
  params,
  token,
}: {
  params: IBlogUrlParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get('/blog/url', { params });
  return data;
};

export const useGetBlogUrlQuery = ({
  params,
  token,
}: {
  params: IBlogUrlParams;
  token: TokenType;
}) => {
  const { isLoading, error, data } = useQuery(
    [`blogUrl`, params, token],
    () => getBlogUrl({ params, token }),
    { enabled: !!token },
  );
  return { data, isLoading, error };
};
