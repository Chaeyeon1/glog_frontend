'use client';
import { useSnackbar } from 'notistack';
import React, { useEffect, ComponentType } from 'react';

type LoginCheckProps = {
  // Define any props that need to be passed to the wrapped component
  // For example:
  // user: UserType;
};

const LoginCheck = <P extends LoginCheckProps>(Component: ComponentType<P>) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
      if (typeof window !== 'undefined') {
        if (!localStorage.getItem('token')) {
          enqueueSnackbar({ variant: 'error', message: '로그인이 필요합니다.' });
        }
      }
    }, [window]);

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default LoginCheck;
