import LandingCustomSectionSlice from "^context/landing/LandingCustomSectionContext";
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

import { mapIds, sortComponents } from "^helpers/general";

import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import Component from "./component";
import { $PopulatedContainer_ } from "../_presentation";

const Populated = () => {
  const [{ id: sectionId, components }, { reorderCustomSection }] =
    LandingCustomSectionSlice.useContext();

  const componentsOrdered = sortComponents(components);

  return (
    <$PopulatedContainer_>
      {(containerWidth) => (
        <DndSortableContext
          elementIds={mapIds(componentsOrdered)}
          onReorder={reorderCustomSection}
        >
          {componentsOrdered.map((component) => (
            <DndSortableElement
              colSpan={
                containerWidth < 750
                  ? 4
                  : containerWidth < 900
                  ? 2
                  : component.width
              }
              elementId={component.id}
              key={component.id}
            >
              <LandingCustomSectionComponentSlice.Provider
                component={component}
                changeSpanIsDisabled={containerWidth < 900}
                sectionId={sectionId}
              >
                <Component />
              </LandingCustomSectionComponentSlice.Provider>
            </DndSortableElement>
          ))}
        </DndSortableContext>
      )}
    </$PopulatedContainer_>
  );
};

export default Populated;