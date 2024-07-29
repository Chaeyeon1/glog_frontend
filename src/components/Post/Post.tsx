import React, { ReactNode } from 'react';
import { CostomizeButton, Image, Post, PostPopular, Thumbnail, Title } from './Post.style';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '../Button/IconButton';
import { IScrapContent } from '@/types/dto';
import { DEFAULT_IMAGE } from '@/constant/common';

function PostComponent({
  thumbnail,
  title,
  likesCount,
  viewsCount,
  Icon,
  href,
}: IScrapContent & { Icon: ReactNode; href?: string }) {
  return (
    <Post href={href ?? ''}>
      <Thumbnail>
        <PostPopular>
          <FavoriteBorderIcon fontSize="small" />
          {likesCount}
          <VisibilityIcon fontSize="small" />
          {viewsCount}
        </PostPopular>
        <Image alt="" src={thumbnail ?? DEFAULT_IMAGE} />
        <CostomizeButton>
          <IconButton size="small">{Icon}</IconButton>
        </CostomizeButton>
      </Thumbnail>
      <Title>{title}</Title>
    </Post>
  );
}

export default PostComponent;
