import ArticleVideoSectionSlice from "^context/articles/ArticleVideoSectionContext";

import Empty from "./Empty";
import Populated from "./Populated";

export default function ImageSection() {
  const [{ youtubeId }] = ArticleVideoSectionSlice.useContext();

  return youtubeId ? <Populated /> : <Empty />;
}
