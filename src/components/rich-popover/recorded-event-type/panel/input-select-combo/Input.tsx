import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as createRecordedEventType,
  selectTotalRecordedEventTypes,
  removeRecordedEventRelation as removeRecordedEventRelationFromRecordedEventType,
  addRecordedEventRelation as addRecordedEventRelationToRecordedEventType,
} from "^redux/state/recordedEventsTypes";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import InputSelectCombo_ from "^components/InputSelectCombo";

const Input = () => {
  const { inputValue, setInputValue } = InputSelectCombo_.useContext();
  const [
    { id: recordedEventId, recordedEventTypeId: currentRecordedEventTypeId },
    { updateType: updateRecordedEventType },
  ] = RecordedEventSlice.useContext();
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  const recordedEventTypes = useSelector(selectTotalRecordedEventTypes);

  const dispatch = useDispatch();

  const handleCreateType = () => {
    const typeId = generateUId();
    dispatch(
      createRecordedEventType({
        id: typeId,
        translation: { languageId, name: inputValue },
      })
    );
    updateRecordedEventType({ typeId });

    dispatch(
      addRecordedEventRelationToRecordedEventType({
        id: typeId,
        recordedEventId,
      })
    );
    if (currentRecordedEventTypeId) {
      dispatch(
        removeRecordedEventRelationFromRecordedEventType({
          id: currentRecordedEventTypeId,
          recordedEventId,
        })
      );
    }
    setInputValue("");
  };

  return (
    <InputSelectCombo_.Input
      placeholder={
        recordedEventTypes
          ? "Search for a video type or enter a new one"
          : "Enter first video type"
      }
      onSubmit={() => {
        const inputValueIsValid = inputValue.length > 1;
        if (!inputValueIsValid) {
          return;
        }
        handleCreateType();
      }}
      languageId={languageId}
    />
  );
};

export default Input;
