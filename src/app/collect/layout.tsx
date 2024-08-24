import { Stack } from '@mui/material';
import React, { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
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
        {children}
      </Stack>
    </>
  );
};

export default layout;
