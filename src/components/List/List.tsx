import { Radio, RadioProps, Stack, StackProps, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

function List({
  content,
  buttonAction,
  radioProps,
  width,
  ...rest
}: {
  content: string;
  buttonAction?: ReactNode;
  radioProps?: RadioProps;
  width?: number | string;
} & StackProps) {
  return (
    <Stack
      sx={{
        padding: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: width ?? '600px',
        borderBottom: '1px solid #d9d9d9',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}
      {...rest}>
      <Stack direction="row" alignItems="center">
        {radioProps && <Radio {...radioProps} />}
        <Typography>{content}</Typography>
      </Stack>
      {buttonAction}
    </Stack>
  );
}

export default List;
