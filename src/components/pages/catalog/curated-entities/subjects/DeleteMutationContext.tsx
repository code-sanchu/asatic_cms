import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";
import { useDeleteSubjectMutation } from "^redux/services/subjects";
import { Mutation } from "^types/mutation";

type Value = [ReturnType<typeof useDeleteSubjectMutation>[0], Mutation[1]];

const Context = createContext<Value>({} as Value);

const DeleteMutationProvider = ({ children }: { children: ReactElement }) => {
  const [deleteFromDb, { isError, isLoading, isSuccess }] =
    useDeleteSubjectMutation();

  return (
    <Context.Provider value={[deleteFromDb, { isError, isLoading, isSuccess }]}>
      {children}
    </Context.Provider>
  );
};

const useDeleteMutationContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[1]);
  if (!contextIsPopulated) {
    throw new Error(
      "useDeleteMutationContext must be used within its provider!"
    );
  }
  return context;
};

export { DeleteMutationProvider, useDeleteMutationContext };
