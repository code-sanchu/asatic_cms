import SubjectSlice from "^context/subjects/SubjectContext";
import { useComponentContext } from "../../../Context";

import { $SelectEntity_ } from "^components/rich-popover/_presentation";
import { Translation_ } from "^components/rich-popover/_containers/SelectEntity";

const Item = () => {
  const { parentEntityData, addSubjectRelations } = useComponentContext();
  const [{ id: subjectId, translations }] = SubjectSlice.useContext();

  const processed = translations.filter((t) => t.title?.length);

  return (
    <$SelectEntity_
      addEntityToParent={() => addSubjectRelations(subjectId)}
      entityType="subject"
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
