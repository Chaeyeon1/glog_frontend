'use client';

import { TokenType } from '@/types/common';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const axiosApi = (url: string, token: TokenType, data?: any) => {
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

export const defaultInstance = (token: TokenType) =>
  axiosApi(process.env.NEXT_PUBLIC_API_URL!, token);
export const unAxiosDefaultInstance = unAxiosApi(process.env.NEXT_PUBLIC_API_URL!);
