type ImageFieldsNameMap = {
  ["y-position"]: "vertPosition";
  id: "imageId";
  toggleable: "useImage";
  ["aspect-ratio"]: "aspectRatio";
};

type ImageFieldsHelper<
  TFields extends {
    [k in ImageFieldsNameMap[keyof ImageFieldsNameMap]]?: unknown;
  }
> = TFields;

type ImageFieldsValueMap = ImageFieldsHelper<{
  imageId: string | null;
  useImage: boolean;
  vertPosition: number;
  aspectRatio?: number;
}>;

export type ImageFields<TName extends keyof ImageFieldsNameMap> = {
  [k in ImageFieldsNameMap[TName]]: ImageFieldsValueMap[k];
};

export type SummaryImageField<
  TIsToggleable extends "isToggleable" | "isNotToggleable"
> = {
  summaryImage: ImageFields<
    TIsToggleable extends "isToggleable"
      ? "toggleable" | "id" | "y-position"
      : "id" | "y-position"
  >;
};
