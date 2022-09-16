import { Plus } from "phosphor-react";
import { createContext, ReactElement, useContext, useState } from "react";
import tw from "twin.macro";
import { checkObjectHasField } from "^helpers/general";

type ComponentContextValue = {
  inputIsFocused: boolean;
  inputValue: string;
  setInputIsFocused: (isFocused: boolean) => void;
  setInputValue: (inputValue: string) => void;
};

const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

const ComponentProvider = ({ children }: { children: ReactElement }) => {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <ComponentContext.Provider
      value={{ inputIsFocused, inputValue, setInputIsFocused, setInputValue }}
    >
      {children}
    </ComponentContext.Provider>
  );
};

function InputSelectCombo({ children }: { children: ReactElement }) {
  return (
    <ComponentProvider>
      <div css={[tw`relative w-full`]}>{children}</div>
    </ComponentProvider>
  );
}

export default InputSelectCombo;

InputSelectCombo.useContext = function useInputSelectContext() {
  const context = useContext(ComponentContext);
  const contextIsEmpty = !checkObjectHasField(context);
  if (contextIsEmpty) {
    throw new Error("useInputSelectContext must be used within its provider!");
  }
  return context;
};

const inputId = "input-select-combo-input-id";

InputSelectCombo.Input = function Input({
  onSubmit,
  placeholder,
}: {
  onSubmit: (inputValue: string) => void;
  placeholder: string;
}) {
  const { inputValue, setInputValue, setInputIsFocused } =
    useContext(ComponentContext);

  return (
    <div css={[tw`relative inline-block`]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(inputValue);
        }}
      >
        <div css={[tw`relative`]}>
          <input
            css={[
              tw`px-lg py-1 text-sm outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
            ]}
            id={inputId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            type="text"
            autoComplete="off"
            onFocus={() => setInputIsFocused(true)}
            onBlur={() => setInputIsFocused(false)}
          />
          <label
            css={[tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`]}
            htmlFor={inputId}
          >
            <Plus />
          </label>
          {/* <Language languageText={} show={} /> */}
        </div>
      </form>
    </div>
  );
};

InputSelectCombo.Select = function Select({
  children,
}: {
  children: ReactElement[];
}) {
  const { inputIsFocused } = useContext(ComponentContext);

  return (
    <div
      css={[
        tw`absolute -bottom-2 translate-y-full w-full bg-white border-2 border-gray-200 rounded-sm py-sm text-sm shadow-lg`,
        inputIsFocused ? tw`opacity-100` : tw`opacity-0 h-0`,
        tw`transition-opacity duration-75 ease-linear`,
      ]}
    >
      {children.length ? (
        <div css={[tw`flex flex-col gap-xs items-start`]}>{children}</div>
      ) : (
        <p css={[tw`text-gray-600 ml-sm`]}>No matches</p>
      )}
    </div>
  );
};
