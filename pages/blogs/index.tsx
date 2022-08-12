import type { NextPage } from "next";
import { ReactElement } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";
import {
  FileText as FileTextIcon,
  Info as InfoIcon,
  Trash as TrashIcon,
} from "phosphor-react";

import {
  useCreateBlogMutation,
  useDeleteBlogMutation,
} from "^redux/services/blogs";

import { useSelector } from "^redux/hooks";
import { selectEntitiesByIds as selectTagEntitiesByIds } from "^redux/state/tags";
import { selectById as selectLanguageById } from "^redux/state/languages";
import { selectById as selectAuthorById } from "^redux/state/authors";
import { selectById as selectSubjectById } from "^redux/state/subjects";
import { selectById as selectCollectionById } from "^redux/state/collections";
import { selectAll } from "^redux/state/blogs";

import { QueryProvider, useQueryContext } from "^context/QueryContext";
import {
  LanguageSelectProvider,
  useLanguageSelectContext,
} from "^context/LanguageSelectContext";
import { BlogProvider, useBlogContext } from "^context/blogs/BlogContext";
import {
  SelectLanguageProvider,
  useSelectLanguageContext,
} from "^context/SelectLanguageContext";
import {
  useWriteMutationContext,
  WriteMutationProvider,
} from "^context/WriteMutationContext";
import {
  DeleteMutationProvider,
  useDeleteMutationContext,
} from "^context/DeleteMutationContext";
import {
  BlogTranslationProvider,
  useBlogTranslationContext,
} from "^context/blogs/BlogTranslationContext";

import useFuzzySearchPrimaryContent from "^hooks/useFuzzySearchPrimaryContent";
import useBlogStatus from "^hooks/useBlogStatus";
import useMutationText from "^hooks/useMutationText";

import { filterDocsByLanguageId, formatDateTimeAgo } from "^helpers/general";

import { ROUTES } from "^constants/routes";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import { Author as AuthorType } from "^types/author";
import { Subject as SubjectType } from "^types/subject";
import { Collection as CollectionType } from "^types/collection";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import HeaderGenericUI from "^components/header/HeaderGeneric2";
import MissingText from "^components/MissingText";
import LanguageSelectInitial from "^components/LanguageSelect";
import MutationTextUI from "^components/primary-content-items-page/MutationTextUI";
import PageWrapperUI from "^components/primary-content-items-page/PageWrapperUI";
import CreateButtonUI from "^components/primary-content-items-page/CreateButtonUI";
import MainUI from "^components/primary-content-items-page/MainUI";
import FiltersUI from "^components/FiltersUI";
import SearchUI from "^components/SearchUI";
import TableUI from "^components/primary-content-items-page/table/TableUI";
import CellContainerUI from "^components/primary-content-items-page/table/CellContainerUI";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import MapSubContentUI from "^components/primary-content-items-page/table/MapSubContentUI";
import { ContentMenuButton } from "^components/menus/Content";
import StatusUI from "^components/primary-content-items-page/table/StatusUI";

const BlogsPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.AUTHORS,
          CollectionKey.BLOGS,
          CollectionKey.COLLECTIONS,
          CollectionKey.LANGUAGES,
          CollectionKey.SUBJECTS,
          CollectionKey.TAGS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default BlogsPage;

const PageContent = () => (
  <PageWrapperUI>
    <MutationProviders>
      <Header />
      <Main />
    </MutationProviders>
  </PageWrapperUI>
);

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const writeMutation = useCreateBlogMutation();
  const deleteMutation = useDeleteBlogMutation();

  return (
    <WriteMutationProvider mutation={writeMutation}>
      <DeleteMutationProvider mutation={deleteMutation}>
        <>{children}</>
      </DeleteMutationProvider>
    </WriteMutationProvider>
  );
};

const Header = () => (
  <HeaderGenericUI
    leftElements={<MutationText />}
    confirmBeforeLeavePage={false}
  />
);

const MutationText = () => {
  const [, createMutationData] = useWriteMutationContext();
  const [, deleteMutationData] = useDeleteMutationContext();

  const { isError, isLoading, isSuccess, mutationType } = useMutationText({
    createMutationData,
    deleteMutationData,
  });

  return (
    <MutationTextUI
      mutationData={{ isError, isLoading, isSuccess }}
      mutationType={mutationType}
    />
  );
};

const Main = () => (
  <MainUI
    createButton={<CreateButton />}
    filtersAndTable={<FiltersAndTable />}
    title="Blogs"
  />
);

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <CreateButtonUI docType="blog" onClick={writeToDb} />;
};

const FilterProviders = ({ children }: { children: ReactElement }) => (
  <QueryProvider>
    <LanguageSelectProvider>{children}</LanguageSelectProvider>
  </QueryProvider>
);

