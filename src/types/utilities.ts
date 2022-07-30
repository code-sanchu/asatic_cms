export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

export type ValueOf<T> = T[keyof T];

export type ActionWithArg<T> = (arg: T) => void;
export type ActionNoArg = () => void;

type OmitId<T extends { id: string }> = Omit<T, "id">;
type OmitIdAndTranslationId<T extends { id: string; translationId: string }> =
  Omit<T, "id" | "translationId">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionPayloadNoId<T extends (...args: any) => any> = OmitId<
  Parameters<T>[0]
>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionPayloadNoIdNorTranslationId<T extends (...args: any) => any> =
  OmitIdAndTranslationId<Parameters<T>[0]>;

// export type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type MyOmit<T, K extends keyof T> = HandleEmptyObject<
  Pick<T, Exclude<keyof T, K>>
>;

export type HandleEmptyObject<T> = T extends Record<string, never> ? void : T;

export type OmitFromMethods<TObj, TProps extends string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof TObj]: TObj[K] extends (...args: any) => void
    ? (arg: HandleEmptyObject<Omit<Parameters<TObj[K]>[0], TProps>>) => void
    : never;
};
