import { useMutation, useQuery } from '@tanstack/react-query';
import { defaultInstance } from '.';
import { IRemovePostParams, ITemplateDetailParams, ITemporaryDetailParams } from '@/types/dto';
import { TokenType } from '@/types/common';
import { apiClient } from '@/util/ApiClient';
import { UploadImagePayload } from '@/types/data-contracts';

export const PostWriteApi = async ({ body, token }: { body: FormData; token: TokenType }) => {
  const { data } = await defaultInstance(token).post('/post', body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const UpdateWriteApi = async ({ body, token }: { body: FormData; token: TokenType }) => {
  const { data } = await defaultInstance(token).put('/post', body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const AddLikeApi = async ({
  params,
  token,
}: {
  params: { postId: number };
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).patch(`/post/like?postId=${params?.postId}`);

  return data;
};

export const DeleteWriteApi = async ({
  params,
  token,
}: {
  params: IRemovePostParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).delete('/post', { params });

  return data;
};

const GetTemplateApi = async ({ token }: { token: TokenType }) => {
  const { data } = await defaultInstance(token).get(`/template`);

  return data;
};

export const useGetTemplateQuery = ({ token }: { token: TokenType }) => {
  const { isLoading, error, data } = useQuery(
    [`template`, token],
    () => GetTemplateApi({ token }),
    { enabled: !!token },
  );
  return { data, isLoading, error };
};

const PostImage = async ({ body }: { body: UploadImagePayload }) => {
  const response = await apiClient.uploadImage(body);
  return response.data;
};

export function usePostImage() {
  const mutation = useMutation({
    mutationFn: PostImage,
  });

  return mutation;
}

const getTemplateDetailApi = async ({
  params,
  token,
}: {
  params: ITemplateDetailParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get(`/template/detail`, { params });

  return data;
};

export const useGetTemplateDetailQuery = ({
  params,
  token,
}: {
  params: ITemplateDetailParams;
  token: TokenType;
}) => {
  const { isLoading, error, data, refetch } = useQuery(
    [`templateDetail`],
    () => getTemplateDetailApi({ params, token }),
    {
      enabled: false,
    },
  );
  return { data, isLoading, error, refetch };
};

export const DeleteTemplateApi = async ({
  params,
  token,
}: {
  params: ITemplateDetailParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).delete('/template', {
    params,
  });

  return data;
};

export const PostTemplateApi = async ({
  postData,
  token,
}: {
  postData: FormData;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post('/template', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

const GetTemporaryApi = async ({ token }: { token: TokenType }) => {
  const { data } = await defaultInstance(token).get(`/temporaries`);

  return data;
};

export const useGetTemporaryQuery = ({ token }: { token: TokenType }) => {
  const { isLoading, error, data } = useQuery(
    [`temporaries`, token],
    () => GetTemporaryApi({ token }),
    { enabled: !!token },
  );
  return { data, isLoading, error };
};

export const PostTemporaryApi = async ({
  postData,
  token,
}: {
  postData: FormData;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).post('/temporary', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

const GetTemporaryDetailApi = async ({
  params,
  token,
}: {
  params: ITemporaryDetailParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).get(`/temporary/detail`, { params });

  return data;
};

export const useGetTemporaryDetailQuery = ({
  params,
  token,
}: {
  params: ITemporaryDetailParams;
  token: TokenType;
}) => {
  const { isLoading, error, data, refetch } = useQuery(
    [`temporaryDetail`, token],
    () => GetTemporaryDetailApi({ params, token }),
    {
      enabled: false,
    },
  );
  return { data, isLoading, error, refetch };
};

export const DeleteTemporaryApi = async ({
  params,
  token,
}: {
  params: ITemporaryDetailParams;
  token: TokenType;
}) => {
  const { data } = await defaultInstance(token).delete('/temporary', {
    params,
  });

  return data;
};