const FiltersAndTable = () => (
  <FilterProviders>
    <>
      <FiltersUI languageSelect={<LanguageSelect />} search={<Search />} />
      <Table />
    </>
  </FilterProviders>
);

const Search = () => {
  const { query, setQuery } = useQueryContext();

  return (
    <SearchUI
      onQueryChange={setQuery}
      placeholder="search by title, subject, etc."
      query={query}
    />
  );
};

const LanguageSelect = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguageSelectContext();

  return (
    <LanguageSelectInitial
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};

const Table = () => {
  const { query } = useQueryContext();
  const { selectedLanguage } = useLanguageSelectContext();

  const blogs = useSelector(selectAll);

  const blogsFilteredByLanguage = filterDocsByLanguageId(
    blogs,
    selectedLanguage.id
  );

  const filteredBlogs = useFuzzySearchPrimaryContent(
    blogsFilteredByLanguage,
    query
  );

  const isContentPostFilter = Boolean(filteredBlogs.length);
  const isContentPreFilter = Boolean(blogs.length);

  return (
    <TableUI
      isContentPostFilter={isContentPostFilter}
      isContentPrefilter={isContentPreFilter}
    >
      <>
        {filteredBlogs.map((blog) => (
          <BlogProvider blog={blog} key={blog.id}>
            <TableRow />
          </BlogProvider>
        ))}
      </>
    </TableUI>
  );
};

const TableRow = () => {
  const [{ id, languagesById, translations }] = useBlogContext();

  return (
    <SelectLanguageProvider languagesById={languagesById}>
      {({ activeLanguageId }) => (
        <BlogTranslationProvider
          blogId={id}
          translation={
            translations.find((t) => t.languageId === activeLanguageId)!
          }
        >
          <>
            <TitleCell />
            <ActionsCell />
            <StatusCell />
            <AuthorsCell />
            <SubjectsCell />
            <CollectionsCell />
            <TagsCell />
            <LanguagesCell />
          </>
        </BlogTranslationProvider>
      )}
    </SelectLanguageProvider>
  );
};

const TitleCell = () => {
  const [blog] = useBlogContext();
  const status = useBlogStatus(blog);

  const [{ title }] = useBlogTranslationContext();

  return (
    <CellContainerUI>
      {title ? (
        title
      ) : status === "new" ? (
        "-"
      ) : (
        <MissingText tooltipText="missing title for translation" />
      )}
    </CellContainerUI>
  );
};

const ActionsCell = () => {
  const [{ id }] = useBlogContext();
  const [deleteFromDb] = useDeleteMutationContext();

  const router = useRouter();
  const routeToBlog = () => router.push(`${ROUTES.BLOGS}/${id}`);

  return (
    <CellContainerUI>
      <div css={[tw`flex gap-xs justify-center items-center`]}>
        <ContentMenuButton
          onClick={routeToBlog}
          tooltipProps={{ text: "edit blog" }}
        >
          <FileTextIcon />
        </ContentMenuButton>
        <WithWarning
          callbackToConfirm={() => deleteFromDb({ id })}
          warningText={{
            heading: "Delete blog?",
            body: "This action can't be undone.",
          }}
          width={tw`w-['20ch'] min-w-['20ch']`}
        >
          <ContentMenuButton
            tooltipProps={{ text: "delete blog", yOffset: 10 }}
          >
            <TrashIcon />
          </ContentMenuButton>
        </WithWarning>
      </div>
    </CellContainerUI>
  );
};

const StatusCell = () => {
  const [blog] = useBlogContext();

  const status = useBlogStatus(blog);

  const { date: publishDate } = blog.publishInfo;
  const publishDateFormatted = publishDate
    ? formatDateTimeAgo(publishDate)
    : null;

  return (
    <CellContainerUI>
      {status === "new" ? (
        <StatusUI colorStyles={tw`bg-blue-200 text-blue-500`}>new</StatusUI>
      ) : status === "draft" ? (
        <StatusUI colorStyles={tw`bg-gray-200 text-gray-500`}>draft</StatusUI>
      ) : status === "invalid" ? (
        <StatusUI colorStyles={tw`bg-red-200 text-red-500`}>
          <div css={[tw`flex items-center gap-xxs`]}>
            invalid
            <span css={[tw`text-gray-500`]}>
              <WithTooltip
                text={{
                  header: "Invalid Document",
                  body: `This document is published but has no valid translation. It won't be shown on the website.`,
                }}
              >
                <InfoIcon />
              </WithTooltip>
            </span>
          </div>
        </StatusUI>
      ) : typeof status === "object" ? (
        <StatusUI colorStyles={tw`bg-orange-200 text-orange-500`}>
          <div css={[tw`flex items-center gap-xxs`]}>
            errors
            <span css={[tw`text-gray-500`]}>
              <WithTooltip
                text={{
                  header: "Blog errors",
                  body: `This blog is published but has errors. It's still valid and will be shown on the website. Errors: ${status.join(
                    ", "
                  )}`,
                }}
              >
                <InfoIcon />
              </WithTooltip>
            </span>
          </div>
        </StatusUI>
      ) : (
        <StatusUI colorStyles={tw`bg-green-200 text-green-500`}>
          {`Published ${publishDateFormatted}`}
        </StatusUI>
      )}
    </CellContainerUI>
  );
};

