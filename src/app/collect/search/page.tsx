'use client';

import React, { useEffect, useState } from 'react';
import { ImageList, MenuItem } from '@mui/material';
import { useDebounceValue } from 'usehooks-ts';
import { SearchType } from '../_related/types';
import CollectPost from '../CollectPost';
import { useGetCollectSearchQuery } from '@/api/collect-api';
import { SearchContainer, SearchSelect, SearchTextField } from '../_related/collect.style';

function Search() {
  const [searchType, setSearchType] = useState<SearchType>('title');
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedValue] = useDebounceValue(searchText, 500);
  const { data: searchData } = useGetCollectSearchQuery({
    params: { type: searchType, value: debouncedValue ?? '' },
  });
  const [kindArray, setKindArray] = useState(searchData);

  const searchMenuItemList: { value: SearchType; label: string }[] = [
    { value: 'title', label: '제목' },
    { value: 'user', label: '작성자' },
    { value: 'hashtag', label: '해시태그' },
    { value: 'content', label: '글 내용' },
  ];
  const menuItemList = searchMenuItemList;

  useEffect(() => {
    setKindArray(searchData);
  }, [searchData]);

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
        <SearchTextField
          size="small"
          placeholder="검색어를 입력해주세요"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </SearchContainer>
      <ImageList variant="masonry" cols={4} gap={4}>
        {(kindArray?.postPreviewDtos ?? [])?.map((item) => {
          return <CollectPost item={item} key={item.postId} />;
        })}
      </ImageList>
    </>
  );
}

export default Search;
