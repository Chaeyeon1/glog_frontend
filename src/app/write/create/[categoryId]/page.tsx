'use client';

import { Stack, TextField } from '@mui/material';
import {
  useTemplateIdSSR,
  useTemporaryIdSSR,
  useUserThemeSSR,
} from '../../../../../hooks/useRecoilSSR';
import { useEffect, useState } from 'react';
import { ToolBar } from '../../Write.style';
import TagList from '../../TagList';
import TopButton from '../../Top/TopButton';
import MDEditor from '@uiw/react-md-editor';
import BottomButton from '../../Bottom/BottomButton';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { WriteProps } from '@/util/useWriteProps';
import {
  useGetTemplateDetailQuery,
  useGetTemporaryDetailQuery,
  usePostImage,
} from '@/api/write-api';
import { TokenType } from '@/types/common';

const Write = ({ params }: { params: { categoryId: number } }) => {
  const [userTheme] = useUserThemeSSR();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string | undefined>('');
  const [tags, setTags] = useState<string[]>([]);
  const [templateId] = useTemplateIdSSR();
  const [temporaryId] = useTemporaryIdSSR();
  const [token, setToken] = useState<TokenType>(null);
  const { mutateAsync } = usePostImage();

  const { data: templateData, refetch: templateRefetch } = useGetTemplateDetailQuery({
    params: { templateId },
    token,
  });
  const { data: temporaryData, refetch: temporaryRefetch } = useGetTemporaryDetailQuery({
    params: { temporaryId },
    token,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    templateId > 0 && templateRefetch();
  }, [templateId]);

  useEffect(() => {
    temporaryRefetch();
  }, [temporaryId]);

  useEffect(() => {
    setTitle(templateData?.title);
    setContent(templateData?.content);
    setTags(templateData?.hashtags);
  }, [templateData]);

  useEffect(() => {
    setTitle(temporaryData?.title);
    setContent(temporaryData?.content);
    setTags(temporaryData?.hashtags);
  }, [temporaryData]);

  useEffect(() => {
    setTitle('');
    setContent('');
    setTags([]);
  }, []);

  const writeProps: WriteProps = {
    title,
    content,
    tags,
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardItems = e.clipboardData.items;

    for (const item of clipboardItems) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();

        if (file) {
          const imageUrl = await mutateAsync({
            body: {
              image: file,
            },
          });

          if (imageUrl) {
            const newContent = `${content}\n![Uploaded Image](${imageUrl})\n`;
            setContent(newContent);
          }
        }
      }
    }
  };

  return (
    <Stack mt={10} px={8} spacing={4} data-color-mode={userTheme}>
      <TextField
        sx={{ width: '30%' }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="standard"
        placeholder="제목을 입력해주세요."
      />
      <ToolBar>
        <TagList editTagArray={(newValue) => setTags(newValue)} tagArray={tags} />
        <TopButton />
      </ToolBar>
      <div onPaste={handlePaste}>
        <MDEditor height="68vh" value={content} onChange={setContent} />
      </div>
      <BottomButton categoryId={params.categoryId} writeProps={writeProps} />
    </Stack>
  );
};

export default Write;
