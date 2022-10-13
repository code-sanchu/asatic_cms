import BlogSlice from "^context/blogs/BlogContext";

import { Menu_ } from "../../../_containers/Entity";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    BlogSlice.useContext();

  return (
    <Menu_
      isShowing={isShowing}
      routeToEditPage={routeToEditPage}
      toggleUseImage={
        !summaryImage.useImage
          ? {
              isUsingImage: summaryImage.useImage,
              toggleUseImage: toggleUseSummaryImage,
            }
          : undefined
      }
    />
  );
};

export default Menu;