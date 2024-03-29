import { useSelector } from "^redux/hooks";
import { selectArticlesByLanguageAndQuery } from "^redux/state/complex-selectors/article";

import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { orderDisplayContent } from "^helpers/displayContent";

import ArticleProviders from "^components/_containers/articles/ProvidersWithOwnLanguages";
import Table_ from "^components/display-entities-table/Table";
import {
  TitleCell,
  EntitiesPageActionsCell,
  StatusCell,
  AuthorsCell,
  SubjectsCell,
  CollectionsCell,
  TagsCell,
  LanguagesCell,
} from "^components/display-entities-table/Cells";
import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect, {
  allLanguageId,
} from "^components/FilterLanguageSelect";
import { useEntityLanguageContext } from "^context/EntityLanguages";

import { useDeleteMutationContext } from "../DeleteMutationContext";
import useUpdateStoreRelatedEntitiesOnDelete from "^hooks/articles/useUpdateStoreRelatedEntitiesOnDelete";

export default function Table() {
  const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const filtered = useSelector((state) =>
    selectArticlesByLanguageAndQuery(state, { languageId, query })
  );
  const ordered = orderDisplayContent(filtered);

  return (
    <Table_
      columns={[
        "Title",
        "Actions",
        "Status",
        "Translations",
        "Authors",
        "Subjects",
        "Collections",
        "Tags",
      ]}
      isContent={Boolean(ordered.length)}
      isFilter={isFilter}
    >
      {ordered.map((article) => (
        <ArticleProviders article={article} key={article.id}>
          <ArticleTableRow />
        </ArticleProviders>
      ))}
    </Table_>
  );
}

const ArticleTableRow = () => {
  const [
    {
      id: articleId,
      status,
      subjectsIds,
      tagsIds,
      languagesIds,
      publishDate,
      authorsIds,
      collectionsIds,
    },
    { routeToEditPage },
  ] = ArticleSlice.useContext();
  const [{ title }] = ArticleTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const [deleteArticleFromDb] = useDeleteMutationContext();
  const updateStoreRelatedEntitiesOnDelete =
    useUpdateStoreRelatedEntitiesOnDelete();

  const handleDelete = async () => {
    await deleteArticleFromDb({
      id: articleId,
      subEntities: { authorsIds, collectionsIds, subjectsIds, tagsIds },
      useToasts: false,
    });
    updateStoreRelatedEntitiesOnDelete();
  };

  return (
    <>
      <TitleCell status={status} title={title} />
      <EntitiesPageActionsCell
        deleteEntity={handleDelete}
        entityType="article"
        routeToEditPage={routeToEditPage}
      />
      <StatusCell status={status} publishDate={publishDate} />
      <LanguagesCell
        activeLanguageId={activeLanguageId}
        languagesIds={languagesIds}
        setActiveLanguageId={updateActiveLanguage}
      />
      <AuthorsCell
        authorsIds={authorsIds}
        activeLanguageId={activeLanguageId}
      />
      <SubjectsCell subjectsIds={subjectsIds} />
      <CollectionsCell collectionsIds={collectionsIds} />
      <TagsCell tagsIds={tagsIds} />
    </>
  );
};
