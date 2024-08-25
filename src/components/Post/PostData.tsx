'use client';
import {
  Chip,
  Icon,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import RepliesComponent, {
  BlackContainer,
  BreadCrumbsContainer,
  ActionButtonContainer,
  EllipsisContent,
  EmptySidebar,
  GetReplies,
  HeaderCenterContent,
  HeaderContentContainer,
  ImageContainer,
  ReplyContainer,
  ReplyHandle,
  ReplyPagination,
  ThumbnailArea,
  WriteReply,
  DetailContentContainer,
  ActionContainer,
} from '@/app/[blogName]/home/[categoryId]/[postId]/postId.style';
import DragAndDrop from '@/components/DND/DragAndDrop';
import { useGetSidebarQuery, useGetPostQuery } from '@/api/blog-api';
import { IIntroduce, IPostContent, IReplyContent, IUserDetail, SidebarPostType } from '@/types/dto';
import { KeyboardArrowRight, Star } from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';
import IconButton from '@/components/Button/IconButton';
import Button from '@/components/Button/Button';
import { PostReplyApi, useGetReplyQuery } from '@/api/reply-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import Modal from '@/components/Modal/Modal';
import { ModalContent } from '@/components/Modal/Modal.style';
import { useGetIntroduceQuery } from '@/api/introduce-api';
import PageLink from '@/components/PageLink/PageLink';
import { PutFriendAllowApi, PutFriendRequestApi } from '@/api/friend-api';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import FootPrintAnimation from '@/components/FootPrint/FootPrintAnimation';
import { useGetBlogIdQuery } from '@/api/readme-api';
import { AddLikeApi, DeleteWriteApi } from '@/api/write-api';
import { enqueueSnackbar } from 'notistack';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { postVisitApi } from '@/api/mypage-api';
import { DEFAULT_IMAGE } from '@/constant/common';
import { TokenType } from '@/types/common';
import { useGetUserDetailQuery } from '@/api/userDetail-api';
import { addScrapApi } from '@/api/scrap-api';

type OrderType = 'likesCount' | 'createdAt';
const PostData = ({
  params,
}: {
  params: { blogName: string; categoryId: string; postId: string };
}) => {
  const [token, setToken] = useState<TokenType>(null);
  const { data: blogIdData } = useGetBlogIdQuery({ params: { blogUrl: params.blogName }, token });
  const [blogId, setBlogId] = useState<number>();
  const { data: sidebarData } = useGetSidebarQuery({ params: { blogId: blogIdData }, token });
  const { data: postData } = useGetPostQuery({ params: { postId: Number(params.postId) }, token });
  const [IntroduceOpen, setIntroduceOpen] = useState<boolean>(false);
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<OrderType>('likesCount');
  const orderList: OrderType[] = ['likesCount', 'createdAt'];
  const { data: replyData } = useGetReplyQuery({
    params: { postId: Number(params.postId), page: page, order: order },
    token,
  });
  const [reply, setReply] = useState<IReplyContent>();
  const { data: userDetailData } = useGetUserDetailQuery({ token });
  const [userDetail, setUserDetail] = useState<IUserDetail>();

  //sidebar, main-post
  const [writeList, setWriteList] = useState<SidebarPostType[]>();
  const [post, setPost] = useState<IPostContent>();
  const sidebarContent: SidebarPostType[] = sidebarData?.sidebarDtos;

  const { mutateAsync: addScrapMutateAsync } = useMutation(addScrapApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['post']);
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    setUserDetail(userDetailData);
  }, [userDetailData]);

  //댓글 post 기능 연동
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const postReplyCreateQuery = useMutation(PostReplyApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['replies']);
      setMessage('');
    },
  });

  const patchAddLikeQuery = useMutation(AddLikeApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['post']);
    },
  });

  const postVisitQuery = useMutation(postVisitApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['visit']);
    },
  });

  useEffect(() => {
    blogId && blogId > 0 && postVisitQuery.mutateAsync({ body: { blogId }, token });
  }, [blogId]);

  const ReplyOnClick = () => {
    const newReplyBody = {
      postId: Number(params.postId),
      message: message,
    };

    postReplyCreateQuery.mutateAsync({ body: newReplyBody, token });
  };

  //친구 요청/수락/거절
  const [isAccept, setIsAccept] = useState<number>(Number);
  const putAllowFriendIdCreateQuery = useMutation(PutFriendAllowApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['friend']);
    },
  });
  const AllowFriendOnClick = () => {
    const newAllowBody = {
      isAccept: isAccept,
      userId: post?.author?.userId ?? 0,
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
      userId: post?.author?.userId ?? 0,
    };
    PutFriendRequestQuery.mutateAsync({ body: newRequestBody, token });
  };

  const { data: introduceData } = useGetIntroduceQuery({
    params: { userId: post?.author?.userId ?? 0 },
    token,
  });

  const [introduce, setIntroduce] = useState<IIntroduce>();

  useEffect(() => {
    setWriteList(sidebarContent);
    setPost(postData);
    setIntroduce(introduceData);
    setReply(replyData);
    setBlogId(blogIdData);
  }, [sidebarData, postData, introduceData, replyData, blogIdData]);

  const deleteWritePrQuery = useMutation(DeleteWriteApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['postData']);
      enqueueSnackbar({ message: '게시글 삭제가 완료되었습니다.', variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar({ message: '에러가 발생하였습니다.', variant: 'error' });
    },
  });

  const deletePrPostOnClick = (postId: number) => {
    deleteWritePrQuery.mutateAsync({ params: { postId }, token });
  };

  //댓글 정렬기준
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const categoryName = sidebarContent?.filter(
    (category) => category.categoryId === Number(params.categoryId),
  )[0]?.categoryName;

  return (
    <Stack>
      <ThumbnailArea>
        <ImageContainer imageSrc={postData?.thumbnail ?? DEFAULT_IMAGE} />
        <BlackContainer paddingTop="64px">
          <HeaderCenterContent>
            <EmptySidebar />
            <HeaderContentContainer>
              <BreadCrumbsContainer>
                <EllipsisContent>{categoryName}</EllipsisContent>
                <Icon fontSize="small" sx={{ marginTop: '-6px' }}>
                  <KeyboardArrowRight />
                </Icon>
                <EllipsisContent>{post?.title}</EllipsisContent>
              </BreadCrumbsContainer>
              <EllipsisContent fontSize="36px">{post?.title}</EllipsisContent>
              <ActionButtonContainer>
                <img
                  style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIntroduceOpen(true)}
                  src={post?.author?.profileImage ?? DEFAULT_IMAGE}
                  alt="profileImage"
                />
                <Stack margin="auto 0px">{post?.author?.nickname}</Stack>
                {post?.isAuthor && (
                  <>
                    <PageLink href={`/write/update/${params.categoryId}/${params.postId}`}>
                      <Button>수정</Button>
                    </PageLink>
                    <Button
                      onClick={() => deletePrPostOnClick(Number(params?.postId))}
                      color="error">
                      삭제
                    </Button>
                  </>
                )}
              </ActionButtonContainer>
            </HeaderContentContainer>
          </HeaderCenterContent>
        </BlackContainer>
      </ThumbnailArea>
      <DragAndDrop
        blogName={params.blogName}
        footprintList={writeList}
        isMe={sidebarData?.isMyPage}
        rightContainer={
          <Stack width={'100%'} px={12}>
            <MDEditor.Markdown key={post?.content} source={post?.content} />
            <ReplyContainer>
              <DetailContentContainer>
                <ActionContainer>
                  <Stack color="#000" fontSize="14px">
                    조회수 : {post?.viewsCount}
                  </Stack>
                  <Stack fontSize="14px">추천수 : {post?.likesCount} </Stack>
                  <IconButton
                    size="small"
                    onClick={() => {
                      !token
                        ? enqueueSnackbar({ variant: 'error', message: '로그인이 필요합니다.' })
                        : patchAddLikeQuery.mutateAsync({
                            params: { postId: Number(params?.postId) },
                            token,
                          });
                    }}>
                    <ThumbUpIcon color={post?.isLiked ? 'primary' : undefined} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      !token
                        ? enqueueSnackbar({ variant: 'error', message: '로그인이 필요합니다.' })
                        : addScrapMutateAsync({
                            params: { postId: Number(params?.postId) },
                            token,
                          });
                    }}>
                    <Star color={post?.isScraped ? 'primary' : undefined} />
                  </IconButton>
                </ActionContainer>
                <Stack direction="row" spacing={2}>
                  {post?.hashtags?.map((hashtag, i) => {
                    return (
                      <Chip color="primary" sx={{ width: 'fit-content' }} key={i} label={hashtag} />
                    );
                  })}
                </Stack>
              </DetailContentContainer>
              {/* 댓글 */}
              {!!reply?.replyDtos.length && (
                <ReplyHandle>
                  <Stack flexDirection={'row'} gap={6}>
                    <Typography>댓글 {reply?.replyDtos.length}개</Typography>
                    <Stack direction="row">
                      <Button
                        onClick={handleClick}
                        sx={{ padding: '0 10px 0 0', minWidth: '24px' }}>
                        <AlignHorizontalLeftIcon fontSize="medium"></AlignHorizontalLeftIcon>
                      </Button>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            setOrder(orderList[0]);
                          }}>
                          인기순
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            setOrder(orderList[1]);
                          }}>
                          최신순
                        </MenuItem>
                      </Menu>
                      <Stack>정렬기준</Stack>
                    </Stack>
                  </Stack>
                </ReplyHandle>
              )}
              {token && (
                <WriteReply>
                  <Image
                    width={35}
                    height={35}
                    alt="profile Image"
                    src={userDetail?.thumbnail ?? DEFAULT_IMAGE}
                  />
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="댓글 추가"
                    sx={{ margin: '0 30px' }}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                  <Button
                    variant="outlined"
                    sx={{ width: '25px' }}
                    onClick={() => {
                      if (!message) {
                        enqueueSnackbar({ variant: 'error', message: '댓글을 입력해주세요.' });
                        return;
                      }
                      ReplyOnClick();
                    }}>
                    등록
                  </Button>
                </WriteReply>
              )}
            </ReplyContainer>
            {!!reply?.replyDtos.length && (
              <GetReplies>
                {reply.replyDtos.map((replyInfo) => {
                  return (
                    <RepliesComponent
                      key={replyInfo.replyId}
                      replyId={replyInfo.replyId}
                      userId={replyInfo.userDto.userId}
                      nickname={replyInfo.userDto.nickname}
                      profileImage={replyInfo.userDto.profileImage}
                      message={replyInfo.message}
                      likesCount={replyInfo.likesCount}
                      isLiked={replyInfo.isLiked}
                      createdAt={replyInfo.createdAt}
                      who={replyInfo.who}></RepliesComponent>
                  );
                })}
                <ReplyPagination
                  count={replyData?.totalPages}
                  page={page + 1}
                  sx={{ margin: '30px 0' }}
                  onChange={(_, newPage) => {
                    setPage(newPage - 1);
                  }}
                />
              </GetReplies>
            )}
          </Stack>
        }
      />
      {/* 게시물 글쓴이 introduction */}
      <Modal open={IntroduceOpen} maxWidth="md" onClose={() => setIntroduceOpen(false)}>
        <ModalContent>
          <Stack spacing={10} padding={'40px 80px'}>
            <Stack direction="row" width="500px" spacing={10} justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={4}>
                <Image width={30} height={30} src={introduce?.imageUrl ?? DEFAULT_IMAGE} alt="" />
                <Stack>
                  <Stack padding="8px" fontSize="25px">
                    {introduce?.nickname}
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Button size="small" variant="outlined">
                      <PageLink href={`/${introduce?.blogUrl}`}>블로그 바로가기</PageLink>
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
                  <Stack direction="row" alignItems="center" spacing={1}>
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
                    {!post?.isAuthor && token && (
                      <Button
                        onClick={() => {
                          FriendRequestOnClick();
                        }}>
                        친구 요청
                      </Button>
                    )}
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
      <FootPrintAnimation blogId={Number(blogIdData)} />
    </Stack>
  );
};

export default PostData;
