import { ReactElement } from "react";
import tw from "twin.macro";

import { InvalidIcon, MissingIcon, TranslateIcon } from "^components/Icons";
import WithTooltip, { TooltipProps } from "^components/WithTooltip";
import { ChildAuthorMissingRequirement } from "^types/author";
import { ChildCollectionMissingRequirement } from "^types/collection";
import { EntityName } from "^types/entity";
import { EntityAsChildStatus } from "^types/entity-status";
import { ChildSubjectMissingRequirement } from "^types/subject";
import { ChildTagMissingRequirement } from "^types/tag";

import $IconButton_ from "../_presentation/$IconButton_";

// todo: status type from EntityAsChildStatus
const $RelatedEntityButton_ = ({
  children: icon,
  statusArr,
  entityName,
}: {
  children: ReactElement;
  statusArr: EntityAsChildStatus<
    | ChildAuthorMissingRequirement
    | ChildCollectionMissingRequirement
    | ChildSubjectMissingRequirement
    | ChildTagMissingRequirement
  >[];
  entityName: EntityName;
}) => {
  return (
    <div css={[tw`relative`]}>
      <$IconButton_ tooltip={`${entityName}s`}>{icon}</$IconButton_>
      <ErrorIcon entityName={entityName} statusArr={statusArr} />
    </div>
  );
};

export default $RelatedEntityButton_;

const ErrorIcon = ({
  statusArr,
  entityName,
}: {
  statusArr: EntityAsChildStatus<
    | ChildAuthorMissingRequirement
    | ChildCollectionMissingRequirement
    | ChildSubjectMissingRequirement
    | ChildTagMissingRequirement
  >[];
  entityName: EntityName;
}) => {
  const tooltipText: TooltipProps["text"] | null = statusArr.includes(
    "undefined"
  )
    ? { header: "Error", body: `Includes missing ${entityName}.` }
    : statusArr.includes("draft")
    ? { header: "Warning", body: `Includes unpublished ${entityName}.` }
    : statusArr.find(
        (status) => typeof status === "object" && status.status === `invalid`
      )
    ? {
        header: "Error",
        body: `Includes invalid ${entityName}. The ${entityName} won't be shown as it's missing requirements.`,
      }
    : statusArr.find(
        (status) => typeof status === "object" && status.status === "warning"
      )
    ? {
        header: "Warning",
        body: `Includes ${entityName} with missing translation.`,
      }
    : null;

  if (tooltipText === null) {
    return null;
  }

  return (
    <WithTooltip text={tooltipText}>
      <div
        css={[
          tw`z-40 absolute top-0 right-0 translate-x-2 -translate-y-0.5 scale-90 flex items-center gap-xxxs`,
        ]}
      >
        {statusArr.includes("undefined") ? (
          <span css={[tw`text-red-warning`]}>
            <MissingIcon />
          </span>
        ) : statusArr.includes("draft") ||
          statusArr.find(
            (status) =>
              typeof status === "object" && status.status === "invalid"
          ) ? (
          <span css={[tw`text-red-warning`]}>
            <InvalidIcon />
          </span>
        ) : statusArr.find(
            (status) =>
              typeof status === "object" && status.status === "warning"
          ) ? (
          <span css={[tw`text-orange-500`]}>
            <TranslateIcon />
          </span>
        ) : null}
      </div>
    </WithTooltip>
  );
};
