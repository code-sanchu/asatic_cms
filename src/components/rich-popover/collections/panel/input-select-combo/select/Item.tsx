import CollectionSlice from "^context/collections/CollectionContext";
import { useComponentContext } from "../../../Context";

import { $SelectEntity_ } from "^components/rich-popover/_presentation";
import { Translation_ } from "^components/rich-popover/_containers/SelectEntity";

const Item = () => {
  const { addCollectionRelations, parentEntityData } = useComponentContext();
  const [{ id: collectionId, translations }] = CollectionSlice.useContext();

  const processed = translations.filter((t) => t.title?.length);

  return (
    <$SelectEntity_
      addEntityToParent={() => addCollectionRelations(collectionId)}
      entityType="collection"
      parentType={parentEntityData.name}
    >
      {processed.map((translation) => (
        <Translation_
          languageId={translation.languageId}
          text={translation.title!}
          key={translation.id}
        />
      ))}
    </$SelectEntity_>
  );
};

export default Item;
