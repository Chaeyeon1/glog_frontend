import { useEffect, useState } from 'react';

const useGetLoginStatus = () => {
  const [token, setToken] = useState<string | null>('');

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [localStorage]);

  return { isLogin: !!token };
};

export default useGetLoginStatus;
