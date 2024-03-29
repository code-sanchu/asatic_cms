import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateBodyImageCaption,
  updateBodyImageSrc,
  updateBodyImageVertPosition,
  updateBodyImageAspectRatio,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { ImageSection } from "^types/article-like-entity";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ArticleImageSectionSlice() {}

const actionsInitial = {
  updateBodyImageCaption,
  updateBodyImageSrc,
  updateBodyImageVertPosition,
  updateBodyImageAspectRatio,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: ImageSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

ArticleImageSectionSlice.Provider = function ArticleImageSectionProvider({
  children,
  translationId,
  articleId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  articleId: string;
  section: ImageSection;
}) {
  const { id: sectionId } = section;

  const sharedArgs = {
    id: articleId,
    translationId,
    sectionId,
  };

  const dispatch = useDispatch();

  const actions: Actions = {
    updateBodyImageCaption: (args) =>
      dispatch(updateBodyImageCaption({ ...sharedArgs, ...args })),
    updateBodyImageSrc: (args) =>
      dispatch(updateBodyImageSrc({ ...sharedArgs, ...args })),
    updateBodyImageVertPosition: (args) =>
      dispatch(updateBodyImageVertPosition({ ...sharedArgs, ...args })),
    updateBodyImageAspectRatio: (args) =>
      dispatch(updateBodyImageAspectRatio({ ...sharedArgs, ...args })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

ArticleImageSectionSlice.useContext = function useArticleImageSectionContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleImageSectionContext must be used within its provider!"
    );
  }
  return context;
};
