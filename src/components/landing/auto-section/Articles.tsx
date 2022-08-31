import { JSONContent } from "@tiptap/core";
import { Trash, FileText } from "phosphor-react";
import tw from "twin.macro";

import {
  ArticleProvider,
  useArticleContext,
} from "^context/articles/ArticleContext";
import {
  ArticleTranslationProvider,
  useArticleTranslationContext,
} from "^context/articles/ArticleTranslationContext";

import { landingColorThemes } from "^data/landing";

import {
  getArticleSummaryFromBody,
  getFirstImageFromArticleBody,
  selectTranslationForActiveLanguage,
} from "^helpers/article";
import { generateImgVertPositionProps } from "^helpers/image";

import { useSelector } from "^redux/hooks";
import { selectArticles as selectArticles } from "^redux/state/articles";

import EditImagePopover from "../EditImagePopover";
import AutoSection from "./AutoSection";
import Swiper from "./Swiper";
import ArticleStatusLabel from "^components/article/StatusLabel";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import DivHover from "^components/DivHover";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import MyImage from "^components/images/MyImage";
import ContentMenu from "^components/menus/Content";
import ImageMenuUI from "^components/menus/Image";
import MissingText from "^components/MissingText";
import SiteLanguage from "^components/SiteLanguage";
import useFindDocsUsedInCustomLandingSections from "^hooks/useFindDocsUsedInCustomLandingSections";
import { arrayDivergence, mapIds } from "^helpers/general";

export default function Articles() {
  return (
    <AutoSection.Container
      colorTheme="cream"
      swiper={<ArticlesSwiper />}
      title="Articles"
      moreFromText="More from articles"
    />
  );
}

const ArticlesSwiper = () => {
  const articles = useSelector(selectArticles);

  const usedArticlesIds = useFindDocsUsedInCustomLandingSections("article");
  const articlesIds = [...new Set(mapIds(articles))];
  const unusedArticlesIds = arrayDivergence(articlesIds, usedArticlesIds);

  const articlesOrderedIds = [...unusedArticlesIds, ...usedArticlesIds];
  const articlesOrdered = articlesOrderedIds.map(
    (id) => articles.find((a) => a.id === id)!
  );

  // could order by date + translation (for site language)

  return (
    <Swiper
      colorTheme="cream"
      elements={articlesOrdered.map((article) => (
        <ArticleProvider article={article} key={article.id}>
          <Article />
        </ArticleProvider>
      ))}
    />
  );
};

function Article() {
  const [{ id: articleId, translations }] = useArticleContext();
  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForActiveLanguage(
    translations,
    siteLanguageId
  );

  return (
    <ArticleTranslationProvider translation={translation} articleId={articleId}>
      <DivHover styles={tw`h-full`}>
        {(isHovered) => (
          <>
            <Swiper.Element>
              <ArticleContent />
            </Swiper.Element>
            <ArticleMenu articleIsHovered={isHovered} />
          </>
        )}
      </DivHover>
    </ArticleTranslationProvider>
  );
}

const ArticleMenu = ({ articleIsHovered }: { articleIsHovered: boolean }) => {
  const [
    {
      landing: { useImage, imageId },
    },
    { toggleUseLandingImage, updateLandingImageSrc, routeToEditPage },
  ] = useArticleContext();

  const onSelectImage = (imageId: string) => {
    if (!useImage) {
      toggleUseLandingImage();
    }
    updateLandingImageSrc({ imageId });
  };

  const show = (!useImage || !imageId) && articleIsHovered;

  return (
    <ContentMenu show={show} styles={tw`top-0 right-0`}>
      <EditImagePopover onSelectImage={onSelectImage} tooltipText="add image" />
      <ContentMenu.VerticalBar />
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{
          text: "go to edit page",
          placement: "left",
          type: "action",
        }}
      >
        <FileText />
      </ContentMenu.Button>
    </ContentMenu>
  );
};

function ArticleContent() {
  return (
    <>
      <div css={[tw`inline-block mb-sm`]}>
        <ArticleStatusLabel includeNewType={false} showPublished={false} />
      </div>
      <ArticleImage />
      <ArticleTitle />
      <ArticleAuthors />
      <ArticleSummary />
    </>
  );
}

