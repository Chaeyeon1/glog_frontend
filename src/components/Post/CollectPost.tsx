import React, { useState } from 'react';
import { ICollectPost } from '@/types/dto';
import { useTheme, useMediaQuery } from '@mui/material';
import { DEFAULT_IMAGE } from '@/constant/common';
import { useRouter } from 'next/navigation';
import {
  HoverContainer,
  HoverContentContainer,
  PostContainer,
  PostThumbnail,
  HoverPostTitle,
  HoverTypography,
  InteractCountContainer,
} from './Post.style';

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
    <PostContainer
      onClick={() => router.push(`/${blogUrl}/home/${categoryId}/${postId}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <PostThumbnail
        srcSet={`${thumbnail ?? DEFAULT_IMAGE}?w=248&fit=crop&auto=format&dpr=2 2x`}
        src={`${thumbnail ?? DEFAULT_IMAGE}?w=248&fit=crop&auto=format`}
        alt={title}
        loading="lazy"
      />
      {isHovered && (
        <HoverContainer>
          <HoverContentContainer>
            <HoverPostTitle fontWeight={700} variant="h6" color="#fff">
              {title}
            </HoverPostTitle>
            {!isPhone && <HoverTypography>{createdAt?.slice(0, 10)}</HoverTypography>}
            <InteractCountContainer>
              <HoverTypography>👍 {likesCount}</HoverTypography>
              <HoverTypography>👀 {viewsCount}</HoverTypography>
              <HoverTypography>📃 {repliesCount}</HoverTypography>
            </InteractCountContainer>
          </HoverContentContainer>
        </HoverContainer>
      )}
    </PostContainer>
  );
}

export default CollectPost;
