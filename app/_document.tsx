'use client';

import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';


class MyDocument extends Document {
  'use client';

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
