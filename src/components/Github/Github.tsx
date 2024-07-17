/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import { ModalTitle } from '../Modal/Modal.style';
import { PostRepository, useGetRepositoryQuery } from '@/api/github-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import List from '../List/List';
import Button from '../Button/Button';
import { Stack } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { TokenType } from '@/types/common';

function Github({
  open,
  onClose,
  categoryId,
}: {
  open: boolean;
  onClose: () => void;
  categoryId?: number;
}) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<TokenType>(null);
  const { data: datas } = useGetRepositoryQuery({ token });
  const [clickList, setClickList] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);
  const putAllowFriendIdCreateQuery = useMutation(PostRepository, {
    onSuccess: () => {
      queryClient.invalidateQueries(['repository']);
      queryClient.invalidateQueries(['sidebar']);
      onClose();
      enqueueSnackbar({ message: 'Repository 연동이 완료되었습니다.', variant: 'success' });
    },
  });
  return (
    <Modal open={open} onClose={onClose}>
      <Stack pr={2}>
        <Stack direction="row" alignItems="flex-end" height="100%" justifyContent="space-between">
          <ModalTitle>Repository 선택</ModalTitle>
          <Button
            onClick={() => {
              putAllowFriendIdCreateQuery.mutateAsync({
                body: { categoryId, repo: datas?.repository[clickList] },
                token,
              });
            }}
            size="medium"
            variant="outlined"
            color="primary">
            선택
          </Button>
        </Stack>
        <Stack maxHeight="300px" py={4}>
          {datas?.repository?.map((repo, i: number) => {
            return (
              <List
                radioProps={{
                  checked: clickList === i,
                  onChange: () => setClickList(i),
                }}
                content={repo}
                key={i}
              />
            );
          })}
        </Stack>
      </Stack>
    </Modal>
  );
}

export default Github;