function ArticleTitle() {
  const [{ title }] = useArticleTranslationContext();

  return (
    <h3 css={[tw`text-3xl`, landingColorThemes.cream.text]}>
      {title ? (
        title
      ) : (
        <div css={[tw`flex items-baseline gap-xs`]}>
          <span css={[tw`text-gray-placeholder`]}>Title...</span>
          <MissingText tooltipText="missing title" fontSize={tw`text-base`} />
        </div>
      )}
    </h3>
  );
}

const ArticleImage = () => {
  const [
    {
      landing: {
        imageId: summaryImageId,
        autoSection: { imgVertPosition },
      },
    },
  ] = useArticleContext();

  const [{ body }] = useArticleTranslationContext();

  const imageIdFromBody = getFirstImageFromArticleBody(body);

  const imageId = summaryImageId
    ? summaryImageId
    : imageIdFromBody
    ? imageIdFromBody
    : null;

  return imageId ? (
    <DivHover styles={tw`w-full aspect-ratio[16 / 9] mb-sm`}>
      {(isHovered) => (
        <>
          <MyImage
            imgId={imageId}
            objectFit="cover"
            vertPosition={imgVertPosition}
          />
          <ArticleImageMenu show={isHovered} />
        </>
      )}
    </DivHover>
  ) : null;
};

const ArticleImageMenu = ({ show }: { show: boolean }) => {
  const [
    {
      landing: {
        autoSection: { imgVertPosition },
      },
    },
    {
      toggleUseLandingImage,
      updateLandingAutoSectionImageVertPosition,
      updateLandingImageSrc,
    },
  ] = useArticleContext();

  const { canFocusHigher, canFocusLower, focusHigher, focusLower } =
    generateImgVertPositionProps(imgVertPosition, (imgVertPosition) =>
      updateLandingAutoSectionImageVertPosition({ imgVertPosition })
    );

  return (
    <ImageMenuUI
      canFocusHigher={canFocusHigher}
      canFocusLower={canFocusLower}
      focusHigher={focusHigher}
      focusLower={focusLower}
      show={show}
      updateImageSrc={(imageId) => updateLandingImageSrc({ imageId })}
      additionalButtons={
        <>
          <ContentMenu.VerticalBar />
          <ContentMenu.ButtonWithWarning
            tooltipProps={{ text: "remove image", type: "action" }}
            warningProps={{
              callbackToConfirm: toggleUseLandingImage,
              warningText: "Remove image?",
              type: "moderate",
            }}
          >
            <Trash />
          </ContentMenu.ButtonWithWarning>
        </>
      }
    />
  );
};

const ArticleAuthors = () => {
  const [{ authorIds }] = useArticleContext();
  const [{ languageId }] = useArticleTranslationContext();

  if (!authorIds.length) {
    return null;
  }

  return (
    <div css={[tw`text-2xl text-articleText mt-xxxs`]}>
      <DocAuthorsText authorIds={authorIds} docActiveLanguageId={languageId} />
    </div>
  );
};

// todo: diff in line heights between summary written manually and that from article body

const ArticleSummary = () => {
  const [
    {
      landing: { useImage, imageId },
      authorIds,
    },
  ] = useArticleContext();

  const isImage = useImage && imageId;
  const isAuthor = authorIds.length;

  const [translation, { updateSummary }] = useArticleTranslationContext();

  const {
    body,
    landingPage: { autoSummary },
  } = translation;

  const bodyText = getArticleSummaryFromBody(body);

  const initialContent = autoSummary || bodyText || undefined;

  const onUpdate = (text: JSONContent) =>
    updateSummary({
      summary: text,
      summaryType: "auto",
    });

  return (
    <div css={[tw`relative text-articleText mt-xs`]}>
      <SimpleTipTapEditor
        initialContent={initialContent}
        onUpdate={onUpdate}
        placeholder="summary here..."
        lineClamp={
          isImage && isAuthor
            ? "line-clamp-4"
            : isImage
            ? "line-clamp-6"
            : isAuthor
            ? "line-clamp-7"
            : "line-clamp-9"
        }
        key={translation.id}
      />
    </div>
  );
};
