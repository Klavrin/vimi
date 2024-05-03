import React, { useEffect, useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkReact from 'remark-react';

import StyledPreviewMarkdown from './styles/preview-markdown.styled';

type MarkdownPreviewProps = {
  innerText: string;
  previewMode: boolean;
};

function MarkdownPreview({ innerText, previewMode }: MarkdownPreviewProps) {
  const [md, setMd] = useState('');

  useEffect(() => {
    if (previewMode) {
      const markdown: any = unified()
        .use(remarkParse)
        .use(remarkGfm)
        // @ts-ignore
        .use(remarkReact, React)
        .processSync(innerText).result;

      setMd(markdown);
    }
  }, [previewMode, innerText]);

  return (
    <StyledPreviewMarkdown style={{ display: previewMode ? 'block' : 'none' }}>
      {md}
    </StyledPreviewMarkdown>
  );
}

export default MarkdownPreview;
