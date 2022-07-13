import { NextPage } from "next";
import { ReactElement, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowsInLineHorizontal,
  ArrowsInLineVertical,
  ArrowsOutLineHorizontal,
  ArrowsOutLineVertical,
  ArrowUp,
  CaretLeft,
  CaretRight,
  Check,
  CloudArrowUp,
  FilePlus,
  Plus,
  PlusCircle,
  Robot,
  SquaresFour,
  Translate,
  Trash,
  User,
  Wrench,
} from "phosphor-react";
import tw, { css, TwStyle } from "twin.macro";
import { RadioGroup } from "@headlessui/react";
import { JSONContent } from "@tiptap/react";
import { useWindowSize } from "react-use";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  selectById as selectLanguageById,
  selectEntitiesByIds as selectLanguagesByIds,
} from "^redux/state/languages";
import {
  addOne as addLandingSection,
  removeOne as deleteSectionAction,
  moveDown as moveDownAction,
  moveUp as moveUpAction,
  selectAll as selectLandingSections,
  selectTotal as selectTotalLandingSections,
} from "^redux/state/landing";
import {
  selectAll as selectArticles,
  updateSummary as updateSummaryAction,
  selectById as selectArticleById,
} from "^redux/state/articles";
import { selectEntitiesByIds as selectAuthorsByIds } from "^redux/state/authors";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { siteLanguageIDsArr } from "^constants/data";

import {
  formatDateDMYStr,
  mapIds,
  orderSortableComponents,
} from "^helpers/general";
import {
  computeTranslationForActiveLanguage,
  getArticleSummaryFromTranslation,
  getImageIdsFromBody,
} from "^helpers/article";

import useLandingPageTopControls from "^hooks/pages/useLandingPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import {
  LandingCustomSectionProvider,
  useLandingCustomSectionContext,
} from "^context/LandingCustomSectionContext";
import {
  ActiveLanguageProvider,
  useActiveLanguageContext,
} from "^context/ActiveLanguageContext";
import { ArticleProvider, useArticleContext } from "^context/ArticleContext";

import { Language } from "^types/language";
import { LandingSectionAuto } from "^types/landing";

import Head from "^components/Head";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";
import SideBar from "^components/header/SideBar";
import UndoButtonUI from "^components/header/UndoButtonUI";
import QueryDatabase from "^components/QueryDatabase";
import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";
import MissingText from "^components/MissingText";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import WithWarning from "^components/WithWarning";
import ContentInputWithSelect from "^components/ContentInputWithSelect";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import AddItemButton from "^components/buttons/AddItem";
import LandingSwiper from "^components/swipers/Landing";

import { s_editorMenu } from "^styles/menus";
import s_transition from "^styles/transition";
import { s_header } from "^styles/header";
import s_button from "^styles/button";
import { s_popover } from "^styles/popover";
import {
  ArticleTranslationProvider,
  useArticleTranslationContext,
} from "^context/ArticleTranslationContext";
import { selectAll as selectImages } from "^redux/state/images";
import { Image as ImageType } from "^types/image";
import ImageWrapper from "^components/images/Wrapper";
import {
  ArticleTranslationWithActionsProvider,
  useArticleTranslationWithActionsContext,
} from "^context/ArticleTranslationWithActionsContext.tsx";
import useSearchLandingContent from "^hooks/pages/useLandingContent";
import {
  LandingCustomSectionComponentProvider,
  useLandingCustomSectionComponentContext,
} from "^context/LandingCustomSectionComponentContext";

// todo: info somewhere about order of showing translations
// todo: font-serif. Also affects article font sizing

// todo: extend tiptap content type for image

// todo: image node type written twice on an article

// todo: asserting context value as {} leads to useContext check to not work

// todo: selectEntitiesByIds assertion in each state type is probably not safe and not good practice

const Landing: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.LANDING,
          Collection.ARTICLES,
          Collection.AUTHORS,
          Collection.IMAGES,
          Collection.LANGUAGES,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default Landing;

