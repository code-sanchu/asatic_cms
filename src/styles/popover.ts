import tw from "twin.macro";

export const s_popover = {
  panelContainer: tw`p-md bg-white shadow-lg rounded-md border min-w-[55ch] flex flex-col items-start gap-md`,
  title: tw`font-medium text-lg`,
  explanatoryText: tw`text-gray-600 mt-xs text-sm`,
  emptyText: tw`text-gray-800 mt-xs text-sm`,
};
