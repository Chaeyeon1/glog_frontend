'use client';

import { useEffect, useState } from 'react';
import { IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useUserThemeSSR } from '../../../hooks/useRecoilSSR';
import { usePathname, useRouter } from 'next/navigation';
import PageLink from '../PageLink/PageLink';
import Image from 'next/image';
import SettingMenu from '../Header/SettingMenu';
import { Alarm, Home, Search } from '@mui/icons-material';
import { useGetUserDetailQuery } from '@/api/userDetail-api';
import { IAlarm, IUserDetail } from '@/types/dto';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useGetAlarmsQuery } from '@/api/blog-api';
import CommentIcon from '@mui/icons-material/Comment';
import { DEFAULT_IMAGE } from '@/constant/common';
import { TokenType } from '@/types/common';
import FriendModal from './HeaderFriendModal/FriendModal';
import useModalOpen from '@/hooks/useModalOpen';

export default function Header() {
  const [userTheme, setUserTheme] = useUserThemeSSR();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [alarmAnchorEl, setAlarmAnchorEl] = useState<null | HTMLElement>(null);
  const alarmOpen = Boolean(alarmAnchorEl);
  const [token, setToken] = useState<TokenType>(null);
  const { data: userDetailData, isLoading } = useGetUserDetailQuery({ token });
  const [userDetail, setUserDetail] = useState<IUserDetail>();
  const { data: alarmData } = useGetAlarmsQuery({ token, open: alarmOpen });
  const [alarm, setAlarm] = useState<IAlarm>();
  const router = useRouter();
  const {
    handleClose: handleFriendModalClose,
    handleOpen: handleFriendModalOpen,
    open: friendModalOpen,
  } = useModalOpen();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, [isLoading]);

  useEffect(() => {
    setAlarm(alarmData);
  }, [alarmData]);

  const toggleUserTheme = () => {
    setUserTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAlarmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAlarmAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    setUserDetail(userDetailData);
  }, [userDetailData]);

  return (
    <Stack
      bgcolor="transparent"
      direction="row"
      position="fixed"
      justifyContent="space-between"
      width="100%"
      height="64px"
      alignItems="center"
      p={4}
      zIndex={20000}>
      <Stack
        sx={{ cursor: 'pointer' }}
        width="fit-content"
        fontSize="32px"
        left={0}
        fontWeight={700}
        // color={pathname.includes('/home') ? 'primary.main' : 'white'}
        zIndex={20005}>
        <PageLink
          href="/collect"
          color="#ffffff"
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Image width={100} height={48} src="/assets/GLOG_RED_LOGO.png" alt="GLOG" />
        </PageLink>
      </Stack>
      <Stack direction="row" alignItems="center" gap={2}>
        {pathname.includes('/collect') &&
          (pathname.includes('/search') ? (
            <IconButton size="medium" color="primary" onClick={() => router.push('/collect')}>
              <Home fontSize="large" />
            </IconButton>
          ) : (
            <IconButton
              color="primary"
              size="medium"
              onClick={() => router.push('/collect/search')}>
              <Search fontSize="large" />
            </IconButton>
          ))}

        {userTheme === 'dark' ? (
          <IconButton color="primary" onClick={toggleUserTheme}>
            <DarkModeIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton color="primary" onClick={toggleUserTheme}>
            <LightModeIcon fontSize="large" />
          </IconButton>
        )}
        {token && (
          <IconButton color="primary" size="medium" onClick={handleAlarmClick}>
            <NotificationsIcon fontSize="large" />
          </IconButton>
        )}
        {token && (
          <Stack
            width="40px"
            height="40px"
            borderRadius="20px"
            overflow="hidden"
            sx={{ cursor: 'pointer', backgroundColor: '#ffffff' }}>
            <PageLink href={`/${!token ? 'login' : userDetail?.blogUrl}` ?? ''}>
              <Image
                width={40}
                height={40}
                alt="profile Image"
                src={userDetail?.thumbnail ?? DEFAULT_IMAGE}
              />
            </PageLink>
          </Stack>
        )}
        <IconButton color="primary" size="medium" onClick={handleClick}>
          <MenuIcon fontSize="large" />
        </IconButton>
        <SettingMenu open={menuOpen} onClose={handleClose} anchorEl={anchorEl} />
      </Stack>
      {alarm?.alarmDtos && (
        <Menu
          anchorEl={alarmAnchorEl}
          open={alarmOpen}
          onClose={() => {
            setAlarmAnchorEl(null);
          }}>
          {alarm?.alarmDtos.length ? (
            alarm?.alarmDtos.map((alarm, i) => {
              const { categoryId, postId, type } = alarm ?? {};

              const handleAlarmClick = () => {
                if (type === 'friend') {
                  handleFriendModalOpen();
                  setAlarmAnchorEl(null);
                  return;
                }

                router.push(`/${userDetail?.blogUrl}/home/${categoryId}/${postId}`);
                setAlarmAnchorEl(null);
              };
              return (
                <MenuItem onClick={handleAlarmClick} sx={{ padding: '4px', width: '100%' }} key={i}>
                  <Stack
                    bgcolor={alarm.checked ? 'primary.light' : 'transparent'}
                    py={4}
                    px={6}
                    spacing={2}>
                    <Stack maxWidth="200px">
                      <CommentIcon sx={{ marginBottom: '4px' }} />
                      <Typography sx={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                        {alarm.message}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Stack fontSize="13px">{alarm.createdAt.slice(0, 10)}</Stack>
                      <Stack fontSize="13px">{alarm.createdAt.slice(11, 19)}</Stack>
                    </Stack>
                  </Stack>
                </MenuItem>
              );
            })
          ) : (
            <Stack py={4} px={6} direction="row" spacing={2}>
              <Alarm />
              <Typography>알람이 존재하지 않습니다.</Typography>
            </Stack>
          )}
        </Menu>
      )}
      <FriendModal open={friendModalOpen} onClose={handleFriendModalClose} />
    </Stack>
  );
}
