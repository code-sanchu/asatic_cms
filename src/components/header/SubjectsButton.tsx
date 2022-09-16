import { Books } from "phosphor-react";
import tw from "twin.macro";

import { MyOmit } from "^types/utilities";

import MissingTranslation from "^components/MissingTranslation";
import DocSubjects, {
  ButtonProps,
} from "^components/secondary-content-popovers/subjects";

import HeaderIconButton from "./IconButton";

type Props = MyOmit<ButtonProps, "children">;

const SubjectsButton = (props: Props) => {
  return (
    <DocSubjects.Button {...props}>
      {({ subjectsStatus }) => (
        <div css={[tw`relative`]}>
          <HeaderIconButton tooltip="subjects">
            <Books />
          </HeaderIconButton>
          {subjectsStatus.includes("missing translation") ? (
            <div
              css={[
                tw`z-40 absolute top-0 right-0 translate-x-2 -translate-y-0.5 scale-90`,
              ]}
            >
              <MissingTranslation tooltipText="missing translation" />
            </div>
          ) : null}
        </div>
      )}
    </DocSubjects.Button>
  );
};

export default SubjectsButton;
