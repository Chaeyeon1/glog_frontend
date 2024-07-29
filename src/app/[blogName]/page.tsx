'use client';

import { useGetSidebarQuery } from '@/api/blog-api';
import { useGetReadMeQuery, useGetBlogIdQuery } from '@/api/readme-api';
import Button from '@/components/Button/Button';
import DragAndDrop from '@/components/DND/DragAndDrop';
import FootPrintAnimation from '@/components/FootPrint/FootPrintAnimation';
import { ISidebarContent } from '@/types/dto';
import { Stack, Typography } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TokenType } from '@/types/common';
import Progress from '@/components/Progress/Progress';

const Home = ({ params }: { params: { blogName: string } }) => {
  const [writeList, setWriteList] = useState<ISidebarContent[]>();
  const [token, setToken] = useState<TokenType>(null);
  const { data: blogIdData } = useGetBlogIdQuery({ params: { blogUrl: params.blogName }, token });
  const { data: sidebarData } = useGetSidebarQuery({ params: { blogId: blogIdData }, token });
  const { data: readMeData, isLoading } = useGetReadMeQuery({
    params: { blogId: blogIdData },
    token,
  });
  const [readMe, setReadMe] = useState<{
    blogName: string;
    content: string;
    isMe: boolean;
  }>();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    setWriteList(sidebarData?.sidebarDtos);
    setReadMe(readMeData);
  }, [sidebarData, readMeData]);

  return (
    <Stack mt={3} height={'fit-content'}>
      <DragAndDrop
        blogName={params.blogName}
        footprintList={writeList}
        isMe={sidebarData?.isMyPage}
        rightContainer={
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack sx={{ fontSize: '24px' }}>{readMe?.blogName}</Stack>
              {readMe?.isMe && readMe?.content && (
                <Button
                  onClick={() => router.push(`/write/readme/${params.blogName}`)}
                  sx={{ width: 'fit-content' }}
                  variant="contained">
                  수정
                </Button>
              )}
            </Stack>
            <Stack
              boxShadow="2px 2px 5px rgba(0, 0, 0, 0.1)"
              p={8}
              borderRadius={2}
              bgcolor="#fafafa"
              width="100%"
              margin="auto"
              minHeight="80vh"
              overflow={'overlay'}>
              {readMe?.isMe && readMe?.content ? (
                <MDEditor.Markdown key={String(isLoading)} source={readMe?.content} />
              ) : isLoading ? (
                <Progress />
              ) : (
                <Stack spacing={4} justifyContent="center" alignItems="center" height="100%">
                  <Typography>등록된 Readme가 존재하지 않습니다.</Typography>
                  {readMe?.isMe && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => router.push(`/히write/readme/${params.blogName}`)}>
                      Readme 추가
                    </Button>
                  )}
                </Stack>
              )}
            </Stack>
          </Stack>
        }
      />
      <FootPrintAnimation blogId={blogIdData} />
    </Stack>
  );
};

export default Home;
