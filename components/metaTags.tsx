import Head from 'next/head';
import React, { FunctionComponent } from 'react';

interface Props {
  title: string;
  description: string;
  image: string;
  largeImage: string;
  url: string;
}

const MetaTags: FunctionComponent<Props> = ({
  title,
  description,
  image,
  largeImage,
  url,
}: Props) => (
  <Head>
    <title>Restless | 2022</title>
    <meta content={title} name="title" />
    <meta content={description} name="description" />

    <meta content="website" property="og:type" />
    <meta content={`https://movielot.vercel.app${url}`} property="og:url" />
    <meta content={title} property="og:title" />
    <meta content={description} property="og:description" />
    <meta content={image} property="og:image" />

    <meta content="summary_large_image" property="twitter:card" />
    <meta
      content={`https://movielot.vercel.app${url}`}
      property="twitter:url"
    />
    <meta content={title} property="twitter:title" />
    <meta content={description} property="twitter:description" />
    <meta content={largeImage} property="twitter:image" />
  </Head>
);

export default MetaTags;
