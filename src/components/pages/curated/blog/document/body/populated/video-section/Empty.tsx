import {
  $MediaSectionContainer_,
  $MediaSectionEmpty_,
} from "../../../../../_presentation/article-like";
import Menu from "./Menu";

const Empty = () => {
  return (
    <$MediaSectionContainer_
      menu={(containerIsHovered) => <Menu isShowing={containerIsHovered} />}
    >
      <$MediaSectionEmpty_ mediaType="video" />
    </$MediaSectionContainer_>
  );
};

export default Empty;
