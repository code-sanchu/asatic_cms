import { Popover } from "@headlessui/react";
import { ReactElement, useState } from "react";
import tw, { TwStyle } from "twin.macro";
import { usePopper } from "react-popper";
import { Warning } from "phosphor-react";
import Overlay from "./Overlay";

// todo: transition. Tried to add but interfered with popper positioning
// todo: need usePopper? Popover should handle positioning...

const WithWarning = ({
  children,
  callbackToConfirm,
  proceedButtonStyles = tw`text-red-500 border-red-500`,
  warningText = {
    heading: "Are you sure?",
  },
}: {
  callbackToConfirm: () => void;
  children: ReactElement | (({ isOpen }: { isOpen?: boolean }) => ReactElement);
  warningText?: {
    heading: string;
    body?: string;
  };
  proceedButtonStyles?: TwStyle;
}) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: "offset", options: { offset: [0, 10] } },
      { name: "preventOverflow", options: { padding: 8 } },
    ],
  });

  return (
    <>
      <Popover css={[s.popover]}>
        {({ open }) => (
          <>
            <Popover.Button as="div" ref={setReferenceElement}>
              {typeof children === "function"
                ? children({ isOpen: open })
                : children}
            </Popover.Button>
            <Popover.Panel
              css={[tw`z-50 `]}
              ref={setPopperElement}
              style={styles.popper}
              {...attributes}
            >
              {({ close }) => (
                <div css={[s.panelContainer]}>
                  <div css={[s.panelContent]}>
                    <div css={[s.textContainer]}>
                      <h3 css={[s.heading]}>
                        <span>
                          <Warning weight="bold" />
                        </span>
                        {warningText.heading}
                      </h3>
                      <span>
                        {warningText.body ? <p>{warningText.body}</p> : null}
                      </span>
                    </div>
                    <div css={[s.buttonsContainer]}>
                      <button
                        css={[
                          s.buttonDefault,
                          tw`border-gray-600 text-gray-700 transition-all ease-in-out duration-75`,
                          tw`relative`,
                        ]}
                        onClick={() => close()}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        css={[
                          s.buttonDefault,
                          tw`border-gray-600 text-gray-700`,
                          proceedButtonStyles,
                        ]}
                        onClick={() => {
                          callbackToConfirm();
                          close();
                        }}
                        type="button"
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Popover.Panel>
            <Overlay show={open} />
          </>
        )}
      </Popover>
    </>
  );
};

export default WithWarning;

const s = {
  popover: tw`relative`,
  panelContainer: tw`z-50 bg-white shadow-lg rounded-md`,
  panelContent: tw`grid`,
  textContainer: tw`pt-lg pb-sm pl-lg min-w-[35ch] pr-lg`,
  heading: tw`flex font-medium items-center gap-sm mb-sm`,
  buttonsContainer: tw`flex justify-between items-center pl-lg pr-lg pb-sm pt-sm bg-gray-50 rounded-md`,
  buttonDefault: tw`py-1 px-2 border-2 uppercase tracking-wide text-xs rounded-sm font-medium hover:bg-gray-100 bg-gray-50 transition-colors ease-in-out duration-75`,
};
