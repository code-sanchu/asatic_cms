import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import useCreateAuthorsDisplayString from "^hooks/authors/useCreateDisplayString";
import useCreateCollectionsDisplayString from "^hooks/collections/useCreateDisplayString";
import useCreateSubjectsDisplayString from "^hooks/subjects/useCreateDisplayString";
import useCreateTagsDisplayString from "^hooks/tags/useCreateDisplayString";
import useCreateLanguagesDisplayString from "^hooks/translationLanguages/useCreateDisplayString";

import HandleDocAuthor from "^components/handle-related-entity/Authors";
import HandleDocCollection from "^components/handle-related-entity/Collection";
import HandleDocLanguage from "^components/handle-related-entity/Language";
import ListDocSubDocItemsUI from "^components/handle-related-entity/ListItemsUI";
import { HandleEntitySubject } from "^components/_containers/handle-sub-entities";
import HandleDocTag from "^components/handle-related-entity/Tag";
import MissingText from "^components/MissingText";
import WithTooltip from "^components/WithTooltip";

import ContentMenu from "^components/menus/Content";
import { DeleteEntityIcon, EditEntityIcon } from "^components/Icons";
import StatusLabel from "^components/StatusLabel";
import { $Cell, $itemsList } from "./styles";
import { HandleRecordedEventType } from "^components/_containers/handle-sub-entities";
import { ArticleLikeStatus } from "^types/article-like-entity";
import { CollectionStatus } from "^types/collection";
import { RecordedEventStatus } from "^types/recordedEvent";
import { SubjectStatus } from "^types/subject";

const TruncateString = ({
  children,
  styles,
}: {
  children: string;
  styles?: TwStyle;
}) => {
  return (
    <WithTooltip text={children}>
      <span css={[tw`max-w-full truncate`, styles]}>{children}</span>
    </WithTooltip>
  );
};

// todo: truncate does anytihng with ReactElements?
function TruncateEntities({
  children,
  entitiesStr,
}: {
  children: ReactElement;
  entitiesStr: string;
}) {
  return (
    <WithTooltip text={entitiesStr}>
      <div css={[tw`max-w-full truncate`]}>{children}</div>
    </WithTooltip>
  );
}

type DisplayEntityStatus =
  | ArticleLikeStatus
  | CollectionStatus
  | RecordedEventStatus
  | SubjectStatus;

export const TitleCell = ({
  status,
  title,
}: {
  status: DisplayEntityStatus;
  title: string | undefined;
}) => {
  return (
    <$Cell>
      {title ? (
        <TruncateString styles={tw`w-full`}>{title}</TruncateString>
      ) : status === "new" ? (
        "-"
      ) : (
        <MissingText tooltipText="missing title for translation" />
      )}
    </$Cell>
  );
};

export const EntityTypeCell = ({ children }: { children: ReactElement }) => (
  <$Cell>{children}</$Cell>
);

export function StatusCell({
  publishDate,
  status,
}: {
  publishDate: Date | undefined | null;
  status: DisplayEntityStatus;
}) {
  return (
    <$Cell>
      <StatusLabel publishDate={publishDate} status={status} />
    </$Cell>
  );
}

