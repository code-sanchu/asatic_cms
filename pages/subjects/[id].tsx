import { NextPage } from "next";

import { CollectionKey as CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import HandleRouteValidity from "^components/primary-content-item-page/HandleRouteValidity";
import PageContent from "^components/pages/curated/collection-of-documents/subject";
// import PageContent from "^components/pages/curated/subject";

const CollectionPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.ARTICLES,
          CollectionKey.AUTHORS,
          CollectionKey.BLOGS,
          CollectionKey.COLLECTIONS,
          CollectionKey.IMAGES,
          CollectionKey.LANGUAGES,
          CollectionKey.RECORDEDEVENTS,
          CollectionKey.RECORDEDEVENTTYPES,
          CollectionKey.SUBJECTS,
          CollectionKey.TAGS,
        ]}
      >
        <HandleRouteValidity entityType="subject">
          <PageContent />
        </HandleRouteValidity>
      </QueryDatabase>
    </>
  );
};

export default CollectionPage;
