import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectEntityCollectionsStatus } from "^redux/state/complex-selectors/collections";

import Popover from "^components/ProximityPopover";
import {
  ComponentContextValue,
  ComponentProvider,
  useComponentContext,
} from "./Context";
import Panel from "./panel";

export type CollectionsPopover_Props = {
  children: ReactElement;
  parentData: ComponentContextValue[0];
  parentActions: ComponentContextValue[1];
};

export function CollectionsPopover_({
  children: button,
  ...contextProps
}: CollectionsPopover_Props) {
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

type CollectionsPopoverButtonProps = {
  children:
    | ReactElement
    | (({
        entityCollectionsStatus,
      }: {
        entityCollectionsStatus: ReturnType<
          typeof selectEntityCollectionsStatus
        >;
      }) => ReactElement);
};

export function CollectionsPopoverButton_({
  children,
}: CollectionsPopoverButtonProps) {
  const [{ parentCollectionsIds, parentLanguagesIds }] = useComponentContext();

  const status = useSelector((state) =>
    selectEntityCollectionsStatus(
      state,
      parentCollectionsIds,
      parentLanguagesIds
    )
  );

  return typeof children === "function"
    ? children({ entityCollectionsStatus: status })
    : children;
}
