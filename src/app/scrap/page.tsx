'use client';

import React, { useEffect } from 'react';
import { useState } from 'react';
import { ScrapList } from './scrap.style';
import CenterContent from '@/components/Layout/CenterContent';
import { useGetScrapQuery } from '@/api/scrap-api';
import { IScrapContent } from '@/types/dto';
import { TokenType } from '@/types/common';
import { ImageList } from '@mui/material';
import CollectPost from '../collect/CollectPost';
import Progress from '@/components/Progress/Progress';

export default function Scrap() {
  const [token, setToken] = useState<TokenType>(null);
  const { data } = useGetScrapQuery({ params: { page: 0 }, token });
  const [result, setResult] = useState<IScrapContent[]>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    setResult(data?.postPreviewDtos);
  }, [data]);

  return (
    <CenterContent maxWidth={'1440px'}>
      <ScrapList>스크랩한 게시글</ScrapList>
      <ImageList variant="masonry" cols={4} gap={4}>
        {result?.map((item) => {
          return <CollectPost item={item} key={item.postId} />;
        }) ?? <Progress />}
      </ImageList>
    </CenterContent>
  );
}
