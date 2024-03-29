import type { NextPage } from "next";
import tw from "twin.macro";

import Head from "^components/Head";
import { Header_ } from "^components/header";
import { DisplayPageLinks } from "^components/EntitiesLinksList";

const Home: NextPage = () => {
  return (
    <>
      <Head />
      <PageContent />
    </>
  );
};

export default Home;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex flex-col`]}>
      <Header_ />
      <Body />
    </div>
  );
};

const Body = () => {
  return (
    <div css={[tw`flex-grow grid place-items-center`]}>
      <div>
        <h3 css={[tw`text-2xl font-medium`]}>Asatic Site Editor</h3>
        <div css={[tw`flex flex-col gap-sm mt-lg`]}>
          <DisplayPageLinks />
        </div>
      </div>
    </div>
  );
};
