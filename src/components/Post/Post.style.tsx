import { styled } from '@mui/material/styles';
import { ImageListItem, Stack, Typography } from '@mui/material';

export const PostContainer = styled(ImageListItem)(({ theme }) => ({
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
}));

export const PostThumbnail = styled('img')(() => ({
  display: 'block',
  width: '100%',
  minHeight: '120px',
  objectFit: 'unset',
}));

export const HoverContainer = styled(Stack)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}));

export const HoverContentContainer = styled(Stack)(() => ({
  gap: 2,
  width: '60%',
}));

export const HoverPostTitle = styled(Typography)(() => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-all',
}));

export const InteractCountContainer = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: 8,
}));

export const HoverTypography = styled(Typography)(() => ({
  color: '#fff',
}));
