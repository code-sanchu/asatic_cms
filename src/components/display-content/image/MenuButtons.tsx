import {
  ArrowBendLeftDown,
  ArrowBendRightUp,
  Image as ImageIcon,
} from "phosphor-react";

import { generateImgVertPositionProps } from "^helpers/image";

import ContentMenu from "^components/menus/Content";
import WithAddDocImage from "^components/WithAddDocImage";

export default function MenuButtons_({
  vertPosition,
  updateImageSrc,
  updateVertPosition,
}: {
  vertPosition: number;
  updateVertPosition: (vertPosition: number) => void;
  updateImageSrc: (imageId: string) => void;
}) {
  const { canFocusHigher, canFocusLower, focusHigher, focusLower } =
    generateImgVertPositionProps(vertPosition, (vertPosition) =>
      updateVertPosition(vertPosition)
    );

  return (
    <>
      <ContentMenu.Button
        onClick={focusLower}
        isDisabled={!canFocusLower}
        tooltipProps={{ text: "focus lower" }}
      >
        <ArrowBendLeftDown />
      </ContentMenu.Button>
      <ContentMenu.Button
        onClick={focusHigher}
        isDisabled={!canFocusHigher}
        tooltipProps={{ text: "focus higher" }}
      >
        <ArrowBendRightUp />
      </ContentMenu.Button>
      <ContentMenu.VerticalBar />
      <ChangeImageMenuButton updateImageSrc={updateImageSrc} />
    </>
  );
}

type UpdateImageSrc = { updateImageSrc: (imageId: string) => void };

export const AddImageMenuButton = (updateProp: UpdateImageSrc) => {
  return <ImageMenuButton tooltipText="add image" {...updateProp} />;
};

export const ChangeImageMenuButton = (updateProp: UpdateImageSrc) => {
  return <ImageMenuButton tooltipText="change image" {...updateProp} />;
};

const ImageMenuButton = ({
  tooltipText,
  updateImageSrc,
}: {
  tooltipText: string;
} & UpdateImageSrc) => {
  return (
    <WithAddDocImage onAddImage={(imageId) => updateImageSrc(imageId)}>
      <ContentMenu.Button tooltipProps={{ text: tooltipText }}>
        <ImageIcon />
      </ContentMenu.Button>
    </WithAddDocImage>
  );
};