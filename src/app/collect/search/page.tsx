'use client';

import {
  ImageList,
  MenuItem,
  outlinedInputClasses,
  Select,
  Stack,
  svgIconClasses,
  TextField,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useDebounceValue } from 'usehooks-ts';
import { SearchType } from '../_related/types';
import CollectPost from '../CollectPost';
import { useGetCollectSearchQuery } from '@/api/collect-api';

function Search() {
  const theme = useTheme();
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
      <Stack direction="row" spacing={2} borderBottom={`2px solid ${theme.palette.primary.main}`}>
        <Select
          size="small"
          variant="outlined"
          sx={{
            color: 'primary.main',
            [`&.${outlinedInputClasses.root}`]: {
              [`& .${outlinedInputClasses.notchedOutline}`]: { border: '1px solid transparent' },
            },
            [`& .${svgIconClasses.root}`]: { fill: theme.palette.primary.main },
            width: '120px',
          }}
          value={searchType}>
          {menuItemList.map((item) => (
            <MenuItem key={item.value} value={item.value} onClick={() => setSearchType(item.value)}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        <TextField
          size="small"
          placeholder="검색어를 입력해주세요"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          sx={{
            width: '50%',
            [`&& .${outlinedInputClasses.root}`]: {
              [`& .${outlinedInputClasses.notchedOutline}`]: {
                border: '1px solid transparent',
              },
            },
            ':hover': {
              [`&.${outlinedInputClasses.notchedOutline}`]: {
                border: '1px solid transparent',
              },
            },
            [`& .${svgIconClasses.root}`]: { fill: theme.palette.primary.main },
          }}
        />
      </Stack>
      <ImageList variant="masonry" cols={4} gap={4}>
        {(kindArray?.postPreviewDtos ?? [])?.map((item) => {
          return <CollectPost item={item} key={item.postId} />;
        })}
      </ImageList>
    </>
  );
}

export default Search;
