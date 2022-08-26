import {
  ActionReducerMapBuilder,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

import {
  SecondaryContentFields,
  TranslationGeneric,
} from "^types/display-content";

import createDisplayContentGenericSlice, {
  DisplayEntity,
} from "./displayContentGeneric";

export type PrimaryEntity<TTranslation extends TranslationGeneric> =
  DisplayEntity<TTranslation> & SecondaryContentFields;

export default function createPrimaryContentGenericSlice<
  TTranslation extends TranslationGeneric,
  TEntity extends PrimaryEntity<TTranslation>,
  Reducers extends SliceCaseReducers<EntityState<TEntity>>
>({
  name = "",
  initialState,
  reducers,
  extraReducers,
}: {
  name: string;
  initialState: EntityState<TEntity>;
  reducers: ValidateSliceCaseReducers<EntityState<TEntity>, Reducers>;
  extraReducers: (
    builder: ActionReducerMapBuilder<EntityState<TEntity>>
  ) => void;
}) {
  return createDisplayContentGenericSlice({
    name,
    initialState,
    reducers: {
      addAuthor(
        state,
        action: PayloadAction<{ id: string; authorId: string }>
      ) {
        const { id, authorId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.authorsIds.push(authorId);
        }
      },
      removeAuthor(
        state,
        action: PayloadAction<{ id: string; authorId: string }>
      ) {
        const { id, authorId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          const authorIds = entity.authorsIds;
          const index = authorIds.findIndex((id) => id === authorId);

          authorIds.splice(index, 1);
        }
      },
      addCollection(
        state,
        action: PayloadAction<{ id: string; collectionId: string }>
      ) {
        const { id, collectionId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.collectionsIds.push(collectionId);
        }
      },
      removeCollection(
        state,
        action: PayloadAction<{ id: string; collectionId: string }>
      ) {
        const { id, collectionId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          const collectionsIds = entity.collectionsIds;
          const index = collectionsIds.findIndex((id) => id === collectionId);

          collectionsIds.splice(index, 1);
        }
      },
      addSubject(
        state,
        action: PayloadAction<{ id: string; subjectId: string }>
      ) {
        const { id, subjectId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.subjectsIds.push(subjectId);
        }
      },
      removeSubject(
        state,
        action: PayloadAction<{ id: string; subjectId: string }>
      ) {
        const { id, subjectId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          const subjectsIds = entity.subjectsIds;
          const index = subjectsIds.findIndex((id) => id === subjectId);

          subjectsIds.splice(index, 1);
        }
      },
      addTag(state, action: PayloadAction<{ id: string; tagId: string }>) {
        const { id, tagId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.tagsIds.push(tagId);
        }
      },
      removeTag(state, action: PayloadAction<{ id: string; tagId: string }>) {
        const { id, tagId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          const tagsIds = entity.tagsIds;
          const index = tagsIds.findIndex((id) => id === tagId);

          tagsIds.splice(index, 1);
        }
      },
      ...reducers,
    },
    extraReducers,
  });
}
