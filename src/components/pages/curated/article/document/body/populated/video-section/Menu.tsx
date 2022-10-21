import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import { UpdateVideoSrcButton } from "../../../../../_containers/article-like";
import SectionMenu from "../SectionMenu";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: sectionId, index: sectionIndex }, { updateBodyVideoSrc }] =
    ArticleVideoSectionSlice.useContext();

  return (
    <SectionMenu
      isShowing={isShowing}
      sectionId={sectionId}
      sectionIndex={sectionIndex}
    >
      <UpdateVideoSrcButton
        updateVideoSrc={(youtubeId) => updateBodyVideoSrc({ youtubeId })}
      />
    </SectionMenu>
  );
};

export default Menu;
