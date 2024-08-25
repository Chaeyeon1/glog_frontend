'use client';
import React, { ReactNode } from 'react';
import CenterContent from '@/components/Layout/CenterContent';
import { Stack, Tooltip, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useRouter } from 'next/navigation';
import IconButton from '../Button/IconButton';
import { Add, Article, Edit } from '@mui/icons-material';
import CategorySettingModal from './CategorySettingModal';
import PageLink from '../PageLink/PageLink';
import Github from '../Github/Github';
import Button from '../Button/Button';
import CreateCategoryModal from './CreateCategoryModal';
import {
  CategoryItem,
  CategoryTitleContainer,
  CategoryTitleLeftContainer,
  Dot,
  PRButton,
} from './DragANdDrop.style';
import GlogTooltip from '../Tooltip/Tooltip';
import { SIDEBAR_WIDTH } from '@/constant/common';

type Footprint = {
  categoryId: number;
  categoryName: string;
  isPrCategory: boolean;
  postTitleDtos: {
    postId: number;
    title: string;
  }[];
};

interface DragAndDropProps {
  blogName: string;
  rightContainer: ReactNode;
  footprintList?: Footprint[];
  categoryNumber?: string;
  isMe?: boolean;
}

function DragAndDrop({ rightContainer, footprintList, blogName, isMe }: DragAndDropProps) {
  const [isBrowser, setIsBrowser] = useState(false);
  const [categoryEditOpen, setCategoryEditOpen] = useState(false);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [paramsCategoryId, setParamsCategoryId] = useState(Number);
  const theme = useTheme();

  const router = useRouter();
  useEffect(() => {
    setIsBrowser(process.browser);
  }, []);

  const dragHandler = (result: DropResult) => {
    if (result.destination?.droppableId === 'right-droppable') {
      router.push(`/${blogName}/home/${result.source.droppableId}/${result.draggableId}`);
    }
  };

  return (
    <>
      {isBrowser ? (
        <DragDropContext onDragEnd={dragHandler}>
          <CenterContent bgcolor="themeColor.main">
            <Stack gap={8} width="100%" height="100%" direction="row">
              <Stack>
                <Button variant="contained" sx={{ borderRadius: '10px', marginBottom: 3 }}>
                  HOME
                </Button>
                <Stack
                  borderTop={`2px solid ${theme.palette.primary.main}`}
                  px={2}
                  pt={3}
                  width={`${SIDEBAR_WIDTH}px`}
                  sx={{ transition: 'all .35s ease-in-out', flexShrink: 0 }}
                  position="relative"
                  gap={8}>
                  {isMe && (
                    <CategoryItem
                      onClick={() => setCreateCategoryOpen(true)}
                      sx={{ fontSize: '16px', fontWeight: 600, marginBottom: '-24px' }}>
                      + 카테고리
                    </CategoryItem>
                  )}
                  {footprintList?.map((category) => {
                    return (
                      <Droppable
                        key={category.categoryId}
                        droppableId={String(category.categoryId)}>
                        {(provided, snapshot) => (
                          <div
                            className="top-container"
                            style={{
                              backgroundColor: snapshot.isDraggingOver
                                ? 'transparent'
                                : 'transparent',
                            }}
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                            <CategoryTitleContainer>
                              <CategoryTitleLeftContainer>
                                <Dot />
                                {category?.isPrCategory ? (
                                  <GlogTooltip title="PR 페이지" placement="top">
                                    <PageLink
                                      onClick={() => {
                                        setCategoryId(category.categoryId);
                                      }}
                                      href={`/${blogName}/prList/${category.categoryId}`}>
                                      <PRButton>
                                        <Article sx={{ fontSize: '20px' }} />
                                      </PRButton>
                                    </PageLink>
                                  </GlogTooltip>
                                ) : (
                                  isMe && (
                                    <GlogTooltip title="PR 페이지" placement="top">
                                      <PRButton
                                        onClick={() => {
                                          setOpen(true);
                                          setCategoryId(category.categoryId);
                                        }}>
                                        <Article sx={{ fontSize: '20px' }} />
                                      </PRButton>
                                    </GlogTooltip>
                                  )
                                )}
                                <PageLink href={`/${blogName}/home/${category.categoryId}`}>
                                  <CategoryItem sx={{ fontSize: '16px', fontWeight: 600 }}>
                                    {category.categoryName}
                                  </CategoryItem>
                                </PageLink>
                                {isMe && (
                                  <Tooltip title="게시글 수정">
                                    <IconButton
                                      onClick={() => {
                                        setCategoryEditOpen(true);
                                        setParamsCategoryId(category.categoryId);
                                      }}
                                      sx={{ padding: '0px', color: '#000' }}
                                      size="small">
                                      <Edit sx={{ fontSize: '14px' }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </CategoryTitleLeftContainer>
                              {isMe && (
                                <PageLink href={`/write/create/${category.categoryId}`}>
                                  <Tooltip title="게시글 작성">
                                    <IconButton sx={{ padding: '0px', color: '#000' }} size="small">
                                      <Add sx={{ fontSize: '14px' }} />
                                    </IconButton>
                                  </Tooltip>
                                </PageLink>
                              )}
                            </CategoryTitleContainer>
                            <Stack
                              sx={{
                                borderRadius: '8px',
                              }}>
                              {category.postTitleDtos?.map((post) => {
                                return (
                                  <Draggable
                                    key={post.postId}
                                    draggableId={`${post.postId}`}
                                    index={post.postId}>
                                    {(provided) => (
                                      <Stack
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}>
                                        <PageLink
                                          style={{
                                            wordBreak: 'break-all',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            flexShrink: 0,
                                            maxWidth: '100%',
                                          }}
                                          href={`/${blogName}/home/${category.categoryId}/${post.postId}`}>
                                          - {post.title}
                                        </PageLink>
                                      </Stack>
                                    )}
                                  </Draggable>
                                );
                              })}
                            </Stack>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </Stack>
              </Stack>
              <Droppable droppableId="right-droppable">
                {(provided) => {
                  return (
                    <div
                      className="right-container"
                      {...provided.droppableProps}
                      style={{ width: '100%', height: '100%' }}
                      ref={provided.innerRef}>
                      {rightContainer}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </Stack>
          </CenterContent>
          <CategorySettingModal
            open={categoryEditOpen}
            categoryId={paramsCategoryId}
            categoryName={
              footprintList?.find((category) => category.categoryId === paramsCategoryId)
                ?.categoryName
            }
            onClose={() => setCategoryEditOpen(false)}
          />
          <CreateCategoryModal
            open={createCategoryOpen}
            onClose={() => setCreateCategoryOpen(false)}
          />
          <Github categoryId={categoryId} open={open} onClose={() => setOpen(false)} />
        </DragDropContext>
      ) : null}
    </>
  );
}

export default DragAndDrop;
