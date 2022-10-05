import { useRef, useState, useEffect } from "react";
import isEqual from "lodash.isequal";
import { JSONContent } from "@tiptap/core";

import { truncateJSONContent } from "^helpers/tiptap";

const useTruncateTextEditorContent = (content: JSONContent | null) => {
  const [editorKey, setEditorKey] = useState(Math.random());

  const truncated = truncateJSONContent(content, 240);

  const truncatedPrevRef = useRef(truncated);
  const truncatedPrev = truncatedPrevRef.current;

  useEffect(() => {
    const isChange = !isEqual(truncated, truncatedPrev);
    if (isChange) {
      truncatedPrevRef.current = truncated;
      setEditorKey(Math.random());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [truncated, truncatedPrev]);

  return { editorKey, truncated };
};

export default useTruncateTextEditorContent;