const AuthorsCell = () => {
  const [{ authorIds }] = useBlogContext();

  return (
    <CellContainerUI>
      <MapSubContentUI
        ids={authorIds}
        subContentItem={({ id }) => <HandleAuthor id={id} />}
      />
    </CellContainerUI>
  );
};

const HandleAuthor = ({ id }: { id: string }) => {
  const author = useSelector((state) => selectAuthorById(state, id));

  return author ? (
    <Author author={author} />
  ) : (
    <SubContentMissingFromStore subContentType="author" />
  );
};

const Author = ({ author: { translations } }: { author: AuthorType }) => {
  const [activeLanguageId] = useSelectLanguageContext();

  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <>
      {translation ? (
        translation.name
      ) : (
        <MissingText tooltipText="missing author name for translation" />
      )}
    </>
  );
};

const SubjectsCell = () => {
  const [{ subjectIds }] = useBlogContext();

  return (
    <CellContainerUI>
      <MapSubContentUI
        ids={subjectIds}
        subContentItem={({ id }) => <HandleSubject id={id} />}
      />
    </CellContainerUI>
  );
};

const HandleSubject = ({ id }: { id: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, id));

  return subject ? (
    <Subject subject={subject} />
  ) : (
    <SubContentMissingFromStore subContentType="subject" />
  );
};

const Subject = ({ subject: { translations } }: { subject: SubjectType }) => {
  const [activeLanguageId] = useSelectLanguageContext();

  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <>
      {translation ? (
        translation.text
      ) : (
        <MissingText tooltipText="missing subject text for translation" />
      )}
    </>
  );
};

const CollectionsCell = () => {
  const [{ collectionIds }] = useBlogContext();

  return (
    <CellContainerUI>
      <MapSubContentUI
        ids={collectionIds}
        subContentItem={({ id }) => <HandleCollection id={id} />}
      />
    </CellContainerUI>
  );
};

const HandleCollection = ({ id }: { id: string }) => {
  const collection = useSelector((state) => selectCollectionById(state, id));

  return collection ? (
    <Collection collection={collection} />
  ) : (
    <SubContentMissingFromStore subContentType="collection" />
  );
};

const Collection = ({ collection }: { collection: CollectionType }) => {
  const [activeLanguageId] = useSelectLanguageContext();
  const { translations } = collection;
  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <>
      {translation ? (
        translation.text
      ) : (
        <MissingText tooltipText="missing collection text for translation" />
      )}
    </>
  );
};

const TagsCell = () => {
  const [{ tagIds }] = useBlogContext();
  const tags = useSelector((state) => selectTagEntitiesByIds(state, tagIds));
  const validTags = tags.flatMap((t) => (t ? [t] : []));
  const tagsToUse = validTags.slice(0, 2);
  const tagsTextArr = tagsToUse.map((t) => t.text);

  const numTags = validTags.length;
  const tagsStr = numTags
    ? `${tagsTextArr.join(", ")}${numTags > 2 && ", ..."}`
    : "-";

  return <CellContainerUI>{tagsStr}</CellContainerUI>;
};

const LanguagesCell = () => {
  const [activeLanguageId, { setActiveLanguageId }] =
    useSelectLanguageContext();
  const [{ languagesById }] = useBlogContext();

  return (
    <CellContainerUI>
      <MapSubContentUI
        ids={languagesById}
        subContentItem={({ id }) => (
          <Language
            languageId={id}
            isSelected={id === activeLanguageId}
            onClick={() => setActiveLanguageId(id)}
          />
        )}
      />
    </CellContainerUI>
  );
};

const Language = ({
  isSelected,
  languageId,
  onClick,
}: {
  languageId: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return language ? (
    <WithTooltip
      text="click to show this translation"
      type="action"
      isDisabled={isSelected}
    >
      <button
        css={[isSelected && tw`border-b-2 border-green-active`]}
        onClick={onClick}
        type="button"
      >
        {language.name}
      </button>
    </WithTooltip>
  ) : (
    <SubContentMissingFromStore subContentType="language" />
  );
};