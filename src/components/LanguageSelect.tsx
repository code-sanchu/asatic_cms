import { Listbox, Transition } from "@headlessui/react";
import { CaretDown as CaretDownIcon } from "phosphor-react";
import { Fragment } from "react";
import tw from "twin.macro";
import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/languages";
import s_button from "^styles/button";
import { Language } from "^types/language";

const allLanguagesId = "_ALL";
const allLanguagesSelectOption: Language = {
  id: allLanguagesId,
  name: "all",
};

const LanguageSelect = ({
  selectedLanguage,
  setSelectedLanguage,
}: {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
}) => {
  const languages = useSelector(selectAll);
  const languageOptions = [allLanguagesSelectOption, ...languages];

  return (
    <LanguageSelectUI
      languages={languageOptions}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};

export default LanguageSelect;

const LanguageSelectUI = ({
  languages,
  selectedLanguage,
  setSelectedLanguage,
}: {
  languages: Language[];
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
}) => {
  return (
    <div css={[tw`relative flex items-center gap-md`]}>
      <p>Language:</p>
      <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
        <div css={[tw`relative z-10`]}>
          <Listbox.Button
            css={[tw`focus:outline-none flex items-center gap-xs`]}
          >
            <span>{selectedLanguage.name}</span>
            <span css={[s_button.subIcon, tw`text-xs`]}>
              <CaretDownIcon />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              css={[
                tw`absolute -bottom-sm translate-y-full left-0 bg-white py-md border shadow-md rounded-sm flex flex-col gap-sm`,
              ]}
            >
              {languages.map((language) => {
                const isSelected = language.id === selectedLanguage.id;

                return (
                  <Listbox.Option
                    value={language}
                    css={[tw`list-none`]}
                    key={language.id}
                  >
                    <div css={[tw`px-xl`, !isSelected && tw`cursor-pointer`]}>
                      <span
                        css={[
                          isSelected &&
                            tw`relative  border-b border-green-active`,
                        ]}
                      >
                        {language.name}
                      </span>
                    </div>
                  </Listbox.Option>
                );
              })}
            </div>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};