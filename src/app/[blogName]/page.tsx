'use client';

import { useGetSidebarQuery } from '@/api/blog-api';
import { useGetReadMeQuery, useGetBlogIdQuery } from '@/api/readme-api';
import Button from '@/components/Button/Button';
import DragAndDrop from '@/components/DND/DragAndDrop';
import FootPrintAnimation from '@/components/FootPrint/FootPrintAnimation';
import { ISidebarContent } from '@/types/dto';
import { Stack } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TokenType } from '@/types/common';

const Home = ({ params }: { params: { blogName: string } }) => {
  const [writeList, setWriteList] = useState<ISidebarContent[]>();
  const [token, setToken] = useState<TokenType>(null);
  const { data: blogIdData } = useGetBlogIdQuery({ params: { blogUrl: params.blogName }, token });
  const { data: sidebarData } = useGetSidebarQuery({ params: { blogId: blogIdData }, token });
  const { data: readMeData } = useGetReadMeQuery({ params: { blogId: blogIdData }, token });
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
              {readMe?.isMe && (
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
              width="100%"
              margin="auto"
              minHeight="80vh"
              overflow={'overlay'}>
              <MDEditor.Markdown source={readMe?.content} />
            </Stack>
          </Stack>
        }
      />
      <FootPrintAnimation blogId={blogIdData} />
    </Stack>
  );
};

export default Home;
