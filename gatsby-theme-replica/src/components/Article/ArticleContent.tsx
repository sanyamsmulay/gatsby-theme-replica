import { MDXProvider } from '@mdx-js/react';
import React, { FC } from 'react';


// export interface Props {
//   excerpt: string;
// }

const ArticleContent: FC<any> = ({ children }) => (
  <article className={`border-b md:border md:rounded-b-md md:px-8 md:py-4`}>
    <MDXProvider>{children}</MDXProvider>
  </article>
);

export default ArticleContent;
