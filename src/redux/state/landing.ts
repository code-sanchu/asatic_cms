import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { landingApi } from "../services/landing";

import {
  LandingSection,
  LandingSectionAuto,
  LandingSectionCustom,
} from "^types/landing";
import { RootState } from "^redux/store";

type CustomComponent = LandingSectionCustom["components"][number];

const landingAdapter = createEntityAdapter<LandingSection>({
  sortComparer: (a, b) => a.order - b.order,
});
const initialState = landingAdapter.getInitialState();

const landingSlice = createSlice({
  name: "landing",
  initialState,
  reducers: {
    overWriteAll(
      state,
      action: PayloadAction<{
        data: LandingSection[];
      }>
    ) {
      const { data } = action.payload;
      landingAdapter.setAll(state, data);
    },
    addOne(
      state,
      action: PayloadAction<{
        type: LandingSection["type"];
        contentType?: LandingSectionAuto["contentType"];
        newSectionIndex: number;
      }>
    ) {
      const { type, contentType, newSectionIndex } = action.payload;

      const sectionsById = state.ids as string[];
      for (let i = newSectionIndex; i < sectionsById.length; i++) {
        landingAdapter.updateOne(state, {
          id: sectionsById[i],
          changes: {
            order: i + 2,
          },
        });
      }

      const sectionSharedFields = {
        id: generateUId(),
        order: newSectionIndex + 1,
      };
      if (type === "auto" && contentType) {
        const section: LandingSectionAuto = {
          ...sectionSharedFields,
          type: "auto",
          contentType,
        };
        landingAdapter.addOne(state, section);
      } else {
        const section: LandingSectionCustom = {
          ...sectionSharedFields,
          type: "custom",
          components: [],
        };
        landingAdapter.addOne(state, section);
      }
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      landingAdapter.removeOne(state, id);
    },
    moveDown(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;

      const index = state.ids.findIndex((stateId) => stateId === id);
      const nextEntityId = state.ids[index + 1];

      const entity = state.entities[id];
      if (entity) {
        const currentOrder = entity.order;

        landingAdapter.updateOne(state, {
          id,
          changes: {
            order: currentOrder + 1,
          },
        });
      }

      const nextEntity = state.entities[nextEntityId];
      if (nextEntity) {
        const currentOrder = nextEntity.order;
        landingAdapter.updateOne(state, {
          id: nextEntityId,
          changes: {
            order: currentOrder - 1,
          },
        });
      }
    },
    moveUp(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;

      const index = state.ids.findIndex((stateId) => stateId === id);
      const prevEntityId = state.ids[index - 1];

      const entity = state.entities[id];
      if (entity) {
        const currentOrder = entity.order;

        landingAdapter.updateOne(state, {
          id,
          changes: {
            order: currentOrder - 1,
          },
        });
      }

      const prevEntity = state.entities[prevEntityId];
      if (prevEntity) {
        const currentOrder = prevEntity.order;
        landingAdapter.updateOne(state, {
          id: prevEntityId,
          changes: {
            order: currentOrder + 1,
          },
        });
      }
    },
    addCustomComponent(
      state,
      action: PayloadAction<{
        sectionId: string;
        docId: string;
        type: LandingSectionCustom["components"][number]["type"];
      }>
    ) {
      const { sectionId, docId: articleId, type } = action.payload;
      const entity = state.entities[sectionId];
      if (entity && entity.type === "custom") {
        const numComponents = entity.components.length;

        const newComponent: LandingSectionCustom["components"][number] = {
          docId: articleId,
          id: generateUId(),
          order: numComponents + 1,
          width: 2,
          type,
        };

        entity.components.push(newComponent);
      }
    },
    reorderCustomSection(
      state,
      action: PayloadAction<{
        sectionId: string;
        activeId: string;
        overId: string;
      }>
    ) {
      const { activeId, overId, sectionId } = action.payload;

      const entity = state.entities[sectionId];

      if (entity && entity.type === "custom") {
        const activeComponent = entity.components.find(
          (c) => c.id === activeId
        )!;
        const overComponent = entity.components.find((c) => c.id === overId)!;
        const activeOrder = activeComponent.order;
        const overOrder = overComponent.order;

        activeComponent.order = overOrder;
        overComponent.order = activeOrder;
      }
    },
    updateComponentWidth(
      state,
      action: PayloadAction<{
        sectionId: string;
        componentId: string;
        width: CustomComponent["width"];
      }>
    ) {
      const { componentId, sectionId, width } = action.payload;
      const entity = state.entities[sectionId];
      if (entity && entity.type === "custom") {
        const component = entity.components.find((c) => c.id === componentId);

        if (component) {
          component.width = width;
        }
      }
    },
    deleteComponent(
      state,
      action: PayloadAction<{
        sectionId: string;
        componentId: string;
      }>
    ) {
      const { componentId, sectionId } = action.payload;
      const entity = state.entities[sectionId];
      if (entity && entity.type === "custom") {
        const components = entity.components;
        const index = entity.components.findIndex((c) => c.id === componentId);

        components.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      landingApi.endpoints.fetchLanding.matchFulfilled,
      (state, { payload }) => {
        landingAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default landingSlice.reducer;

export const {
  addOne,
  overWriteAll,
  removeOne,
  moveDown,
  moveUp,
  addCustomComponent,
  reorderCustomSection,
  updateComponentWidth,
  deleteComponent,
} = landingSlice.actions;

export const { selectAll, selectById, selectTotal, selectIds } =
  landingAdapter.getSelectors((state: RootState) => state.landing);
