import { useSaveArticlePageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  undoOne as undoArticle,
  selectArticleById as selectArticleById,
  updateSaveDate as updateArticleSaveDate,
} from "^redux/state/articles";
import {
  selectAuthors as selectAuthors,
  overWriteAll as overWriteAuthors,
} from "^redux/state/authors";
import {
  selectCollections as selectCollections,
  undoAll as undoCollections,
} from "^redux/state/collections";
import {
  selectLanguages,
  overWriteAll as overWriteLanguages,
} from "^redux/state/languages";
import {
  selectSubjects as selectSubjects,
  overWriteAll as overWriteSubjects,
} from "^redux/state/subjects";
import { selectTags, overWriteAll as overWriteTags } from "^redux/state/tags";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";
import useTopControlsForSingle from "^hooks/useTopControlsForSingle";
import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useTopControlsForImages from "^hooks/useTopControlsForImages";

const useArticlePageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveArticlePageMutation();
  const saveId = saveMutationData.requestId;

  const articleId = useGetSubRouteId();

  const article = useSelector((state) => selectArticleById(state, articleId))!;
  const authors = useSelector(selectAuthors);
  const collections = useSelector(selectCollections);
  const languages = useSelector(selectLanguages);
  const subjects = useSelector(selectSubjects);
  const tags = useSelector(selectTags);

  const dispatch = useDispatch();
  const docTopControlMappings = {
    article: useTopControlsForSingle({
      currentData: article,
      onUndo: (previousData) => dispatch(undoArticle(previousData)),
      saveId,
    }),
    authors: useTopControlsForCollection({
      currentData: authors,
      onUndo: (previousData) =>
        dispatch(overWriteAuthors({ data: previousData })),
      saveId,
    }),
    collections: useTopControlsForCollection({
      currentData: collections,
      onUndo: (previousData) => dispatch(undoCollections(previousData)),
      saveId,
    }),
    images: useTopControlsForImages({
      saveId,
    }),
    languages: useTopControlsForCollection({
      currentData: languages,
      onUndo: (previousData) =>
        dispatch(overWriteLanguages({ data: previousData })),
      saveId,
    }),
    subjects: useTopControlsForCollection({
      currentData: subjects,
      onUndo: (previousData) => dispatch(overWriteSubjects(previousData)),
      saveId,
    }),
    tags: useTopControlsForCollection({
      currentData: tags,
      onUndo: (previousData) => dispatch(overWriteTags({ data: previousData })),
      saveId,
    }),
  };

  const saveDate = new Date();
  const saveData = {
    article: {
      ...article,
      lastSave: saveDate,
    },
    authors: docTopControlMappings.authors.saveData,
    collections: docTopControlMappings.collections.saveData,
    images: docTopControlMappings.images.saveData,
    languages: docTopControlMappings.languages.saveData,
    subjects: docTopControlMappings.subjects.saveData,
    tags: docTopControlMappings.tags.saveData,
  };

  const topControlArr = Object.values(docTopControlMappings);
  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const handleSave = () => {
    if (!isChange) {
      return;
    }
    dispatch(updateArticleSaveDate({ id: articleId, date: saveDate }));
    saveToDatabase(saveData);
  };

  const handleUndo = () => {
    if (!isChange) {
      return;
    }
    topControlArr.forEach((obj) => obj.handleUndo());
  };

  return {
    isChange,
    handleSave,
    handleUndo,
    saveMutationData,
  };
};

export default useArticlePageTopControls;
