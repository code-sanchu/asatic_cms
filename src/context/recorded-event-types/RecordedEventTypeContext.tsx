import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField, mapLanguageIds } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import {
  addTranslation,
  removeOne,
  updateName,
  addRecordedEventRelation,
  removeRecordedEventRelation,
  removeTranslation,
} from "^redux/state/recordedEventsTypes";
import { RecordedEventType } from "^types/recordedEventType";

import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function RecordedEventTypeSlice() {}

const actionsInitial = {
  addTranslation,
  removeOne,
  updateName,
  addRecordedEventRelation,
  removeRecordedEventRelation,
  removeTranslation,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [
  RecordedEventType & {
    languagesIds: string[];
  },
  Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

RecordedEventTypeSlice.Provider = function RecordedEventTypeProvider({
  recordedEventType,
  children,
}: {
  recordedEventType: RecordedEventType;
  children: ReactElement | ((contextValue: ContextValue) => ReactElement);
}) {
  const { id, translations } = recordedEventType;
  const languagesIds = mapLanguageIds(translations);

  const dispatch = useDispatch();

  const actions: Actions = {
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    removeTranslation: (args) => dispatch(removeTranslation({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    updateName: (args) => dispatch(updateName({ id, ...args })),
    addRecordedEventRelation: (args) =>
      dispatch(addRecordedEventRelation({ id, ...args })),
    removeRecordedEventRelation: (args) =>
      dispatch(removeRecordedEventRelation({ id, ...args })),
  };

  return (
    <Context.Provider value={[{ ...recordedEventType, languagesIds }, actions]}>
      {typeof children === "function"
        ? children([{ ...recordedEventType, languagesIds }, actions])
        : children}
    </Context.Provider>
  );
};

RecordedEventTypeSlice.useContext = function useRecordedEventTypeContext() {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useRecordedEventTypeContext must be used within its provider!"
    );
  }
  return context;
};
