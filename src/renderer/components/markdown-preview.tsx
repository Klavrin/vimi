import { createElement, Fragment, useEffect, useState } from 'react';
import * as prod from 'react/jsx-runtime';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeReact from 'rehype-react';
import rehypeHighlight from 'rehype-highlight';

import useDebounce from '../utils/use-debounce';

import StyledPreviewMarkdown from './styles/preview-markdown.styled';

type MarkdownPreviewProps = {
  innerText: string;
  previewMode: boolean;
};

type Production = {
  Fragment: typeof Fragment;
  jsx: any;
  jsxs: any;
};
const production: Production = {
  Fragment: prod.Fragment,
  jsx: prod.jsx,
  jsxs: prod.jsxs,
};

function MarkdownPreview({ innerText, previewMode }: MarkdownPreviewProps) {
  const [md, setMd] = useState(createElement(Fragment));
  const debouncedValue = useDebounce(innerText, 400);

  useEffect(() => {
    const processor: any = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .use(rehypeReact, production)
      .processSync(innerText);
    setMd(processor.result);
  }, [debouncedValue]);

  return (
    <StyledPreviewMarkdown style={{ display: previewMode ? 'block' : 'none' }}>
      {md}
    </StyledPreviewMarkdown>
  );
}

export default MarkdownPreview;
