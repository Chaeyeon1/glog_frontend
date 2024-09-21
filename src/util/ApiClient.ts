'use client';

import { Image } from '@/types/Image';

type CustomHeader = { Authorization: string | undefined | null };
export const apiClient = new Image<CustomHeader>({
  baseURL: process.env.NEXT_PUBLIC_IDMS_SERVICE_BASEURL as string,
});

apiClient.instance.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('token');
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
        localStorage.removeItem('token');
      }
    }

    return Promise.reject(error);
  },
);
