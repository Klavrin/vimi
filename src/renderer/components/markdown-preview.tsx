import { createElement, Fragment, useEffect, useState } from 'react';
import * as prod from 'react/jsx-runtime';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeReact from 'rehype-react';

import StyledPreviewMarkdown from './styles/preview-markdown.styled';

type MarkdownPreviewProps = {
  innerText: string;
  previewMode: boolean;
};

type Production = { Fragment: any; jsx: any; jsxs: any };
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

function MarkdownPreview({ innerText, previewMode }: MarkdownPreviewProps) {
  const [md, setMd] = useState(createElement(Fragment));
  const [timeoutId, setTimeoutId] = useState<any>(null);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    const timeout = setTimeout(() => {
      (() => {
        (async () => {
          const processor: any = unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeStringify)
            .use(rehypeReact, production as Production)
            .processSync(innerText);

          setMd(processor.result);
        })();
      })();
    }, 400);

    setTimeoutId(timeout);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [innerText]); // ?

  return (
    <StyledPreviewMarkdown style={{ display: previewMode ? 'block' : 'none' }}>
      {md}
    </StyledPreviewMarkdown>
  );
}

export default MarkdownPreview;
