import IconButton from '@/components/Button/IconButton';
import { Box, Pagination, TextField, Tooltip } from '@mui/material';
import { Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Button from '@/components/Button/Button';
import { IIntroduce } from '@/types/dto';
import { useGetIntroduceQuery } from '@/api/introduce-api';
import { useEffect, useInsertionEffect, useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { ModalContent, ModalTitle } from '@/components/Modal/Modal.style';
import PageLink from '@/components/PageLink/PageLink';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PutFriendAllowApi, PutFriendRequestApi } from '@/api/friend-api';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { DeleteReplyApi, PatchReplyLikeApi, putReplyApi } from '@/api/reply-api';
import { Dialog } from '@/components/Dialog/Dialog';
import { enqueueSnackbar } from 'notistack';
import { DEFAULT_IMAGE, SIDEBAR_WIDTH } from '@/constant/common';
import { TokenType } from '@/types/common';
import CenterContent from '@/components/Layout/CenterContent';
import Image from 'next/image';
import getDateFormat from '@/util/getDateFormat';
import { Delete, Edit } from '@mui/icons-material';

export const ThumbnailArea = styled(Stack)({
  width: '100%',
  height: '35vh',
  position: 'relative',
});

export const BlackContainer = styled(Stack)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

export const ImageContainer = styled(Stack)(({ imageSrc }: { imageSrc: string }) => ({
  backgroundAttachment: 'fixed',
  backgroundImage: `url(${imageSrc})`,
  backgroundSize: '100% 35vh',
  backgroundRepeat: 'no-repeat',
  width: '100%',
  height: '100%',
}));

export const HeaderCenterContent = styled(CenterContent)(() => ({
  color: '#fff',
  flexDirection: 'row',
  gap: '32px',
}));

export const HeaderContentContainer = styled(Stack)({
  padding: '0px 48px',
  overflow: 'hidden',
});

export const BreadCrumbsContainer = styled(Stack)({
  height: '24px',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '4px',
  width: 'fit-content',
  maxWidth: '100%',
});

export const EllipsisContent = styled(Box)({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-all',
  flexShrink: 0,
  maxWidth: '100%',
});

export const ActionButtonContainer = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  height: '30px',
  gap: '12px',
  marginTop: '12px',
});

export const ProfileImg = styled('img')({
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  cursor: 'pointer',
});

export const EmptySidebar = styled(Stack)(() => ({
  width: `${SIDEBAR_WIDTH}px`,
  height: '100%',
  flexShrink: 0,
}));

// export const ProfileImg = styled(Stack)(({ imageSrc }: { imageSrc: string }) => ({
//   backgroundAttachment: 'fixed',
//   backgroundImage: `url(${imageSrc})`,
//   backgroundRepeat: 'no-repeat',
//   borderRadius: '50%',
// }));

export const ReplyContainer = styled(Stack)({
  marginTop: '50px',
  height: '100%',
  flexDirection: 'column',
});

export const DetailContentContainer = styled(Stack)({
  marginBottom: '32px',
  gap: '8px',
});

