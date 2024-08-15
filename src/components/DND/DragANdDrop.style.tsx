import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import IconButton from '../Button/IconButton';

export const CategoryTitleContainer = styled(Stack)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  borderRadius: '0px 8px',
});

export const CategoryTitleLeftContainer = styled(Stack)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '4px',
});

export const Dot = styled(Stack)({
  width: '4px',
  height: '4px',
  backgroundColor: '#000',
  borderRadius: '9999px',
});

export const CategoryItem = styled(Stack)({
  color: '#000',
  ':hover': { color: 'rgba(0,0,0,0.4)' },
  cursor: 'pointer',
  wordBreak: 'break-all',
});

export const PRButton = styled(IconButton)(() => {
  return {
    fontSize: '12px',
    cursor: 'pointer',
    ':hover': { opacity: 0.6 },
    alignItems: 'center',
    padding: '0px',
  };
});

export const BearFootprint = styled(Stack)({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  top: '5px',
  width: 'fit-content',
});

export const Big__toe = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  width: '10px',
  height: '10px',
  position: 'relative',
  top: '5px',
  left: '0px',
}));

export const Small__toe3 = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  width: '5px',
  height: '5px',
  position: 'absolute',
  top: '0px',
  left: '-5px',
}));

export const Small__toe2 = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  width: '5px',
  height: '5px',
  position: 'absolute',
  top: '-5px',
  left: '2px',
}));

export const Small__toe = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  width: '5px',
  height: '5px',
  position: 'absolute',
  top: '0px',
  left: '10px',
}));
