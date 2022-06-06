import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectById as selectArticleById } from "^redux/state/articles";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { ROUTES } from "^constants/routes";

const docMappings = {
  article: {
    selector: selectArticleById,
    route: ROUTES.ARTICLES,
  },
};

const HandleRouteValidity = ({
  children,
  docType,
}: {
  children: ReactElement;
  docType: keyof typeof docMappings;
}) => {
  const docId = useGetSubRouteId();
  const doc = useSelector((state) =>
    docMappings[docType].selector(state, docId)
  );

  const router = useRouter();

  useEffect(() => {
    if (doc) {
      return;
    }
    setTimeout(() => {
      router.push("/" + docMappings[docType].route);
    }, 850);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  if (doc) {
    return children;
  }

  return (
    <div css={[tw`w-screen h-screen grid place-items-center`]}>
      <p>Couldn&apos;t find {docType}. Redirecting...</p>
    </div>
  );
};

export default HandleRouteValidity;