export const ActionContainer = styled(Stack)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.primary.main}`,
  flexDirection: 'row',
  gap: '8px',
  padding: '4px 0px 0px 0px',
  alignItems: 'center',
}));

export const CountContainer = styled(Stack)({
  color: '#000',
  fontSize: '14px',
});

export const ReplyHandle = styled(Stack)({
  flexDirection: 'row',
  marginBottom: '20px',
});

export const ReplyCount = styled(Stack)({});

export const WriteReply = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px 15px',
});

export const GetReplies = styled(Stack)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '30px',
});

export const ReplyPagination = styled(Pagination)({});

const ReplyMainInfo = styled(Stack)({
  flexDirection: 'column',
});

function RepliesComponent({
  userId,
  replyId,
  profileImage,
  nickname,
  message,
  likesCount,
  isLiked,
  who,
  createdAt,
}: {
  userId: number;
  replyId: number;
  profileImage: string;
  nickname: string;
  message: string;
  likesCount: number;
  isLiked: boolean;
  who: string;
  createdAt: string;
}) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [putReplyOpen, setPutReplyOpen] = useState<boolean>(false);
  const [deleteReplyOpen, setDeleteReplyOpen] = useState<boolean>(false);
  const [token, setToken] = useState<TokenType>(null);
  const [IntroduceOpen, setIntroduceOpen] = useState<boolean>(false);
  const { data: introduceData } = useGetIntroduceQuery({
    params: { userId },
    token,
  });
  const [introduce, setIntroduce] = useState<IIntroduce>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  const deleteReplyQuery = useMutation(DeleteReplyApi, {
    onSuccess() {
      queryClient.invalidateQueries(['replies']);
    },
  });

  const deleteClick = () => {
    deleteReplyQuery.mutateAsync(
      { params: { replyId }, token },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['replies']);
          enqueueSnackbar({ message: '댓글이 성공적으로 삭제되었습니다.', variant: 'success' });
        },
        onError: () => {
          enqueueSnackbar({ message: '에러입니다.', variant: 'error' });
        },
      },
    );
  };

  const [isAccept, setIsAccept] = useState<number>(Number);
  const putAllowFriendIdCreateQuery = useMutation(PutFriendAllowApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['friend']);
    },
  });
  const AllowFriendOnClick = () => {
    const newAllowBody = {
      isAccept: isAccept,
      userId: userId,
    };

    putAllowFriendIdCreateQuery.mutateAsync({ body: newAllowBody, token });
  };

  const PutFriendRequestQuery = useMutation(PutFriendRequestApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['friend']);
    },
  });
  const FriendRequestOnClick = () => {
    const newRequestBody = {
      userId: userId,
    };
    PutFriendRequestQuery.mutateAsync({ body: newRequestBody, token });
  };

  const [newReply, setNewReply] = useState('');
  const PutReplyQuery = useMutation(putReplyApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['replies']);
    },
  });
  const PutReplyOnClick = () => {
    const newReplyBody = {
      repyId: replyId,
      message: newReply,
    };
    PutReplyQuery.mutateAsync({ body: newReplyBody, token });
  };

  const PatchReplyLikeQuery = useMutation(PatchReplyLikeApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['replies']);
    },
  });
  const ReplyLikeOnClick = () => {
    const newReplyLikeBody = {
      replyId: replyId,
    };
    PatchReplyLikeQuery.mutateAsync({ params: newReplyLikeBody, token });
  };

  useInsertionEffect(() => {
    setIntroduce(introduceData);
  }, [introduceData]);

  return (
    <Stack borderBottom="1px solid #E8E8E8" flexDirection={'column'} padding="15px" width="100%">
      <ReplyMainInfo>
        <Stack spacing={4} direction="row" alignItems="center" marginBottom="10px">
          <Button
            sx={{ minWidth: '35px', width: '35px', height: '35px', borderRadius: '50%' }}
            onClick={() => setIntroduceOpen(true)}>
            <Image width={35} height={35} alt="profile Image" src={profileImage ?? DEFAULT_IMAGE} />
          </Button>
          <Stack>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Stack>{nickname}</Stack>
              <Stack>{getDateFormat(createdAt)}</Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Stack>{likesCount}</Stack>
                {isLiked ? (
                  <IconButton color="primary" onClick={ReplyLikeOnClick}>
                    <ThumbUpAltIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={ReplyLikeOnClick}>
                    <ThumbUpOffAltIcon />
                  </IconButton>
                )}
                {(who === 'me(author)' || who === 'me') && (
                  <>
                    <IconButton size="small" onClick={() => setPutReplyOpen(true)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => deleteClick()}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </Stack>
            </Stack>
            <Stack>{message}</Stack>
          </Stack>
        </Stack>
      </ReplyMainInfo>
      <Modal open={putReplyOpen} onClose={() => setPutReplyOpen(false)}>
        <ModalTitle>수정하기</ModalTitle>
        <ModalContent>
          <TextField
            fullWidth
            defaultValue={message}
            onChange={(e) => {
              setNewReply(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              PutReplyOnClick();
            }}>
            게시하기
          </Button>
        </ModalContent>
        <Dialog
          open={deleteReplyOpen}
          onClose={() => setDeleteReplyOpen(false)}
          message="친구 삭제하시겠습니까?"
          action={{
            content: '확인',
            action: deleteClick,
          }}
        />
      </Modal>

      {/* 댓글 상대방 introduction */}
      <Modal open={IntroduceOpen} maxWidth="md" onClose={() => setIntroduceOpen(false)}>
        <ModalContent>
          <Stack spacing={10} padding={'40px 80px'}>
            <Stack direction="row" width="500px" spacing={10} justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={4}>
                <img
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                  }}
                  src={introduce?.imageUrl ?? DEFAULT_IMAGE}
                  alt="profileImage"
                />
                <Stack>
                  <Stack padding="8px" fontSize="25px">
                    {introduce?.nickname}
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Button size="small" variant="outlined">
                      <PageLink href={`/${introduce?.blogUrl}`}> 블로그 바로가기</PageLink>
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
              <Stack>
                <Stack fontSize="18px" marginBottom="15px">
                  친구 {introduce?.friendCount} 명
                </Stack>
                {introduce?.relationship === 'friend' ? (
                  <Stack color="#00BFFF">팔로잉</Stack>
                ) : introduce?.relationship === 'friending' ? (
                  <Stack marginLeft="10px" fontSize="15px" color="#FFA07A">
                    요청 중
                  </Stack>
                ) : introduce?.relationship === 'friended' ? (
                  <Stack direction="row" alignItems="center">
                    <Stack margin="0 5px 0 10px">친구 요청</Stack>
                    <Tooltip title="수락" arrow>
                      <Button
                        sx={{ minWidth: '36px', height: '36px', padding: '0' }}
                        onClick={() => {
                          setIsAccept(0);
                          AllowFriendOnClick();
                        }}
                        color="success">
                        <CheckIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="거절" arrow>
                      <Button
                        sx={{ minWidth: '36px', height: '36px', padding: '0' }}
                        onClick={() => {
                          setIsAccept(1);
                          AllowFriendOnClick();
                        }}
                        color="error">
                        <CloseIcon />
                      </Button>
                    </Tooltip>
                  </Stack>
                ) : (
                  <Stack>
                    <Button onClick={() => FriendRequestOnClick()}>친구 요청</Button>
                  </Stack>
                )}
              </Stack>
            </Stack>
            <Stack width="500px" spacing={2}>
              <Stack color="primary.main" fontSize="18px">
                한 줄 소개
              </Stack>
              <Stack
                fontSize="14px"
                width="500px"
                borderLeft={`1px solid ${theme.palette.primary.main}`}
                padding={'0px 0px 0px 12px'}
                sx={{ overflowY: 'overlay', wordBreak: 'break-all' }}
                height="fit-content"
                maxHeight="200px">
                {introduce?.introduction}
              </Stack>
            </Stack>
          </Stack>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default RepliesComponent;
