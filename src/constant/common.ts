import { ThemeType } from '@/types/common';

export const oppositeThemeExtraction = (theme: ThemeType) => {
  return theme === 'dark' ? 'light' : 'dark';
};

export const getCurrentThemeClass = (
  userTheme: ThemeType,
  light: string | number,
  dark: string | number,
) => {
  return userTheme === 'light' ? light : dark;
};

export const API_BASE_URL = 'https://port-0-glog-ly8kvahp40d24095.sel5.cloudtype.app';

// export const OAUTH2_REDIRECT_URI = 'http://localhost:3000/oauth2/redirect';
export const OAUTH2_REDIRECT_URI = 'https://gloog.vercel.app/oauth2/redirect';

export const GITHUB_AUTH_URL =
  API_BASE_URL + '/oauth2/authorization/github?redirect_uri=' + OAUTH2_REDIRECT_URI;

export const SERVER_URL = 'https://port-0-glog-ly8kvahp40d24095.sel5.cloudtype.app';
export const DEFAULT_IMAGE = '/assets/9.jpeg';
