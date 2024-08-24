import {
  outlinedInputClasses,
  Select,
  Stack,
  styled,
  svgIconClasses,
  TextField,
} from '@mui/material';

export const SearchContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  spacing: 2,
  borderBottom: `2px solid ${theme.palette.primary.main}`,
}));

export const SearchSelect = styled(Select)(({ theme }) => ({
  color: theme.palette.primary.main,
  [`&.${outlinedInputClasses.root}`]: {
    [`& .${outlinedInputClasses.notchedOutline}`]: { border: '1px solid transparent' },
  },
  [`& .${svgIconClasses.root}`]: { fill: theme.palette.primary.main },
  width: '120px',
}));

export const SearchTextField = styled(TextField)(({ theme }) => ({
  width: '50%',
  [`&& .${outlinedInputClasses.root}`]: {
    [`& .${outlinedInputClasses.notchedOutline}`]: { border: '1px solid transparent' },
  },
  ':hover': {
    [`&.${outlinedInputClasses.notchedOutline}`]: { border: '1px solid transparent' },
  },
  [`& .${svgIconClasses.root}`]: { fill: theme.palette.primary.main },
}));
