import { CircularProgress, CircularProgressProps } from '@mui/material';
import React from 'react';

const Progress = ({ ...rest }: CircularProgressProps) => {
  return <CircularProgress color="primary" {...rest} />;
};

export default Progress;
