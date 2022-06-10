import { JSONContent } from "@tiptap/react";

import { Document, Translation } from "^types/editable_content";
import { Expand } from "./utilities";

export type ArticleTranslation = Translation & {
  body?: JSONContent;
  summary?: string;
};

export type Article = Document<ArticleTranslation> & {
  authorIds: string[];
  relatedImageIds?: string[];
  summaryImage?: {
    url: string;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type expanded = Expand<Article>;
