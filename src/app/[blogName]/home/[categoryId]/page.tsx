'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import CenterContent from '@/components/Layout/CenterContent';
import { useGetSidebarQuery } from '@/api/blog-api';
import { SidebarPostType } from '@/types/dto';
import DragAndDrop from '@/components/DND/DragAndDrop';
import { ImageList, Stack, Typography } from '@mui/material';
import { useGetBlogIdQuery } from '@/api/readme-api';
import { useGetSearchCategoryQuery } from '@/api/category-api';
import { TokenType } from '@/types/common';
import Progress from '@/components/Progress/Progress';
import CollectPost from '@/components/Post/CollectPost';

function page({ params }: { params: { blogName: string; categoryId: string } }) {
  const [token, setToken] = useState<TokenType>(null);
  const [, setBlogId] = useState();
  const { data: blogIdData } = useGetBlogIdQuery({ params: { blogUrl: params.blogName }, token });
  const { data: sidebarData } = useGetSidebarQuery({ params: { blogId: blogIdData }, token });
  const [writeList, setWriteList] = useState<SidebarPostType[]>();
  const { data: searchCategoryData } = useGetSearchCategoryQuery({
    params: { categoryId: Number(params.categoryId), page: 0 },
    token,
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    setBlogId(blogIdData);
    setWriteList(sidebarData?.sidebarDtos);
  }, [blogIdData, searchCategoryData, sidebarData]);

  const currentCategory = sidebarData?.sidebarDtos?.find(
    (sidebar) => sidebar.categoryId === Number(params.categoryId),
  );
  const currentCategoryName = currentCategory?.categoryName;

  return (
    <CenterContent maxWidth={'2000px'}>
      <DragAndDrop
        blogName={params.blogName}
        footprintList={writeList}
        isMe={sidebarData?.isMyPage}
        rightContainer={
          <Stack width="100%" spacing={5}>
            <Typography variant="h6" fontWeight={700}>
              {currentCategoryName}
            </Typography>
            <ImageList variant="masonry" cols={4} gap={4}>
              {currentCategory?.postTitleDtos?.map((item) => {
                return <CollectPost item={item} key={item.postId} />;
              }) ?? <Progress />}
            </ImageList>
          </Stack>
        }
      />
    </CenterContent>
  );
}

export default page;
