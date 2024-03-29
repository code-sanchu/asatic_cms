import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import produce from "immer";

import { createArticle } from "src/data/createDocument";

import { fetchArticles } from "^lib/firebase/firestore/fetch";
import { writeArticle } from "^lib/firebase/firestore/write/writeDocs";
import { deleteParentEntity } from "^lib/firebase/firestore/write/batchDeleteParentEntity";
import { Article as LocalArticle } from "^types/article";
import { MyOmit } from "^types/utilities";
import {
  ArticleLikeRelatedEntityTuple,
  ArticleLikeRelatedEntityUnion,
} from "^types/article-like-entity";
import { RelatedEntityFields } from "^types/entity";

type FirestoreArticle = MyOmit<LocalArticle, "lastSave" | "publishDate"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastSave: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishDate: any;
};
type FirestoreArticles = FirestoreArticle[];

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    createArticle: build.mutation<{ article: LocalArticle }, void>({
      queryFn: async () => {
        try {
          const newArticle = createArticle();
          await writeArticle(newArticle);

          return {
            data: { article: newArticle },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    deleteArticle: build.mutation<
      { id: string },
      { useToasts?: boolean } & {
        id: string;
        subEntities: RelatedEntityFields<ArticleLikeRelatedEntityUnion>;
      }
    >({
      queryFn: async ({ useToasts = true, id, subEntities }) => {
        try {
          const handleDelete = async () => {
            await deleteParentEntity<ArticleLikeRelatedEntityTuple>({
              parentEntity: { id, name: "article" },
              subEntities: [
                { name: "author", ids: subEntities.authorsIds },
                { name: "collection", ids: subEntities.collectionsIds },
                { name: "subject", ids: subEntities.subjectsIds },
                { name: "tag", ids: subEntities.tagsIds },
              ],
            });
          };
          if (useToasts) {
            toast.promise(handleDelete, {
              pending: "deleting...",
              success: "deleted",
              error: "delete error",
            });
          } else {
            handleDelete();
          }

          return {
            data: { id },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    fetchArticles: build.query<LocalArticle[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchArticles()) as
            | FirestoreArticles
            | undefined;
          const data = resData || [];

          const dataFormatted = produce(data, (draft) => {
            for (let i = 0; i < draft.length; i++) {
              const lastSave = draft[i].lastSave;
              if (lastSave) {
                draft[i].lastSave = lastSave.toDate();
              }
              draft[i].lastSave = lastSave ? lastSave.toDate() : lastSave;

              const publishDate = draft[i].publishDate;
              if (publishDate) {
                draft[i].publishDate = publishDate.toDate();
              }
            }
          }) as LocalArticle[];

          return { data: dataFormatted };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const {
  useFetchArticlesQuery,
  useCreateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;
