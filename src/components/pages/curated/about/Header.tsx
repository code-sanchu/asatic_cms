import useAboutPageTopControls from "^hooks/pages/useAboutPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import {
  Header_,
  $DefaultButtonSpacing,
  $MutationTextContainer,
  $SaveText_,
  UndoButton_,
  SaveButton_,
} from "^components/header";
import SiteLanguage from "^components/SiteLanguage";
import { $VerticalBar } from "^components/header";

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useAboutPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <Header_
      leftElements={
        <>
          <SiteLanguage.Popover />
          <$MutationTextContainer>
            <$SaveText_
              isChange={isChange}
              saveMutationData={saveMutationData}
            />
          </$MutationTextContainer>
        </>
      }
      rightElements={
        <$DefaultButtonSpacing>
          <$VerticalBar />
          <UndoButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            undo={handleUndo}
          />
          <SaveButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            save={handleSave}
          />
        </$DefaultButtonSpacing>
      }
    />
  );
};

export default Header;