const PageContent = () => {
  return (
    <div css={[tw`h-screen max-h-screen overflow-y-hidden flex flex-col`]}>
      <ActiveLanguageProvider>
        <>
          <Header />
          <MainContainer />
        </>
      </ActiveLanguageProvider>
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useLandingPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <header css={[s_header.container, tw`border-b`]}>
      <div css={[tw`flex items-center gap-md`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          <LanguageSelect />
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </div>
      </div>
      <div css={[s_header.spacing]}>
        <UndoButtonUI
          handleUndo={handleUndo}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
        />
        <SaveButtonUI
          handleSave={handleSave}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
        />
        <div css={[s_header.verticalBar]} />
        <button css={[s_header.button]}>
          <CloudArrowUp />
        </button>
      </div>
    </header>
  );
};

const LanguageSelect = () => {
  const { activeLanguageId } = useActiveLanguageContext();
  const language = useSelector((state) =>
    selectLanguageById(state, activeLanguageId)
  )!;

  return (
    <WithProximityPopover panelContentElement={<LanguageSelectPanel />}>
      <LanguageSelectButtonUI languageName={language.name} />
    </WithProximityPopover>
  );
};

const LanguageSelectButtonUI = ({ languageName }: { languageName: string }) => {
  return (
    <WithTooltip text="site language" placement="right">
      <button css={[tw`flex gap-xxxs items-center`]}>
        <span css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
          <Translate />
        </span>
        <span css={[tw`text-sm`]}>{languageName}</span>
      </button>
    </WithTooltip>
  );
};

const LanguageSelectPanel = () => {
  const { activeLanguageId, setActiveLanguageId } = useActiveLanguageContext();

  const siteLanguages = useSelector((state) =>
    selectLanguagesByIds(state, siteLanguageIDsArr)
  ) as Language[];

  const value = siteLanguages.find(
    (language) => language.id === activeLanguageId
  ) as Language;

  const setValue = (language: Language) => setActiveLanguageId(language.id);

  return (
    <LanguageSelectPanelUI
      languages={
        <LanguageSelectLanguages
          languages={siteLanguages}
          setValue={setValue}
          value={value}
        />
      }
    />
  );
};

const LanguageSelectPanelUI = ({ languages }: { languages: ReactElement }) => {
  return (
    <div css={[s_popover.panelContainer]}>
      <div>
        <h4 css={[tw`font-medium text-lg`]}>Site language</h4>
        <p css={[tw`text-gray-600 mt-xs text-sm`]}>
          Determines the language the site is shown in. For translatable
          documents, e.g. articles, the site will show the relevant translation
          if it exists.
        </p>
      </div>
      <div css={[tw`flex flex-col gap-lg items-start`]}>{languages}</div>
    </div>
  );
};

const LanguageSelectLanguages = ({
  languages,
  setValue,
  value,
}: {
  languages: Language[];
  value: Language;
  setValue: (language: Language) => void;
}) => {
  return (
    <RadioGroup
      as="div"
      css={[tw`flex items-center gap-md`]}
      value={value}
      onChange={setValue}
    >
      <div css={[tw`flex items-center gap-lg`]}>
        {languages.map((language) => (
          <RadioGroup.Option value={language} key={language.id}>
            {({ checked }) => (
              <WithTooltip
                text={checked ? "active language" : "make active"}
                type={checked ? "info" : "action"}
              >
                <div css={[tw`flex items-center gap-xs`]}>
                  {checked ? (
                    <span css={[tw`text-green-active `]}>
                      <Check />
                    </span>
                  ) : null}
                  <span
                    css={[checked ? tw`text-green-active` : tw`cursor-pointer`]}
                  >
                    {language.name}
                  </span>
                </div>
              </WithTooltip>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

const MainContainer = () => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>();
  const containerHeight = containerRef?.clientHeight;
  const { width: windowWidth } = useWindowSize();
  const containerWidth = windowWidth * 0.95;

  return (
    <div
      css={[
        tw`h-full grid place-items-center bg-gray-50 border-t-2 border-gray-200`,
      ]}
    >
      {containerWidth ? (
        <div
          css={[tw`max-w-[1200px] h-[95%]`]}
          style={{ width: containerWidth }}
          ref={setContainerRef}
        >
          {containerHeight ? (
            <div
              css={[tw`overflow-y-auto bg-white shadow-md`]}
              style={{ height: containerHeight }}
            >
              <Main />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const Main = () => {
  const numSections = useSelector(selectTotalLandingSections);

  return (
    <main css={[tw`bg-white py-lg`]}>
      {numSections ? <Sections /> : <EmptySections />}
    </main>
  );
};

const EmptySections = () => {
  return (
    <div css={[tw`text-center`]}>
      <div css={[tw` relative text-gray-400 inline-flex items-center`]}>
        <span css={[tw`text-4xl`]}>
          <SquaresFour />
        </span>
        <span css={[tw`absolute bottom-0 right-0 bg-white text-lg`]}>
          <PlusCircle weight="bold" />
        </span>
      </div>
      <div css={[tw``]}>
        <p css={[tw`font-medium`]}>No sections</p>
        <p css={[tw`mt-xs text-gray-600`]}>
          Get started building the landing page
        </p>
      </div>
      <div css={[tw`mt-lg`]}>
        <WithAddSection positionNum={1}>
          <AddItemButton>Add section</AddItemButton>
        </WithAddSection>
      </div>
    </div>
  );
};

const WithAddSection = ({
  children,
  positionNum,
}: {
  children: ReactElement;
  positionNum: number;
}) => {
  const dispatch = useDispatch();
  const addUserCreatedSection = () =>
    dispatch(addLandingSection({ positionNum, type: "custom" }));

  return (
    <WithProximityPopover
      panelContentElement={({ close: closePanel }) => (
        <AddSectionPanelUI
          addAutoCreatedButton={
            <AddAutoCreatedPopover
              closePanel={closePanel}
              positionNum={positionNum}
            />
          }
          addUserCreated={() => {
            addUserCreatedSection();
            closePanel();
          }}
        />
      )}
    >
      {children}
    </WithProximityPopover>
  );
};

const AddSectionPanelUI = ({
  addAutoCreatedButton,
  addUserCreated,
}: {
  addUserCreated: () => void;
  addAutoCreatedButton: ReactElement;
}) => {
  return (
    <div
      css={[
        tw`px-sm py-xs flex items-center gap-md bg-white rounded-md shadow-md border`,
      ]}
    >
      <WithTooltip
        text={{
          header: "user-created",
          body: "Add any type of document and edit its size.",
        }}
        type="action"
      >
        <button
          css={[s_editorMenu.button.button, tw`relative`]}
          onClick={addUserCreated}
          type="button"
        >
          <UserCreatedIcon />
        </button>
      </WithTooltip>
      {addAutoCreatedButton}
    </div>
  );
};

const UserCreatedIcon = () => (
  <div css={[tw`relative inline-block`]}>
    <span>
      <User />
    </span>
    <span css={[tw`absolute bottom-0 -right-1.5 text-xs text-gray-800`]}>
      <Wrench />
    </span>
  </div>
);

const AddAutoCreatedPopover = ({
  closePanel,
  positionNum,
}: {
  closePanel: () => void;
  positionNum: number;
}) => {
  return (
    <WithProximityPopover
      panelContentElement={
        <AddAutoCreatedPanel
          closePanel={closePanel}
          positionNum={positionNum}
        />
      }
      placement="bottom-start"
    >
      <WithTooltip
        text={{
          header: "auto-generated",
          body: "Choose from document types, e.g. articles, and a swipeable section will be created.",
        }}
      >
        <button css={[s_editorMenu.button.button, tw`relative`]} type="button">
          <span>
            <Robot />
          </span>
          <span css={[tw`absolute bottom-0.5 -right-1 text-xs text-gray-800`]}>
            <Wrench />
          </span>
        </button>
      </WithTooltip>
    </WithProximityPopover>
  );
};

const contentSectionData: {
  contentType: LandingSectionAuto["contentType"];
  text: string;
}[] = [
  {
    contentType: "article",
    text: "articles",
  },
];

const AddAutoCreatedPanel = ({
  closePanel,
  positionNum,
}: {
  closePanel: () => void;
  positionNum: number;
}) => {
  const sections = useSelector(selectLandingSections);
  const autoSections = sections.filter(
    (s) => s.type === "auto"
  ) as LandingSectionAuto[];

  const sectionIsUsed = (contentType: LandingSectionAuto["contentType"]) => {
    const usedAutoSectionsTypes = autoSections.map((s) => s.contentType);

    const isUsed = usedAutoSectionsTypes.includes(contentType);

    return isUsed;
  };

  const dispatch = useDispatch();

  const addAutoSection = (contentType: LandingSectionAuto["contentType"]) => {
    dispatch(addLandingSection({ type: "auto", contentType, positionNum }));
    closePanel();
  };

  return (
    <AddAutoCreatedPanelUI
      addSectionButtons={
        <>
          {contentSectionData.map((s) => (
            <AddAutoCreatedSectionUI
              addToLanding={() => addAutoSection(s.contentType)}
              isUsed={sectionIsUsed(s.contentType)}
              text={s.text}
              key={s.contentType}
            />
          ))}
        </>
      }
    />
  );
};

const AddAutoCreatedPanelUI = ({
  addSectionButtons,
}: {
  addSectionButtons: ReactElement;
}) => {
  return (
    <div
      css={[
        tw`text-left py-sm flex flex-col gap-md bg-white rounded-md shadow-md border`,
      ]}
    >
      {addSectionButtons}
    </div>
  );
};

const AddAutoCreatedSectionUI = ({
  addToLanding,
  isUsed,
  text,
}: {
  addToLanding: () => void;
  isUsed: boolean;
  text: string;
}) => {
  return (
    <button
      css={[
        tw`flex items-center gap-sm py-0.5 px-md text-gray-700`,
        isUsed && tw`cursor-auto text-gray-400`,
      ]}
      onClick={() => !isUsed && addToLanding()}
      type="button"
    >
      <span css={[tw`whitespace-nowrap`]}>{text}</span>
      {/* <span css={[tw`whitespace-nowrap`]}>Article section</span> */}
      <span>
        <FilePlus />
      </span>
    </button>
  );
};

const Sections = () => {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<number | null>(
    null
  );
  const setSectionHoveredToNull = () => setSectionHoveredIndex(null);

  const sections = useSelector(selectLandingSections);

  return (
    <div css={[tw``]}>
      <BetweenSectionsMenuUI positionNum={1} show={sectionHoveredIndex === 0} />
      {sections.map((s, i) => (
        <SectionContainerUI
          betweenSectionsMenu={
            <BetweenSectionsMenuUI
              positionNum={i + 2}
              show={sectionHoveredIndex === i || sectionHoveredIndex === i + 1}
            />
          }
          onMouseEnter={() => setSectionHoveredIndex(i)}
          onMouseLeave={setSectionHoveredToNull}
          key={s.id}
        >
          {s.type === "auto" ? (
            <AutoSectionContainerUI
              menu={
                <SectionMenu
                  canMoveDown={s.order < sections.length}
                  canMoveUp={i > 0}
                  sectionId={s.id}
                />
              }
            >
              <AutoSectionSwitch contentType={s.contentType} />
            </AutoSectionContainerUI>
          ) : (
            <LandingCustomSectionProvider section={s}>
              <CustomSection
                menu={
                  <SectionMenu
                    canMoveDown={s.order < sections.length}
                    canMoveUp={i > 0}
                    sectionId={s.id}
                    extraButtons={<CustomSectionMenuExtraButtonsUI />}
                  />
                }
              />
            </LandingCustomSectionProvider>
          )}
        </SectionContainerUI>
      ))}
    </div>
  );
};

const SectionContainerUI = ({
  children,
  betweenSectionsMenu,
  onMouseEnter,
  onMouseLeave,
}: {
  children: ReactElement;
  betweenSectionsMenu: ReactElement;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => (
  <div
    css={[tw`relative`]}
    className="group"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
    {betweenSectionsMenu}
  </div>
);

const BetweenSectionsMenuUI = ({
  positionNum,
  show,
}: {
  positionNum: number;
  show: boolean;
}) => (
  <div css={[tw`relative z-30`, s_transition.toggleVisiblity(show)]}>
    <div css={[tw`absolute left-1/2 -translate-x-1/2 -translate-y-1/2`]}>
      <WithAddSection positionNum={positionNum}>
        <WithTooltip text="add section here">
          <button
            css={[
              s_editorMenu.button.button,
              tw`bg-transparent hover:bg-white text-gray-400 hover:text-gray-600`,
            ]}
            type="button"
          >
            <PlusCircle />
          </button>
        </WithTooltip>
      </WithAddSection>
    </div>
  </div>
);

const SectionMenu = ({
  sectionId,
  canMoveDown,
  canMoveUp,
  extraButtons,
}: {
  canMoveDown: boolean;
  canMoveUp: boolean;
  sectionId: string;
  extraButtons?: ReactElement | null;
}) => {
  const dispatch = useDispatch();

  const deleteSection = () => dispatch(deleteSectionAction({ id: sectionId }));

  const moveDown = () => dispatch(moveDownAction({ id: sectionId }));

  const moveUp = () => dispatch(moveUpAction({ id: sectionId }));

  return (
    <SectionMenuUI
      canMoveDown={canMoveDown}
      canMoveUp={canMoveUp}
      deleteSection={deleteSection}
      moveDown={moveDown}
      moveUp={moveUp}
      extraButtons={extraButtons}
    />
  );
};

const SectionMenuUI = ({
  canMoveDown,
  canMoveUp,
  deleteSection,
  moveDown,
  moveUp,
  extraButtons,
}: {
  canMoveDown: boolean;
  canMoveUp: boolean;
  deleteSection: () => void;
  extraButtons?: ReactElement | null;
  moveDown: () => void;
  moveUp: () => void;
}) => (
  <div css={[s_menu.container]}>
    {extraButtons ? extraButtons : null}
    <WithTooltip text="move section down" type="action">
      <button
        css={[s_menu.button(!canMoveDown)]}
        onClick={moveDown}
        type="button"
      >
        <ArrowDown />
      </button>
    </WithTooltip>
    <WithTooltip text="move section up" type="action">
      <button css={[s_menu.button(!canMoveUp)]} onClick={moveUp} type="button">
        <ArrowUp />
      </button>
    </WithTooltip>
    <div css={[s_menu.verticalBar]} />
    <WithWarning
      callbackToConfirm={deleteSection}
      warningText={{ heading: "Delete section?" }}
    >
      <WithTooltip text="delete section" type="action">
        <button css={[s_menu.button()]} type="button">
          <Trash />
        </button>
      </WithTooltip>
    </WithWarning>
  </div>
);

const s_menu = {
  container: tw`absolute top-0 right-0 px-sm py-xs flex items-center gap-sm bg-white rounded-md shadow-md border`,
  button: (isDisabled?: boolean) => css`
    ${s_editorMenu.button.button} ${tw`text-[15px]`} ${isDisabled &&
    s_editorMenu.button.disabled}
  `,
  verticalBar: tw`w-[0.5px] h-[15px] bg-gray-200`,
};

const AutoSectionContainerUI = ({
  children,
  menu,
}: {
  children: ReactElement;
  menu: ReactElement;
}) => {
  return (
    <div>
      {children}
      {menu}
    </div>
  );
};

const AutoSectionSwitch = ({
  contentType,
}: {
  contentType: LandingSectionAuto["contentType"];
}) => {
  if (contentType === "article") {
    return <AutoArticleSectionUI articlesSwiper={<ArticlesSwiper />} />;
  }

  throw new Error("section content type not handled");
};

const AutoArticleSectionUI = ({
  articlesSwiper,
}: {
  articlesSwiper: ReactElement;
}) => {
  return (
    <div css={[tw`bg-blue-light-content font-serif-eng`]}>
      <h3
        css={[
          tw`pl-xl pt-sm pb-xs text-blue-dark-content text-2xl border-b-0.5 border-gray-400`,
        ]}
      >
        From Articles
      </h3>
      <div css={[tw`ml-lg z-10`]}>{articlesSwiper} </div>
    </div>
  );
};

const ArticlesSwiper = () => {
  const articles = useSelector(selectArticles);

  return (
    <LandingSwiper
      elements={articles.map((article) => (
        <ArticleProvider article={article} key={article.id}>
          <AutoSectionArticle />
        </ArticleProvider>
      ))}
      navButtons={
        articles.length > 3
          ? ({ swipeLeft, swipeRight }) => (
              <div
                css={[
                  tw`z-20 absolute top-0 right-0 min-w-[110px] h-full bg-blue-light-content bg-opacity-80 flex flex-col justify-center`,
                ]}
              >
                <div css={[tw`-translate-x-sm`]}>
                  <button
                    css={[
                      tw`p-xs bg-white opacity-60 hover:opacity-90 text-3xl`,
                    ]}
                    onClick={swipeLeft}
                    type="button"
                  >
                    <CaretLeft />
                  </button>
                  <button
                    css={[tw`p-xs bg-white text-3xl`]}
                    onClick={swipeRight}
                    type="button"
                  >
                    <CaretRight />
                  </button>
                </div>
              </div>
            )
          : null
      }
    />
  );
};

// todo: handle: incomplete, draft.
const AutoSectionArticle = () => {
  const [{ id: articleId, translations }] = useArticleContext();
  const { activeLanguageId } = useActiveLanguageContext();

  const translationToUse = computeTranslationForActiveLanguage(
    translations,
    activeLanguageId
  );

  return (
    <ArticleTranslationWithActionsProvider
      translation={translationToUse}
      articleId={articleId}
    >
      <AutoSectionArticleUI
        publishDate={<AutoSectionArticlePublishDate />}
        title={<AutoSectionArticleTitle />}
        authors={<AutoSectionArticleAuthors />}
        short={<AutoSectionArticleSummary />}
      />
    </ArticleTranslationWithActionsProvider>
  );
};

// todo: could be no authors so is margin issue below...
const AutoSectionArticleUI = ({
  publishDate,
  short,
  title,
  authors,
}: {
  title: ReactElement;
  authors?: ReactElement;
  publishDate: ReactElement;
  short: ReactElement;
}) => {
  return (
    <div css={[tw`relative p-sm border-l-0.5 border-gray-400 h-full`]}>
      <div>{title}</div>
      <div css={[tw`mt-xxxs`]}>{authors}</div>
      <div css={[tw`mt-xs`]}>{publishDate}</div>
      <div css={[tw`mt-xs`]}>{short}</div>
    </div>
  );
};

const AutoSectionArticleAuthors = () => {
  const [{ authorIds }] = useArticleContext();
  const [{ languageId }] = useArticleTranslationWithActionsContext();

  const authors = useSelector((state) => selectAuthorsByIds(state, authorIds));

  if (!authorIds.length) {
    return null;
  }

  const authorsTranslationsForLanguage = authors.map((author) =>
    author.translations.find((t) => t.languageId === languageId)
  );

  return (
    <AutoSectionArticleAuthorsUI
      authors={authorsTranslationsForLanguage.map((a, i) => (
        <AutoSectionArticleAuthorUI
          author={a?.name}
          isAFollowingAuthor={i < authors.length - 1}
          key={a?.id}
        />
      ))}
    />
  );
};

const AutoSectionArticleAuthorsUI = ({
  authors,
}: {
  authors: ReactElement[];
}) => {
  return <div css={[tw`flex gap-xs`]}>{authors}</div>;
};

const AutoSectionArticleAuthorUI = ({
  author,
  isAFollowingAuthor,
}: {
  author: string | undefined;
  isAFollowingAuthor: boolean;
}) => (
  <h4 css={[tw`text-gray-700 text-2xl`]}>
    {author ? (
      <>
        <span>{author}</span>
        {isAFollowingAuthor ? ", " : null}
      </>
    ) : (
      <span css={[tw`flex`]}>
        <span css={[tw`text-gray-placeholder mr-sm`]}>author...</span>
        <MissingText tooltipText="missing author translation for language" />
        {isAFollowingAuthor ? (
          <span css={[tw`text-gray-placeholder`]}>,</span>
        ) : null}
      </span>
    )}
  </h4>
);

const AutoSectionArticlePublishDate = () => {
  const [
    {
      publishInfo: { date },
    },
  ] = useArticleContext();
  const dateStr = date ? formatDateDMYStr(date) : null;

  return <AutoSectionArticlePublishDateUI date={dateStr} />;
};

const AutoSectionArticlePublishDateUI = ({ date }: { date: string | null }) => (
  <p css={[tw`font-sans tracking-wide font-light`]}>
    {date ? (
      date
    ) : (
      <span css={[tw`flex items-center gap-sm`]}>
        <span css={[tw`text-gray-placeholder`]}>date...</span>
        <MissingText tooltipText="missing publish date" />
      </span>
    )}
  </p>
);

const AutoSectionArticleTitle = () => {
  const [{ title }] = useArticleTranslationWithActionsContext();

  return <AutoSectionArticleTitleUI title={title} />;
};

const AutoSectionArticleTitleUI = ({
  title,
}: {
  title: string | undefined;
}) => (
  <h3 css={[tw`text-blue-dark-content text-3xl`]}>
    {title ? (
      title
    ) : (
      <div css={[tw`flex items-center gap-sm`]}>
        <span css={[tw`text-gray-placeholder`]}>title...</span>
        <MissingText tooltipText="missing title for language" />
      </div>
    )}
  </h3>
);

const AutoSectionArticleSummary = () => {
  const [translation, { updateSummary }] =
    useArticleTranslationWithActionsContext();

  const summary = getArticleSummaryFromTranslation({
    summaryType: "auto",
    translation,
  });
  const editorInitialContent = summary || undefined;
  const isInitialContent = Boolean(editorInitialContent);

  const onUpdate = (text: JSONContent) =>
    updateSummary({
      summary: text,
      summaryType: "auto",
    });

  return (
    <AutoSectionArticleSummaryUI
      editor={
        <SimpleTipTapEditor
          initialContent={editorInitialContent}
          onUpdate={onUpdate}
          placeholder="summary here..."
          lineClamp="line-clamp-4"
        />
      }
      isContent={Boolean(isInitialContent)}
    />
  );
};

const AutoSectionArticleSummaryUI = ({
  editor,
  isContent,
}: {
  editor: ReactElement;
  isContent: boolean;
}) => (
  <div css={[tw`relative`]}>
    <div>{editor}</div>
    {!isContent ? (
      <div css={[tw`absolute right-0 top-0`]}>
        <MissingText tooltipText="Missing summary text for translation" />
      </div>
    ) : null}
  </div>
);

// ADD CUSTOM SECTION MENU

const WithAddCustomSectionComponent = ({
  children,
}: {
  children: ReactElement;
}) => {
  return (
    <WithProximityPopover
      panelContentElement={({ close: closePanel }) => (
        <AddCustomSectionSectionPanelUI
          contentSearch={<ContentSearch closePanel={closePanel} />}
        />
      )}
    >
      {children}
    </WithProximityPopover>
  );
};

const AddCustomSectionSectionPanelUI = ({
  contentSearch,
}: {
  contentSearch: ReactElement;
}) => {
  return (
    <div css={[s_popover.panelContainer, tw`text-left`]}>
      <div>
        <h4 css={[s_popover.title]}>Add content</h4>
        <p css={[s_popover.subTitleText]}>
          Search by document type, title, author, tag, language or other text
          within document.
        </p>
      </div>
      <div css={[tw`self-stretch`]}>{contentSearch}</div>
    </div>
  );
};

// todo: should have a 'see all' option/select is open by default showing all

const ContentSearch = ({ closePanel }: { closePanel: () => void }) => {
  const landingContent = useSearchLandingContent();

  const [, { addComponent }] = useLandingCustomSectionContext();

  const handleAddComponent = (args: Parameters<typeof addComponent>[0]) => {
    addComponent(args);
    closePanel();
  };

  return (
    <ContentInputWithSelect
      onSubmit={handleAddComponent}
      usedArticlesById={landingContent.articles}
    />
  );
};

//

const CustomSectionMenuExtraButtonsUI = () => (
  <>
    <WithAddCustomSectionComponent>
      <WithTooltip text="add content">
        <button css={[s_menu.button()]} type="button">
          <Plus />
        </button>
      </WithTooltip>
    </WithAddCustomSectionComponent>
    <div css={[s_menu.verticalBar]} />
  </>
);

// CUSTOM SECTION

const CustomSection = ({ menu }: { menu: ReactElement }) => {
  const [{ components }] = useLandingCustomSectionContext();
  const isContent = components.length;

  return (
    <CustomSectionUI
      content={
        isContent ? <CustomSectionComponents /> : <EmptyCustomSectionUI />
      }
      menu={menu}
    />
  );
};

const CustomSectionUI = ({
  content,
  menu,
}: {
  content: ReactElement;
  menu: ReactElement;
}) => (
  <div css={[tw`relative`]}>
    {content}
    {menu}
  </div>
);

const EmptyCustomSectionUI = () => {
  return (
    <div css={[tw`text-center py-lg border-2 border-dashed`]}>
      <div css={[tw`inline-block`]}>
        <p css={[tw`font-medium flex items-center gap-sm`]}>
          <span>
            <UserCreatedIcon />
          </span>
          <span>Custom section</span>
        </p>
        <p css={[tw`mt-xxs text-gray-600 text-sm`]}>No content yet</p>
      </div>
      <div css={[tw`mt-md`]}>
        <WithAddCustomSectionComponent>
          <button
            css={[
              tw`flex items-center gap-xs text-sm text-gray-700 font-medium border border-gray-400 py-0.5 px-3 rounded-sm`,
            ]}
            type="button"
          >
            <span>Add Content</span>
            <span>
              <ArrowRight />
            </span>
          </button>
        </WithAddCustomSectionComponent>
      </div>
    </div>
  );
};

const CustomSectionComponents = () => {
  const [{ id: sectionId, components }, { reorderComponents }] =
    useLandingCustomSectionContext();

  const componentsOrdered = orderSortableComponents(components);
  const componentsOrderedById = mapIds(componentsOrdered);

  return (
    <CustomSectionComponentsUI>
      <DndSortableContext
        elementIds={componentsOrderedById}
        onReorder={reorderComponents}
      >
        {componentsOrdered.map((component) => (
          <LandingCustomSectionComponentProvider
            component={component}
            sectionId={sectionId}
            key={component.id}
          >
            <CustomSectionComponent />
          </LandingCustomSectionComponentProvider>
        ))}
      </DndSortableContext>
    </CustomSectionComponentsUI>
  );
};

const CustomSectionComponentsUI = ({
  children,
}: {
  children: ReactElement;
}) => <div css={[tw`grid grid-cols-4`]}>{children}</div>;

const CustomSectionComponent = () => {
  const [{ id, width }] = useLandingCustomSectionComponentContext();

  return (
    <DndSortableElement colSpan={width} elementId={id}>
      <CustomSectionComponentContainerUI menu={<CustomSectionComponentMenu />}>
        <CustomSectionComponentTypeSwitch />
      </CustomSectionComponentContainerUI>
    </DndSortableElement>
  );
};

const CustomSectionComponentContainerUI = ({
  children,
  menu,
}: {
  children: ReactElement;
  menu: ReactElement;
}) => (
  <div css={[tw`border`]}>
    {children}
    {menu}
  </div>
);

const CustomSectionComponentTypeSwitch = () => {
  const [{ type }] = useLandingCustomSectionComponentContext();

  if (type === "article") {
    return <CustomSectionArticleContainer />;
  }

  throw new Error("Invalid component type");
};

const CustomSectionComponentMenu = () => {
  const [{ width }, { updateWidth }] =
    useLandingCustomSectionComponentContext();
  console.log("width:", width);

  const canNarrow = width > 1;
  const canWiden = width < 3;

  const narrow = () => canNarrow && updateWidth({ width: width - 1 });
  const widen = () => canWiden && updateWidth({ width: width + 1 });

  return (
    <CustomSectionComponentMenuUI
      canNarrow={canNarrow}
      canWiden={canWiden}
      narrow={narrow}
      widen={widen}
    />
  );
};

const CustomSectionComponentMenuUI = ({
  canWiden,
  widen,
  canNarrow,
  narrow,
}: {
  widen: () => void;
  canWiden: boolean;
  narrow: () => void;
  canNarrow: boolean;
}) => (
  <div css={[s_menu.container]}>
    <WithTooltip text="widen">
      <button css={[s_menu.button(!canWiden)]} onClick={widen} type="button">
        <ArrowsOutLineHorizontal />
      </button>
    </WithTooltip>
    <WithTooltip text="narrow">
      <button css={[s_menu.button(!canNarrow)]} onClick={narrow} type="button">
        <ArrowsInLineHorizontal />
      </button>
    </WithTooltip>
  </div>
);

const CustomSectionArticleContainer = () => {
  const [{ docId }] = useLandingCustomSectionComponentContext();
  const article = useSelector((state) => selectArticleById(state, docId));

  return (
    <CustomSectionArticleContainerUI>
      {article ? (
        <ArticleProvider article={article}>
          <CustomSectionArticle />
        </ArticleProvider>
      ) : (
        <CustomSectionArticleInvalid />
      )}
    </CustomSectionArticleContainerUI>
  );
};

const CustomSectionArticleContainerUI = ({
  children,
}: {
  children: ReactElement;
}) => <div>{children}</div>;

const CustomSectionArticleInvalid = () => (
  <div>
    <h4>Invalid article</h4>
    <p>
      This component references an article that can&apos;t be found. It may have
      been deleted. Try refreshing the page.
    </p>
  </div>
);

const CustomSectionArticle = () => {
  const [{ translations }] = useArticleContext();
  const { activeLanguageId } = useActiveLanguageContext();

  const translation = computeTranslationForActiveLanguage(
    translations,
    activeLanguageId
  );

  return (
    <ArticleTranslationProvider translation={translation}>
      <CustomSectionArticleUI
        image={<CustomSectionArticleImage />}
        title={<CustomSectionArticleTitleUI title={translation.title} />}
        summaryText={<CustomSectionArticleSummary />}
      />
    </ArticleTranslationProvider>
  );
};

const CustomSectionArticleUI = ({
  image,
  title,
  summaryText,
}: {
  image: ReactElement | null;
  title: ReactElement;
  summaryText: ReactElement;
}) => (
  <div>
    {image ? image : null}
    <div>{title}</div>
    <div>{summaryText}</div>
  </div>
);

const CustomSectionArticleImage = () => {
  const [article] = useArticleContext();
  const { summaryImage } = article;

  if (summaryImage) {
    return <CustomSectionArticleImageUI image={summaryImage} />;
  }

  return <CustomSectionArticleHandleNonExplicitImage />;
};

const CustomSectionArticleHandleNonExplicitImage = () => {
  const images = useSelector(selectImages);
  const [translation] = useArticleTranslationContext();

  const bodyImageIds = getImageIdsFromBody(translation.body);
  const bodyImages = bodyImageIds.map((id) =>
    images.find((image) => image.id === id)
  );
  const validBodyImages = bodyImages.flatMap((image) => (image ? [image] : []));

  const isBodyImage = validBodyImages.length;

  if (isBodyImage) {
    const firstImage = bodyImages[0]!;

    return <CustomSectionArticleImageUI image={firstImage} />;
  }

  return null;
};

const CustomSectionArticleImageUI = ({ image }: { image: ImageType }) => (
  <div css={[tw`relative border min-h-[300px]`]}>
    <ImageWrapper image={image} />
  </div>
);

const CustomSectionArticleTitleUI = ({
  title,
}: {
  title: string | undefined;
}) => (
  <h3 css={[tw`text-blue-dark-content text-3xl`]}>
    {title ? (
      title
    ) : (
      <div css={[tw`flex items-center gap-sm`]}>
        <span css={[tw`text-gray-placeholder`]}>title...</span>
        <MissingText tooltipText="missing title for language" />
      </div>
    )}
  </h3>
);

const CustomSectionArticleSummary = () => {
  const [{ id: articleId }] = useArticleContext();
  const [translation] = useArticleTranslationContext();

  const summary = getArticleSummaryFromTranslation({
    summaryType: "user",
    translation,
  });
  const editorInitialContent = summary ? summary : undefined;

  const dispatch = useDispatch();

  const updateSummary = (text: JSONContent) =>
    dispatch(
      updateSummaryAction({
        id: articleId,
        summary: text,
        summaryType: "custom",
        translationId: translation.id,
      })
    );

  return (
    <CustomSectionArticleSummaryUI
      editor={
        <SimpleTipTapEditor
          initialContent={editorInitialContent}
          onUpdate={updateSummary}
          placeholder="summary here..."
        />
      }
      isContent={Boolean(summary)}
    />
  );
};

const CustomSectionArticleSummaryUI = ({
  editor,
  isContent,
}: {
  editor: ReactElement;
  isContent: boolean;
}) => (
  <div css={[tw`relative`]}>
    <div>{editor}</div>
    {!isContent ? (
      <div css={[tw`absolute right-0 top-0`]}>
        <MissingText tooltipText="Missing summary text for translation" />
      </div>
    ) : null}
  </div>
);
