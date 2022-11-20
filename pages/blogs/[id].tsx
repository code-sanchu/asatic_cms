import type { NextPage } from "next";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import HandleRouteValidity from "^components/primary-content-item-page/HandleRouteValidity";

import PageContent from "^components/pages/curated/blog";

const BlogPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.BLOGS,
          Collection.AUTHORS,
          Collection.COLLECTIONS,
          Collection.IMAGES,
          Collection.LANGUAGES,
          Collection.SUBJECTS,
          Collection.TAGS,
        ]}
      >
        <HandleRouteValidity entityType="blog">
          <PageContent />
        </HandleRouteValidity>
      </QueryDatabase>
    </>
  );
};

export default BlogPage;
