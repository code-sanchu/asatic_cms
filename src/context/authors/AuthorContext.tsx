import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField, mapLanguageIds } from "^helpers/general";
import { useDispatch } from "^redux/hooks";

import {
  addTranslation,
  updateName,
  removeTranslation,
} from "^redux/state/authors";

import { Author } from "^types/author";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function AuthorSlice() {}

const actionsInitial = {
  addTranslation,
  removeTranslation,
  updateName,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [Author & { languagesIds: string[] }, Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

AuthorSlice.Provider = function AuthorProvider({
  author,
  children,
}: {
  author: Author;
  children: ReactElement;
}) {
  const { id, translations } = author;
  const languagesIds = mapLanguageIds(translations);

  const dispatch = useDispatch();

  const actions: Actions = {
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    removeTranslation: (args) => dispatch(removeTranslation({ id, ...args })),
    updateName: (args) => dispatch(updateName({ id, ...args })),
  };

  return (
    <Context.Provider value={[{ ...author, languagesIds }, actions]}>
      {children}
    </Context.Provider>
  );
};

AuthorSlice.useContext = function useAuthorContext() {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useAuthorContext must be used within its provider!");
  }
  return context;
};
