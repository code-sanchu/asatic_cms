import tw from "twin.macro";
import DivHover from "^components/DivHover";
import ImageWrapper from "^components/images/Wrapper";
import ContentMenu from "^components/menus/Content";
import ImageMenuUI from "^components/menus/Image";
import MissingText from "^components/MissingText";
import SiteLanguage from "^components/SiteLanguage";
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
  getFirstImageFromArticleBody,
  selectTranslationForSiteLanguage,
} from "^helpers/article";
import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/articles";
import EditImagePopover from "../EditImagePopover";
import AutoSection from "./AutoSection";
import Swiper from "./Swiper";

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
  const articles = useSelector(selectAll);
  // reorder articles

  return (
    <Swiper
      colorTheme="cream"
      elements={articles.map((article) => (
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

  const translation = selectTranslationForSiteLanguage(
    translations,
    siteLanguageId
  );

  return (
    <ArticleTranslationProvider translation={translation} articleId={articleId}>
      <DivHover styles={tw`border-r h-full`}>
        {(isHovered) => (
          <>
            <ArticleContent />
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
    { toggleUseLandingImage, updateLandingImageSrc },
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
    </ContentMenu>
  );
};

function ArticleContent() {
  return (
    <Swiper.Element>
      <ArticleImage />
      <ArticleTitle />
    </Swiper.Element>
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
    <DivHover styles={tw`w-full aspect-ratio[16 / 9]`}>
      {(isHovered) => (
        <>
          <ImageWrapper
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

  const canFocusHigher = imgVertPosition > 0;
  const canFocusLower = imgVertPosition < 100;

  const positionChangeAmount = 10;

  const focusHigher = () => {
    if (!canFocusHigher) {
      return;
    }
    const updatedPosition = imgVertPosition - positionChangeAmount;
    updateLandingAutoSectionImageVertPosition({
      imgVertPosition: updatedPosition,
    });
  };
  const focusLower = () => {
    if (!canFocusLower) {
      return;
    }
    const updatedPosition = imgVertPosition + positionChangeAmount;
    updateLandingAutoSectionImageVertPosition({
      imgVertPosition: updatedPosition,
    });
  };

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
            tooltipProps={{ text: "delete section", type: "action" }}
            warningProps={{
              callbackToConfirm: toggleUseLandingImage,
              warningText: { heading: "Delete section?" },
            }}
          />
        </>
      }
    />
  );
};