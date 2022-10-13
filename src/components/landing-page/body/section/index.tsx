import { ArrowDown, ArrowUp, Trash } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectById, selectTotal } from "^redux/state/landing";

import LandingSectionSlice from "^context/landing/LandingSectionContext";

import ContentMenu from "^components/menus/Content";

import AutoSection from "./auto-section";
import UserSection from "./user-section";

export default function Section({ id }: { id: string }) {
  const section = useSelector((state) => selectById(state, id))!;

  return (
    <LandingSectionSlice.Provider section={section}>
      {section.type === "auto" ? <AutoSection /> : <UserSection />}
    </LandingSectionSlice.Provider>
  );
}

// is used within context of custom section, so can't be used above
Section.Menu = function SectionMenu({
  extraButtons,
  isShowing,
}: {
  extraButtons?: ReactElement | null;
  isShowing: boolean;
}) {
  return (
    <ContentMenu show={isShowing} styles={tw`right-0 -top-6`}>
      <>
        {extraButtons ? extraButtons : null}
        <MoveSectionDownButton />
        <MoveSectionUpButton />
        <ContentMenu.VerticalBar />
        <DeleteSectionButton />
      </>
    </ContentMenu>
  );
};

const MoveSectionDownButton = () => {
  const numSections = useSelector(selectTotal);
  const [{ index }, { moveSection }] = LandingSectionSlice.useContext();

  const canMoveDown = index < numSections - 1;

  return (
    <ContentMenu.Button
      isDisabled={!canMoveDown}
      onClick={() => moveSection({ direction: "down" })}
      tooltipProps={{ text: "move section down", type: "action" }}
    >
      <ArrowDown />
    </ContentMenu.Button>
  );
};

const MoveSectionUpButton = () => {
  const [{ index }, { moveSection }] = LandingSectionSlice.useContext();

  const canMoveUp = index > 0;

  return (
    <ContentMenu.Button
      isDisabled={!canMoveUp}
      onClick={() => moveSection({ direction: "up" })}
      tooltipProps={{ text: "move section up", type: "action" }}
    >
      <ArrowUp />
    </ContentMenu.Button>
  );
};

const DeleteSectionButton = () => {
  const [, { removeOne }] = LandingSectionSlice.useContext();

  return (
    <ContentMenu.ButtonWithWarning
      tooltipProps={{ text: "delete section", type: "action" }}
      warningProps={{
        callbackToConfirm: removeOne,
        warningText: { heading: "Delete section?" },
      }}
    >
      <Trash />
    </ContentMenu.ButtonWithWarning>
  );
};