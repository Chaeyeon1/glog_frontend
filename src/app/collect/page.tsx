'use client';

import React, { useEffect, useState } from 'react';
import { ImageList, MenuItem } from '@mui/material';
import { ViewType } from './_related/types';
import CollectPost from './CollectPost';
import { useGetCollectDataQuery } from '@/api/collect-api';
import { useInView } from 'react-intersection-observer';
import { SearchContainer, SearchSelect } from './_related/collect.style';

function Collect() {
  const [ref, inView] = useInView({ threshold: 0, delay: 0 });
  const [searchType, setSearchType] = useState<ViewType>('likes');
  const {
    data: collectData,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetCollectDataQuery({ searchType });
  const [kindArray, setKindArray] = useState(collectData);

  const viewMenuItemList: { value: ViewType; label: string }[] = [
    { value: 'likes', label: '좋아요순' },
    { value: 'recent', label: '최신순' },
    { value: 'views', label: '조회수순' },
  ];
  const menuItemList = viewMenuItemList;

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  useEffect(() => {
    setKindArray(collectData);
  }, [collectData]);

  return (
    <>
      <SearchContainer>
        <SearchSelect size="small" variant="outlined" value={searchType}>
          {menuItemList.map((item) => (
            <MenuItem key={item.value} value={item.value} onClick={() => setSearchType(item.value)}>
              {item.label}
            </MenuItem>
          ))}
        </SearchSelect>
      </SearchContainer>
      <ImageList variant="masonry" cols={4} gap={4}>
        {kindArray?.map((item) => {
          return <CollectPost item={item} key={item.postId} />;
        })}
        <div ref={ref} />
      </ImageList>
    </>
  );
}

export default Collect;
