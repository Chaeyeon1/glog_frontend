'use client';

import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useUserThemeSSR } from '../../../../../hooks/useRecoilSSR';
import Button from '@/components/Button/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PutReadMeApi, useGetReadMeQuery, useGetBlogIdQuery } from '@/api/readme-api';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { TokenType } from '@/types/common';

const ReadMe = ({ params }: { params: { blogName: string } }) => {
  const [userTheme] = useUserThemeSSR();
  const [content, setContent] = useState<string | undefined>('');
  const queryClient = useQueryClient();
  const router = useRouter();
  const [token, setToken] = useState<TokenType>(null);
  const { data: blogIdData } = useGetBlogIdQuery({ params: { blogUrl: params.blogName }, token });
  const { data: readMeData } = useGetReadMeQuery({ params: { blogId: blogIdData }, token });

  const putReadmeQuery = useMutation(PutReadMeApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['readMe']);
      router.push(`/${params.blogName}`);
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
    queryClient.invalidateQueries(['userDetail']);
  }, []);

  useEffect(() => {
    setContent(readMeData?.content);
  }, [readMeData]);

  const readmeSaveOnClick = () => {
    const newReadMeBody = {
      readme: content,
    };

    putReadmeQuery.mutateAsync(
      { body: newReadMeBody, token },
      {
        onSuccess: () =>
          enqueueSnackbar({ message: '리드미 생성에 성공하였습니다.', variant: 'success' }),
        onError: () =>
          enqueueSnackbar({ message: '리드미 생성에 실패하였습니다.', variant: 'error' }),
      },
    );
  };

  return (
    <Stack mt={10} spacing={4} data-color-mode={userTheme}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack fontSize="18px" fontWeight="bold">
          README
        </Stack>
        <Button onClick={readmeSaveOnClick} sx={{ width: 'fit-content' }} variant="contained">
          저장
        </Button>
      </Stack>
      <MDEditor height="80vh" value={content} onChange={setContent} />
    </Stack>
  );
};

export default ReadMe;
