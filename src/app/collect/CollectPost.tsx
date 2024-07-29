import React, { useState } from 'react';
import { ICollectPost } from '@/types/dto';
import { ImageListItem, useTheme, Typography, Stack, useMediaQuery } from '@mui/material';
import { DEFAULT_IMAGE } from '@/constant/common';
import { useRouter } from 'next/navigation';

function CollectPost({ item }: { item: ICollectPost }) {
  const router = useRouter();
  const theme = useTheme();
  const {
    blogUrl,
    categoryId,
    postId,
    thumbnail,
    title,
    likesCount,
    viewsCount,
    repliesCount,
    createdAt,
  } = item;
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const isPhone = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ImageListItem
      onClick={() => router.push(`/${blogUrl}/home/${categoryId}/${postId}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        overflow: 'hidden',
        border: '1px solid #e2e2e2',
        borderRadius: '8px',
        cursor: 'pointer',
        position: 'relative',
        ':hover': {
          transform: 'translateY(-1px)',
          boxShadow: `0px 0px 5px 1px ${theme?.palette.shadowColor.dark}`,
          transition: 'all .35s ease-in-out',
        },
      }}
      key={item.postId}>
      <img
        srcSet={`${thumbnail ?? DEFAULT_IMAGE}?w=248&fit=crop&auto=format&dpr=2 2x`}
        src={`${thumbnail ?? DEFAULT_IMAGE}?w=248&fit=crop&auto=format`}
        alt={title}
        loading="lazy"
        style={{ display: 'block', width: '100%', minHeight: '120px' }}
      />
      {isHovered && (
        <Stack
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
          bgcolor="rgba(0, 0, 0, 0.5)">
          <Stack spacing={2} width="60%">
            <Stack display="inline">
              <Typography
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-all',
                }}
                fontWeight={700}
                variant="h6"
                color="#fff"
                component="span">
                {title}
              </Typography>
              {!isPhone && <Typography color="#fff">{createdAt?.slice(0, 10)}</Typography>}
            </Stack>
            <Stack direction="row" justifyContent="flex-start" spacing={2}>
              <Typography color="#fff">👍 {likesCount}</Typography>
              <Typography color="#fff">👀 {viewsCount}</Typography>
              <Typography color="#fff">📃 {repliesCount}</Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </ImageListItem>
  );
}

export default CollectPost;
