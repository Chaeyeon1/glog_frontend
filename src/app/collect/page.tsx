'use client';

import {
  MenuItem,
  outlinedInputClasses,
  Select,
  Stack,
  svgIconClasses,
  TextField,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useIsSearchSSR } from '../../../hooks/useRecoilSSR';
import CollectPosts from './CollectPosts';
import { CollectFilter } from './_related/types';
import { useDebounceValue } from 'usehooks-ts';

function Collect() {
  const [isSearch] = useIsSearchSSR();
  const [searchType, setSearchType] = useState<CollectFilter>('user');
  const theme = useTheme();
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedValue] = useDebounceValue(searchText, 500);

  const viewMenuItemList = [
    { value: 'likes', label: '좋아요순' },
    { value: 'recent', label: '최신순' },
    { value: 'views', label: '조회수순' },
  ];

  const searchMenuItemList = [
    { value: 'title', label: '제목' },
    { value: 'user', label: '작성자' },
    { value: 'hashtag', label: '해시태그' },
    { value: 'content', label: '글 내용' },
  ];
  const menuItemList = isSearch ? searchMenuItemList : viewMenuItemList;

  useEffect(() => {
    setSearchType(isSearch ? 'title' : 'recent');
    setSearchText('');
  }, [isSearch]);

  return (
    <>
      <Stack
        width="100%"
        textAlign="center"
        bgcolor="primary.main"
        color="#fff"
        fontWeight={500}
        fontSize="80px"
        py={2}>
        GLOG
      </Stack>
      <Stack margin="32px auto" width="80%">
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
              <MenuItem
                key={item.value}
                value={item.value}
                onClick={() => setSearchType(item.value as CollectFilter)}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          {isSearch && (
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
          )}
        </Stack>
        <CollectPosts searchType={searchType} searchText={debouncedValue} />
      </Stack>
    </>
  );
}

export default Collect;
