import type { NextPage } from "next";

import { CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import HandleRouteValidity from "^components/primary-content-item-page/HandleRouteValidity";

import PageContent from "^components/pages/curated/document/article";

// todo: nice green #2bbc8a

const ArticlePage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.ARTICLES,
          CollectionKey.AUTHORS,
          CollectionKey.COLLECTIONS,
          CollectionKey.IMAGES,
          CollectionKey.LANGUAGES,
          CollectionKey.SUBJECTS,
          CollectionKey.TAGS,
        ]}
      >
        <HandleRouteValidity entityType="article">
          <PageContent />
        </HandleRouteValidity>
      </QueryDatabase>
    </>
  );
};

export default ArticlePage;
