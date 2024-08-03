'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { PostPagination } from './category.style';
import CenterContent from '@/components/Layout/CenterContent';
import { useGetSidebarQuery } from '@/api/blog-api';
import { ISearchCategory, SidebarPostType } from '@/types/dto';
import DragAndDrop from '@/components/DND/DragAndDrop';
import { ImageList, Stack, Typography } from '@mui/material';
import { useGetBlogIdQuery } from '@/api/readme-api';
import { useGetSearchCategoryQuery } from '@/api/category-api';
import { TokenType } from '@/types/common';
import CollectPost from '@/app/collect/CollectPost';
import Progress from '@/components/Progress/Progress';

function page({ params }: { params: { blogName: string; categoryId: string } }) {
  const [page, setPage] = useState(0);
  const [token, setToken] = useState<TokenType>(null);
  const [, setBlogId] = useState();
  const { data: blogIdData } = useGetBlogIdQuery({ params: { blogUrl: params.blogName }, token });
  const { data: sidebarData } = useGetSidebarQuery({ params: { blogId: blogIdData }, token });
  const [writeList, setWriteList] = useState<SidebarPostType[]>();
  const { data: searchCategoryData } = useGetSearchCategoryQuery({
    params: { categoryId: Number(params.categoryId), page },
    token,
  });
  const [searchCategory, setSearchCategory] = useState<ISearchCategory>();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    setBlogId(blogIdData);
    setSearchCategory(searchCategoryData);
    setWriteList(sidebarData?.sidebarDtos);
  }, [blogIdData, searchCategoryData, sidebarData]);

  const totalPages = searchCategory?.totalPages;
  const currentCategoryName = sidebarData?.sidebarDtos?.find(
    (sidebar) => sidebar.categoryId === Number(params.categoryId),
  )?.categoryName;

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
              {searchCategory?.postPreviewDtos?.map((item) => {
                return <CollectPost item={item} key={item.postId} />;
              }) ?? <Progress />}
            </ImageList>
            <PostPagination
              count={totalPages}
              page={page + 1}
              onChange={(_, newPage) => {
                setPage(newPage - 1);
              }}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        }
      />
    </CenterContent>
  );
}

export default page;
