import { ReactElement } from "react";
import {
  ArrowBendLeftDown as ArrowBendLeftDownIcon,
  ArrowBendRightUp as ArrowBendRightUpIcon,
  Image as ImageIcon,
} from "phosphor-react";
import { TwStyle } from "twin.macro";

import WithAddDocImage from "^components/WithAddDocImage";
import ContentMenu from "./Content";

const ImageMenuUI = ({
  canFocusHigher,
  canFocusLower,
  focusHigher,
  focusLower,
  updateImageSrc,
  show,
  containerStyles,
  additionalButtons,
}: {
  updateImageSrc: (imgId: string) => void;
  focusLower: () => void;
  focusHigher: () => void;
  canFocusLower: boolean;
  canFocusHigher: boolean;
  show: boolean;
  containerStyles?: TwStyle;
  additionalButtons?: ReactElement;
}) => (
  <ContentMenu styles={containerStyles} show={show}>
    <>
      <ContentMenu.Button
        onClick={focusLower}
        isDisabled={!canFocusLower}
        tooltipProps={{ text: "focus lower" }}
      >
        <ArrowBendLeftDownIcon />
      </ContentMenu.Button>
      <ContentMenu.Button
        onClick={focusHigher}
        isDisabled={!canFocusHigher}
        tooltipProps={{ text: "focus higher" }}
      >
        <ArrowBendRightUpIcon />
      </ContentMenu.Button>
      <ContentMenu.VerticalBar />
      <WithAddDocImage onAddImage={(id) => updateImageSrc(id)}>
        <ContentMenu.Button tooltipProps={{ text: "change image" }}>
          <ImageIcon />
        </ContentMenu.Button>
      </WithAddDocImage>
      {additionalButtons ? additionalButtons : null}
    </>
  </ContentMenu>
);

export default ImageMenuUI;