export const AuthorsCell = ({
  activeLanguageId,
  authorsIds,
}: {
  activeLanguageId: string;
  authorsIds: string[];
}) => {
  const authorsStr = useCreateAuthorsDisplayString({
    activeLanguageId,
    authorsIds,
  });

  return (
    <$Cell>
      {authorsIds.length ? (
        <TruncateEntities entitiesStr={authorsStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {authorsIds.map((authorId) => (
              <HandleDocAuthor
                docActiveLanguageId={activeLanguageId}
                authorId={authorId}
                key={authorId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
  );
};

export const SubjectsCell = ({ subjectsIds }: { subjectsIds: string[] }) => {
  const subjectsStr = useCreateSubjectsDisplayString({
    subjectsIds,
  });

  return (
    <$Cell>
      {subjectsIds.length ? (
        <TruncateEntities entitiesStr={subjectsStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {subjectsIds.map((subjectId) => (
              <HandleEntitySubject subjectId={subjectId} key={subjectId} />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
  );
};

export const CollectionsCell = ({
  collectionsIds,
}: {
  collectionsIds: string[];
}) => {
  const collectionsStr = useCreateCollectionsDisplayString({
    collectionsIds,
  });

  return (
    <$Cell>
      {collectionsIds.length ? (
        <TruncateEntities entitiesStr={collectionsStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {collectionsIds.map((collectionId) => (
              <HandleDocCollection
                collectionId={collectionId}
                key={collectionId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
  );
};

export const TagsCell = ({ tagsIds }: { tagsIds: string[] }) => {
  const tagsStr = useCreateTagsDisplayString({ tagsIds });

  return (
    <$Cell>
      {tagsIds.length ? (
        <TruncateEntities entitiesStr={tagsStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {tagsIds.map((tagId) => (
              <HandleDocTag tagId={tagId} key={tagId} />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
  );
};

export const LanguagesCell = ({
  languagesIds,
  activeLanguageId,
  setActiveLanguageId,
}: {
  activeLanguageId: string;
  languagesIds: string[];
  setActiveLanguageId: (languageId: string) => void;
}) => {
  const languagesStr = useCreateLanguagesDisplayString({ languagesIds });

  return (
    <$Cell>
      {languagesIds.length ? (
        <TruncateEntities entitiesStr={languagesStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {languagesIds.map((languageId) => (
              <Language
                activeLanguageId={activeLanguageId}
                languageId={languageId}
                setActiveLanguageId={setActiveLanguageId}
                key={languageId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
  );
};

export const LanguageCell = ({ languageId }: { languageId: string }) => {
  const languagesStr = useCreateLanguagesDisplayString({
    languagesIds: [languageId],
  });

  return (
    <$Cell>
      <TruncateEntities entitiesStr={languagesStr}>
        <HandleDocLanguage languageId={languageId} />
      </TruncateEntities>
    </$Cell>
  );
};

const Language = ({
  languageId,
  activeLanguageId,
  setActiveLanguageId,
}: {
  activeLanguageId: string;
  languageId: string;
  setActiveLanguageId: (languageId: string) => void;
}) => {
  const isSelected = languageId === activeLanguageId;

  return (
    <WithTooltip
      text="click to show this translation"
      isDisabled={isSelected}
      type="action"
    >
      <button
        css={[isSelected && tw`border-b-2 border-green-active`]}
        onClick={() => setActiveLanguageId(languageId)}
        type="button"
      >
        <HandleDocLanguage languageId={languageId} />
      </button>
    </WithTooltip>
  );
};

export const EntitiesPageActionsCell = ({
  deleteEntity,
  routeToEditPage,
  entityType,
}: {
  routeToEditPage: () => void;
  deleteEntity: () => void;
  entityType: string;
}) => {
  return (
    <$Cell>
      <div css={[tw`flex items-center gap-xs`]}>
        <ContentMenu.Button
          onClick={routeToEditPage}
          tooltipProps={{ text: "edit document" }}
        >
          <EditEntityIcon />
        </ContentMenu.Button>
        <ContentMenu.ButtonWithWarning
          warningProps={{
            callbackToConfirm: deleteEntity,
            warningText: {
              heading: `Delete ${entityType}?`,
              body: "This can't be undone.",
            },
          }}
          tooltipProps={{ text: `delete ${entityType}` }}
        >
          <DeleteEntityIcon />
        </ContentMenu.ButtonWithWarning>
      </div>
    </$Cell>
  );
};

export const RecordedEventTypeCell = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  return (
    <$Cell>{recordedEventTypeId ? <HandleRecordedEventType /> : "-"}</$Cell>
  );
};
