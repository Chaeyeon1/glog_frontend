'use client';

import { ImageList, MenuItem, Select, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Search, Star } from '@mui/icons-material';
import { useIsSearchSSR } from '../../../hooks/useRecoilSSR';
import { useGetCollectDataQuery, useGetCollectSearchQuery } from '@/api/collect-api';
import { ICollectPost } from '@/types/dto';
import PostComponent from '@/components/Post/Post';
import { PostAreaComponent } from '../scrap/scrap.style';
import { TokenType } from '@/types/common';
import { useInView } from 'react-intersection-observer';
import CollectPost from './CollectPost';

function Collect() {
  const [isSearch] = useIsSearchSSR();
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<'user' | 'title' | 'hashtag' | 'content'>('user');
  const [token, setToken] = useState<TokenType>(null);
  const {
    data: collectData,
    getDataIsSuccess,
    getNextPage,
    getNextPageIsPossible,
  } = useGetCollectDataQuery();
  const [kindArray, setKindArray] = useState<ICollectPost[]>(collectData);
  const { data } = useGetCollectSearchQuery({
    params: { type: searchType, value: searchText },
    token,
  });
  const [ref, inView] = useInView();

  useEffect(() => {
    // 스크롤 맨 밑에 도달했을 때 데이터를 가져옴
    if (inView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [inView, collectData]);

  useEffect(() => {
    setKindArray(collectData);
  }, [collectData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  return (
    <>
      <Stack
        width="100%"
        textAlign="center"
        color="#fff"
        fontWeight={700}
        fontSize="40px"
        py={2}
        bgcolor="primary.main">
        GLOG
      </Stack>
      <Stack margin="32px auto" width="80%">
        {!isSearch ? (
          getDataIsSuccess && (
            <ImageList variant="masonry" cols={4} gap={4}>
              {kindArray?.map((item) => {
                return <CollectPost item={item} key={item.postId} />;
              })}
              <div ref={ref} />
            </ImageList>
          )
        ) : (
          <Stack direction="row" spacing={4} justifyContent="center">
            <Select value={searchType}>
              <MenuItem value="user" onClick={() => setSearchType('user')}>
                작성자
              </MenuItem>
              <MenuItem value="title" onClick={() => setSearchType('title')}>
                제목
              </MenuItem>
              <MenuItem value="hashtag" onClick={() => setSearchType('hashtag')}>
                해시태그
              </MenuItem>
              <MenuItem value="content" onClick={() => setSearchType('content')}>
                글 내용
              </MenuItem>
            </Select>
            <TextField
              placeholder="검색어를 입력해주세요"
              InputProps={{
                startAdornment: <Search sx={{ marginRight: '10px' }} />,
              }}
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              sx={{
                width: '50%',
              }}
            />
          </Stack>
        )}
        <PostAreaComponent style={{ marginTop: '16px' }}>
          {data?.postPreviewDtos?.map((user: ICollectPost) => {
            return (
              <PostComponent
                key={user.postId}
                thumbnail={user.thumbnail ?? ''}
                title={user.title}
                likesCount={user.likesCount}
                viewsCount={user.viewsCount}
                Icon={<Star fontSize="small" />}
                href={`/${user.blogUrl}/home/${user.categoryId}/${user.postId}`}
              />
            );
          })}
        </PostAreaComponent>
      </Stack>
    </>
  );
}

export default Collect;
