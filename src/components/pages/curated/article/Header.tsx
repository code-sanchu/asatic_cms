import ArticleSlice from "^context/articles/ArticleContext";

import useArticlePageSaveUndo from "^hooks/pages/useArticlePageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import $Header_ from "../_presentation/$Header_";
import { $SaveText_, UndoButton_, SaveButton_ } from "^components/header";
import DocLanguages from "^components/DocLanguages";
import {
  HeaderAuthorsPopover_,
  HeaderCollectionsPopover_,
  HeaderEntityPageSettingsPopover_,
  HeaderPublishPopover_,
  HeaderSubectsPopover_,
  HeaderTagsPopover_,
} from "^components/header/popovers";
import useDeleteArticle from "^hooks/articles/useDeleteArticle";
import { useDeleteArticleMutation } from "^redux/services/articles";

const entityType = "article";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useArticlePageSaveUndo();

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
      subjectsPopover={<SubjectsPopover />}
      undoButton={
        <UndoButton_
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
          undo={undo}
        />
      }
      authorsPopover={<AuthorsPopover />}
      collectionsPopover={<CollectionsPopover />}
      tagsPopover={<TagsPopover />}
    />
  );
};

export default Header;

const PublishPopover = () => {
  const [{ publishStatus }, { togglePublishStatus }] =
    ArticleSlice.useContext();

  return (
    <HeaderPublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    />
  );
};

const LanguagesPopover = () => {
  const [, { addTranslation, removeTranslation }] = ArticleSlice.useContext();

  return (
    <DocLanguages.Popover
      docType={entityType}
      addLanguageToDoc={(languageId) => addTranslation({ languageId })}
      removeLanguageFromDoc={(languageId) => removeTranslation({ languageId })}
    />
  );
};

const SubjectsPopover = () => {
  const [{ id, languagesIds, subjectsIds }, { addSubject, removeSubject }] =
    ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderSubectsPopover_
      parentData={{
        activeLanguageId,
        subjectsIds,
        languagesIds,
        type: entityType,
        id,
      }}
      parentActions={{
        addSubjectToParent: (subjectId) => addSubject({ subjectId }),
        removeSubjectFromParent: (subjectId) => removeSubject({ subjectId }),
      }}
    />
  );
};

const CollectionsPopover = () => {
  const [
    { id, languagesIds, collectionsIds },
    { addCollection, removeCollection },
  ] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderCollectionsPopover_
      parentData={{
        activeLanguageId,
        parentCollectionsIds: collectionsIds,
        parentLanguagesIds: languagesIds,
        parentType: entityType,
        id,
      }}
      parentActions={{
        addCollectionToParent: (collectionId) =>
          addCollection({ collectionId }),
        removeCollectionFromParent: (collectionId) =>
          removeCollection({ collectionId }),
      }}
    />
  );
};

const AuthorsPopover = () => {
  const [{ id, authorsIds, languagesIds }, { addAuthor, removeAuthor }] =
    ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderAuthorsPopover_
      parentData={{
        activeLanguageId,
        parentAuthorsIds: authorsIds,
        parentLanguagesIds: languagesIds,
        parentType: entityType,
        id,
      }}
      parentActions={{
        addAuthorToParent: (authorId) => addAuthor({ authorId }),
        removeAuthorFromParent: (authorId) => removeAuthor({ authorId }),
      }}
    />
  );
};

const TagsPopover = () => {
  const [{ id, tagsIds }, { addTag, removeTag }] = ArticleSlice.useContext();

  return (
    <HeaderTagsPopover_
      parentData={{
        id,
        parentTagsIds: tagsIds,
        parentType: entityType,
      }}
      parentActions={{
        addTagToParent: (tagId) => addTag({ tagId }),
        removeTagFromParent: (tagId) => removeTag({ tagId }),
      }}
    />
  );
};

const SettingsPopover = () => {
  const [{ id, authorsIds, collectionsIds, subjectsIds, tagsIds }] =
    ArticleSlice.useContext();
  const [deleteArticleFromDb] = useDeleteArticleMutation();
  const deleteArticle = useDeleteArticle({
    articleId: id,
    authorsIds,
    collectionsIds,
    subjectsIds,
    tagsIds,
    deleteArticleFromDb,
  });

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={deleteArticle}
      entityType={entityType}
    />
  );
};