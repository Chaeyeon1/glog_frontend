'use client';

import { ModalType, TokenType } from '@/types/common';
import { Dialog, DialogActions, DialogContent, Menu, MenuItem, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PageLink from '../PageLink/PageLink';
import FriendModal from '../Layout/HeaderFriendModal/FriendModal';
import { enqueueSnackbar } from 'notistack';
import { deleteUserApi } from '@/api/userDetail-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Button from '../Button/Button';
import useModalOpen from '@/hooks/useModalOpen';

function SettingMenu({ open, onClose, anchorEl }: ModalType & { anchorEl: null | HTMLElement }) {
  const [friendOpen, setFriendOpen] = useState<boolean>(false);
  const [token, setToken] = useState<TokenType>(null);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const {
    open: dialogOpen,
    handleClose: handleDialogClose,
    handleOpen: handleDialogOpen,
  } = useModalOpen();
  const router = useRouter();
  // const queryClient = useQueryClient()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, [open]);
  const { mutateAsync: deleteUserMutate } = useMutation(deleteUserApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userDetail']);
      enqueueSnackbar({
        message: '회원탈퇴가 성공적으로 완료되었습니다.',
        variant: 'success',
      });
      localStorage.removeItem('token');
      handleDialogClose();
      router.push('/login');
      onClose();
    },
  });

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {token && (
        <MenuItem>
          <PageLink
            href="/mypage"
            onClick={() => {
              onClose();
            }}>
            마이페이지
          </PageLink>
        </MenuItem>
      )}
      {token && (
        <MenuItem
          sx={{ color: theme.palette.oppositeColor.main }}
          onClick={() => {
            setFriendOpen(true);
            onClose();
          }}>
          친구
        </MenuItem>
      )}
      {/* <MenuItem>
        <PageLink
          href="/scrap"
          onClick={() => {
            onClose();
          }}>
          스크랩
        </PageLink>
      </MenuItem> */}
      {token && (
        <PageLink
          href="/login"
          onClick={() => {
            enqueueSnackbar({
              message: '로그아웃이 성공적으로 완료되었습니다.',
              variant: 'success',
            });
            onClose();
            localStorage.removeItem('token');
          }}>
          <MenuItem>Logout</MenuItem>
        </PageLink>
      )}
      {token && (
        <MenuItem
          onClick={() => {
            handleDialogOpen();
          }}>
          계정탈퇴
        </MenuItem>
      )}
      {!token && (
        <MenuItem>
          <PageLink href="/login" onClick={onClose}>
            로그인
          </PageLink>
        </MenuItem>
      )}
      <FriendModal open={friendOpen} onClose={() => setFriendOpen(false)}></FriendModal>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>회원 탈퇴를 진행하시겠습니까?</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>아니요</Button>
          <Button
            onClick={() => {
              deleteUserMutate({ token });
            }}>
            네
          </Button>
        </DialogActions>
      </Dialog>
    </Menu>
  );
}

export default SettingMenu;
