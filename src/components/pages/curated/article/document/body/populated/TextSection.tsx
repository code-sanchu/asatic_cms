import ArticleTextSectionSlice from "^context/articles/ArticleTextSectionContext";

import { $TextSection_ } from "../../../../_presentation/article-like";
import SectionMenu from "./SectionMenu";

const TextSection = () => {
  const [{ id: sectionId, index: sectionIndex, text }, { updateBodyText }] =
    ArticleTextSectionSlice.useContext();

  return (
    <$TextSection_
      text={text}
      updateText={(text) => updateBodyText({ text })}
      menu={(isHovered) => (
        <SectionMenu
          isShowing={isHovered}
          sectionId={sectionId}
          sectionIndex={sectionIndex}
        />
      )}
    />
  );
};

export default TextSection;
