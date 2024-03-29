import { ComponentProps, ReactElement } from "react";
import tw, { css, TwStyle } from "twin.macro";

import WithTooltip, { TooltipProps } from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";

import { MyOmit } from "^types/utilities";

import s_button from "^styles/button";

export default function ContentMenu({
  children,
  styles,
  show,
}: {
  children: ReactElement | ReactElement[] | (ReactElement | null)[];
  styles?: TwStyle;
  show: boolean;
}) {
  return (
    <menu css={[s.container({ show }), tw`font-sans`, styles]}>{children}</menu>
  );
}

ContentMenu.Button = function ContentMenuButton({
  children,
  isDisabled = false,
  onClick,
  tooltipProps,
  styles,
}: {
  children: ReactElement;
  isDisabled?: boolean;
  onClick?: () => void;
  tooltipProps: TooltipProps;
  styles?: TwStyle;
}) {
  return (
    <WithTooltip {...tooltipProps}>
      <div
        css={[s.button({ isDisabled }), styles]}
        onClick={() => onClick && !isDisabled && onClick()}
      >
        {children}
      </div>
    </WithTooltip>
  );
};

ContentMenu.VerticalBar = function ContentMenuVerticalBar() {
  return <div css={[s.verticalBar]} />;
};

type WithWarningProps = MyOmit<
  ComponentProps<typeof WithWarning>,
  "children" | "proceedButtonStyles"
>;

ContentMenu.ButtonWithWarning = function ButtonWithWarning({
  children,
  tooltipProps,
  warningProps,
  styles,
}: {
  children: ReactElement;
  tooltipProps: TooltipProps;
  warningProps: WithWarningProps;
  styles?: TwStyle;
}) {
  return (
    <WithWarning {...warningProps}>
      <ContentMenu.Button tooltipProps={tooltipProps} styles={styles}>
        {children}
      </ContentMenu.Button>
    </WithWarning>
  );
};

const s = {
  container: ({ show }: { show: boolean }) => css`
    ${tw`absolute z-30 px-sm py-xs inline-flex items-center gap-sm bg-white rounded-md shadow-md border`}
    ${tw`opacity-70 hover:opacity-100 hover:z-40 text-gray-400 hover:text-black transition-opacity ease-in-out duration-75`}
      ${!show && tw`opacity-0`},
  `,
  button: (args: { isDisabled?: boolean } | void) => css`
    ${s_button.icon} ${s_button.selectors} ${tw`text-[15px] cursor-pointer p-xxs`} ${args?.isDisabled &&
    tw`cursor-auto text-gray-disabled`}
  `,
  verticalBar: tw`w-[0.5px] h-[15px] bg-gray-200`,
};
