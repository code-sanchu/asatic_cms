import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { authorsApi } from "^redux/services/authors";
import { RootState } from "^redux/store";

import { Author } from "^types/author";

const authorAdapter = createEntityAdapter<Author>();
const initialState = authorAdapter.getInitialState();

const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Author;
      }>
    ) {
      const { data } = action.payload;
      authorAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Author[];
      }>
    ) {
      const { data } = action.payload;
      authorAdapter.setAll(state, data);
    },
    addOne(
      state,
      action: PayloadAction<{ id?: string; name: string; languageId: string }>
    ) {
      const { id, name, languageId } = action.payload;
      const author: Author = {
        id: id || generateUId(),
        translations: [{ id: generateUId(), languageId, name }],
        relatedEntities: [],
      };

      authorAdapter.addOne(state, author);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      authorAdapter.removeOne(state, id);
    },
    addRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntity: Author["relatedEntities"][number];
      }>
    ) {
      const { id, relatedEntity } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.relatedEntities.push(relatedEntity);
    },
    removeRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntityId: string;
      }>
    ) {
      const { id, relatedEntityId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.relatedEntities.findIndex(
        (e) => e.entityId === relatedEntityId
      );
      entity.relatedEntities.splice(index, 1);
    },
    updateName(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        translationId: string;
      }>
    ) {
      const { id, name, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          translation.name = name;
        }
      }
    },
    addTranslation(
      state,
      action: PayloadAction<{
        id: string;
        languageId: string;
        name?: string;
      }>
    ) {
      const { id, languageId, name } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        // todo: feel like it's incorrect to have name: "" when the real intent is name: undefined or name: null
        translations.push({ id: generateUId(), languageId, name: name || "" });
      }
    },
    removeTranslation(
      state,
      action: PayloadAction<{
        id: string;
        translationId: string;
      }>
    ) {
      const { id, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const index = translations.findIndex((t) => t.id === translationId);
        translations.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authorsApi.endpoints.fetchAuthors.matchFulfilled,
      (state, { payload }) => {
        authorAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default authorSlice.reducer;

export const {
  overWriteOne,
  overWriteAll,
  removeOne,
  addOne,
  updateName,
  addTranslation,
  removeTranslation,
  addRelatedEntity: addRelatedEntityToAuthor,
  removeRelatedEntity: removeRelatedEntityFromAuthor,
} = authorSlice.actions;

const {
  selectAll: selectAuthors,
  selectById: selectAuthorById,
  selectIds,
  selectTotal: selectTotalAuthors,
} = authorAdapter.getSelectors((state: RootState) => state.authors);

type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectAuthorsIds = selectIds as unknown as SelectIdsAsserted;

const selectAuthorsByIds = createSelector(
  [selectAuthors, (_state: RootState, ids: string[]) => ids],
  (authors, ids) => ids.map((id) => authors.find((s) => s.id === id))
);

export {
  selectAuthors,
  selectAuthorById,
  selectTotalAuthors,
  selectAuthorsIds,
  selectAuthorsByIds,
};
