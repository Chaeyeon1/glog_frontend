'use client';

import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const axiosApi = (url: string, data?: any) => {
  let token: string | null = '';

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  const instance = axios.create({
    baseURL: url,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...data,
  });

  return instance;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unAxiosApi = (url: string, data?: any) => {
  const instance = axios.create({
    baseURL: url,
    withCredentials: true,
    ...data,
  });

  return instance;
};

export const defaultInstance = axiosApi('https://port-0-glog-ly8kvahp40d24095.sel5.cloudtype.app');

export const unAxiosDefaultInstance = unAxiosApi(
  'https://port-0-glog-ly8kvahp40d24095.sel5.cloudtype.app',
);
