import { Tooltip, TooltipProps } from '@mui/material';
import React from 'react';

const GlogTooltip = ({ ...rest }: TooltipProps) => {
  return (
    <Tooltip
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
      {...rest}
    />
  );
};

export default GlogTooltip;
