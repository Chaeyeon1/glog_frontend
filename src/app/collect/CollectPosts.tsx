import { ImageList } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CollectPost from './CollectPost';
import { useInView } from 'react-intersection-observer';
import { useGetCollectDataQuery, useGetCollectSearchQuery } from '@/api/collect-api';
import { ICollectPost } from '@/types/dto';
import { CollectFilter } from './_related/types';

const CollectPosts = ({
  searchType,
  searchText,
}: {
  searchType: CollectFilter;
  searchText?: string;
}) => {
  const {
    data: collectData,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetCollectDataQuery({ searchType, searchText });
  const { data: searchData } = useGetCollectSearchQuery({
    params: { type: searchType, value: searchText ?? '' },
  });
  const [ref, inView] = useInView({ threshold: 0, delay: 0 });
  const [kindArray, setKindArray] = useState<ICollectPost[]>(collectData);

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (['likes', 'views', 'recent'].includes(searchType)) {
      setKindArray(collectData);
    }
  }, [collectData, searchType]);

  useEffect(() => {
    if (['user', 'title', 'hashtag', 'content'].includes(searchType)) {
      setKindArray(searchData);
    }
  }, [searchData, searchType]);

  return (
    <ImageList variant="masonry" cols={4} gap={4}>
      {kindArray?.map((item) => {
        return <CollectPost item={item} key={item.postId} />;
      })}
      <div ref={ref} />
    </ImageList>
  );
};

export default CollectPosts;
