import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectDocAuthorsStatus as selectEntityAuthorsStatus } from "^redux/state/complex-selectors/authors";

import Popover from "^components/ProximityPopover";
import {
  ComponentContextValue,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import Panel from "./panel";

export type AuthorsPopover_Props = {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: ComponentContextValue[1];
};

export function AuthorsPopover_({
  children: button,
  ...contextProps
}: AuthorsPopover_Props) {
  return (
    <Popover>
      <ComponentProvider {...contextProps}>
        <>
          <Popover.Panel>
            <Panel />
          </Popover.Panel>
          <Popover.Button>{button}</Popover.Button>
        </>
      </ComponentProvider>
    </Popover>
  );
}

type AuthorsPopoverButtonProps = {
  children:
    | ReactElement
    | (({
        authorsStatus,
      }: {
        authorsStatus: ReturnType<typeof selectEntityAuthorsStatus>;
      }) => ReactElement);
};

export function AuthorsPopoverButton_({ children }: AuthorsPopoverButtonProps) {
  const [{ parentAuthorsIds, parentLanguagesIds }] = useComponentContext();

  const authorsStatus = useSelector((state) =>
    selectEntityAuthorsStatus(state, parentAuthorsIds, parentLanguagesIds)
  );

  return typeof children === "function"
    ? children({ authorsStatus: authorsStatus })
    : children;
}
