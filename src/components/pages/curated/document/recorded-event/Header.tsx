import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import useRecordedEventPageSaveUndo from "^hooks/pages/useRecordedEventPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import $Header_ from "../_presentation/$Header_";
import { $SaveText_, UndoButton_, SaveButton_ } from "^components/header";
import {
  HeaderAuthorsPopover_,
  // HeaderCollectionsPopover_,
  HeaderEntityLanguagePopover_,
  HeaderEntityPageSettingsPopover_,
  HeaderPublishPopover_,
  // HeaderSubectsPopover_,
  HeaderTagsPopover_,
} from "^components/header/popovers";
import { EntityName } from "^types/entity";
import { useEntityLanguageContext } from "^context/EntityLanguages";
import useDeleteRecordedEventFromStoreAnduUpdateStore from "^hooks/recorded-events/useDeleteFromDbAndUpdateStore";

const entityName: EntityName = "recordedEvent";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useRecordedEventPageSaveUndo();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <$Header_
      entityLanguagesPopover={<LanguagesPopover />}
      publishPopover={<PublishPopover />}
      saveButton={
        <SaveButton_
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
          save={save}
        />
      }
      saveText={
        <$SaveText_ isChange={isChange} saveMutationData={saveMutationData} />
      }
      settingsPopover={<SettingsPopover />}
      // subjectsPopover={<SubjectsPopover />}
      undoButton={
        <UndoButton_
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
          undo={undo}
        />
      }
      authorsPopover={<AuthorsPopover />}
      // collectionsPopover={<CollectionsPopover />}
      tagsPopover={<TagsPopover />}
    />
  );
};

export default Header;

const PublishPopover = () => {
  const [{ publishStatus }, { togglePublishStatus }] =
    RecordedEventSlice.useContext();

  return (
    <HeaderPublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    />
  );
};

const LanguagesPopover = () => {
  const [{ languagesIds }, { addTranslation, removeTranslation }] =
    RecordedEventSlice.useContext();

  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const handleRemoveTranslation = (languageId: string) => {
    if (languagesIds.length < 2) {
      return;
    }
    if (languageId === activeLanguageId) {
      updateActiveLanguage(
        languagesIds.filter((languageId) => languageId !== activeLanguageId)[0]
      );
    }
    removeTranslation({ languageId });
  };

  return (
    <HeaderEntityLanguagePopover_
      parentEntity={{
        addTranslation: (languageId) =>
          addTranslation({ translation: { languageId } }),
        removeTranslation: handleRemoveTranslation,
        name: "collection",
        languagesIds,
      }}
    />
  );
};

/* const SubjectsPopover = () => {
  const [
    { id, languagesIds, subjectsIds },
    {
      addRelatedEntity: addRelatedEntityToRecordedEvent,
      removeRelatedEntity: removeRelatedEntityFromRecordedEvent,
    },
  ] = RecordedEventSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  return (
    <HeaderSubectsPopover_
      parentEntity={{
        activeLanguageId,
        addSubject: (subjectId) =>
          addRelatedEntityToRecordedEvent({
            relatedEntity: { id: subjectId, name: "subject" },
          }),
        id,
        name: entityName,
        removeSubject: (subjectId) =>
          removeRelatedEntityFromRecordedEvent({
            relatedEntity: { id: subjectId, name: "subject" },
          }),
        subjectIds: subjectsIds,
        translationLanguagesIds: languagesIds,
      }}
    />
  );
}; */

/* const CollectionsPopover = () => {
  const [
    { id, languagesIds, collectionsIds },
    {
      addRelatedEntity: addRelatedEntityToRecordedEvent,
      removeRelatedEntity: removeRelatedEntityFromRecordedEvent,
    },
  ] = RecordedEventSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  return (
    <HeaderCollectionsPopover_
      parentEntity={{
        activeLanguageId,
        addCollection: (collectionId) =>
          addRelatedEntityToRecordedEvent({
            relatedEntity: { id: collectionId, name: "collection" },
          }),
        removeCollection: (collectionId) =>
          removeRelatedEntityFromRecordedEvent({
            relatedEntity: { id: collectionId, name: "collection" },
          }),
        collectionsIds,
        id,
        name: entityName,
        translationLanguagesIds: languagesIds,
      }}
    />
  );
}; */

const AuthorsPopover = () => {
  const [
    { id, authorsIds, languagesIds },
    {
      addRelatedEntity: addRelatedEntityToRecordedEvent,
      removeRelatedEntity: removeRelatedEntityFromRecordedEvent,
    },
  ] = RecordedEventSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  return (
    <HeaderAuthorsPopover_
      parentEntity={{
        activeLanguageId,
        addAuthor: (authorId) =>
          addRelatedEntityToRecordedEvent({
            relatedEntity: { id: authorId, name: "author" },
          }),
        authorsIds,
        id,
        name: entityName,
        removeAuthor: (authorId) =>
          removeRelatedEntityFromRecordedEvent({
            relatedEntity: { id: authorId, name: "author" },
          }),
        translationLanguagesIds: languagesIds,
      }}
    />
  );
};

const TagsPopover = () => {
  const [
    { id, tagsIds },

    {
      addRelatedEntity: addRelatedEntityToRecordedEvent,
      removeRelatedEntity: removeRelatedEntityFromRecordedEvent,
    },
  ] = RecordedEventSlice.useContext();

  return (
    <HeaderTagsPopover_
      parentEntity={{
        addTag: (tagId) =>
          addRelatedEntityToRecordedEvent({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        removeTag: (tagId) =>
          removeRelatedEntityFromRecordedEvent({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        id,
        name: entityName,
        tagsIds,
      }}
    />
  );
};

const SettingsPopover = () => {
  const handleDelete = useDeleteRecordedEventFromStoreAnduUpdateStore();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={handleDelete}
      entityType={entityName}
    />
  );
};
