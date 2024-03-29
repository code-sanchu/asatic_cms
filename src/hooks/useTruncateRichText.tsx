import { useRef, useState, useEffect } from "react";
import isEqual from "lodash.isequal";

import { truncateText } from "^helpers/tiptap";

const useTruncateTextEditorContent = (
  content: string | null | undefined,
  numChars?: number
) => {
  const [editorKey, setEditorKey] = useState(Math.random());

  const truncated = content ? truncateText(content, numChars || 240) : null;

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
