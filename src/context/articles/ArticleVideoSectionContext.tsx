import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateBodyVideoCaption,
  updateBodyVideoSrc,
} from "^redux/state/articles";

import { checkObjectHasField } from "^helpers/general";

import { VideoSection } from "^types/article-like-entity";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ArticleVideoSectionSlice() {}

const actionsInitial = {
  updateBodyVideoCaption,
  updateBodyVideoSrc,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: VideoSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

ArticleVideoSectionSlice.Provider = function ArticleVideoSectionProvider({
  children,
  translationId,
  articleId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  articleId: string;
  section: VideoSection;
}) {
  const { id: sectionId } = section;

  const sharedArgs = {
    id: articleId,
    translationId,
    sectionId,
  };

  const dispatch = useDispatch();

  const actions: Actions = {
    updateBodyVideoCaption: (args) =>
      dispatch(updateBodyVideoCaption({ ...sharedArgs, ...args })),
    updateBodyVideoSrc: (args) =>
      dispatch(updateBodyVideoSrc({ ...sharedArgs, ...args })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

ArticleVideoSectionSlice.useContext = function useArticleVideoSectionContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useArticleVideoSectionContext must be used within its provider!"
    );
  }
  return context;
};
