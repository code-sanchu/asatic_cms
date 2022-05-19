import { cloneElement, FormEvent, ReactElement, useState } from "react";
import {
  Editor,
  EditorContent,
  useEditor,
  isTextSelection,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import TipTapLink from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import tw, { css } from "twin.macro";
import {
  ArrowUUpLeft,
  ArrowUUpRight,
  Link,
  ListBullets,
  ListNumbers,
  Quotes,
  TextBolder,
  TextItalic,
  Image as ImageIcon,
  Trash,
} from "phosphor-react";

import WithTooltip from "^components/WithTooltip";
import WithProximityPopover from "^components/WithProximityPopover";
import WithSelectImage from "^components/WithSelectImage";
import BubbleMenuShell from "^components/text-editor/BubbleMenu";

import s_button from "^styles/button";
import WithWarning from "^components/WithWarning";

// todo: go over globals.css
// todo: change font to tamil font when on tamil translation and vice versa. Will be different instances so can pass in as prop.

// todo: entire image functionality
// todo: image caption. Need to be done so tailwind 'prose' understands it as such.

// todo: menu should be fixed; scrolling should occur within the article body

// todo: border/outline on hocus

// * IMAGES
// * can maybe just use native <img /> tag in CMS; convert to NextImage in frontend
// * ** do storage tokens persist between sessions? From local development, they seem to; (restarted emulators, persisted next day)

const RichTextEditor = ({
  initialContent,
  onUpdate,
  placeholder,
}: {
  initialContent: string;
  onUpdate: (output: string) => void;
  placeholder: string | (() => string);
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        showOnlyWhenEditable: false,
        showOnlyCurrent: false,
        placeholder,
      }),
      TipTapLink.configure({
        openOnClick: false,
        linkOnPaste: false,
      }),
      Image,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose md:prose-lg font-serif-eng pb-lg focus:outline-none",
      },
    },
    content: initialContent,
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className="group"
      css={[s_editor.container]}
      onBlur={() => {
        const output = editor.getHTML();
        onUpdate(output);
      }}
    >
      <Menu editor={editor} />
      <BubbleMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const s_editor = {
  container: tw`relative`,
};

export default RichTextEditor;

//
const Menu = ({ editor }: { editor: Editor }) => {
  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  const selection = editor.state.selection;
  const isSelection = !selection.empty;
  const isSelectedText = isSelection && isTextSelection(selection);

  return (
    <div css={[s_menu.container]}>
      <menu css={[s_menu.menu]}>
        <MenuButton
          icon={<ArrowUUpLeft />}
          onClick={() => editor.chain().focus().undo().run()}
          tooltipText={canUndo ? "undo" : "nothing to undo"}
          isDisabled={!canUndo}
        />
        <MenuButton
          icon={<ArrowUUpRight />}
          onClick={() => editor.chain().focus().redo().run()}
          tooltipText={canRedo ? "redo" : "nothing to redo"}
          isDisabled={!canRedo}
        />
        <MenuButton
          icon={<TextBolder />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          tooltipText="bold"
          isActive={editor.isActive("bold")}
        />
        <MenuButton
          icon={<TextItalic />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          tooltipText="italic"
          isActive={editor.isActive("italic")}
        />
        <MenuButton
          icon={<ListBullets />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          tooltipText="bullet list"
          isActive={editor.isActive("bulletList")}
        />
        <MenuButton
          icon={<ListNumbers />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          tooltipText="ordered list"
          isActive={editor.isActive("orderedList")}
        />
        <LinkPopover
          buttonProps={{ canLink: isSelectedText }}
          panelProps={{
            initialValue: editor.getAttributes("link").href,
            setLink: (link: string) =>
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: link, target: "_blank" })
                .run(),
            unsetLink: () =>
              editor.chain().focus().extendMarkRange("link").unsetLink().run(),
          }}
        />
        <MenuButton
          icon={<Quotes />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          tooltipText="quote"
          isActive={editor.isActive("blockquote")}
        />
        <WithSelectImage
          onSelectImage={(URL) => {
            editor
              .chain()
              .focus()
              .setImage({
                src: URL,
              })
              .run();
          }}
        >
          <MenuButton icon={<ImageIcon />} tooltipText="insert image" />
        </WithSelectImage>
      </menu>
    </div>
  );
};

const s_menu = {
  // * container is to allow spacing whilst maintaining hover between editor and menu
  container: tw`z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 -translate-y-full absolute min-w-full transition-opacity ease-in-out duration-150`,
  menu: tw`mb-sm w-full px-sm py-xs flex items-center gap-xs bg-white rounded-md border-2 border-black`,
};

const MenuButton = ({
  icon,
  onClick,
  tooltipText,
  isActive,
  isDisabled,
}: {
  icon: ReactElement;
  onClick?: () => void;
  tooltipText: string;
  isActive?: boolean;
  isDisabled?: boolean;
}) => {
  return (
    <WithTooltip text={tooltipText}>
      <button
        css={[
          s_menuButton.button,
          isDisabled && s_menuButton.disabled,
          isActive && s_menuButton.isActive,
        ]}
        onClick={onClick}
        type="button"
      >
        {cloneElement(icon, { weight: "bold" })}
      </button>
    </WithTooltip>
  );
};

const s_menuButton = {
  button: css`
    ${s_button.icon} ${s_button.selectors}
    ${tw`text-base p-xxs`}
  `,
  disabled: tw`cursor-auto text-gray-disabled`,
  isActive: tw`bg-gray-400 text-white`,
};

type LinkButtonProps = {
  canLink: boolean;
};

type LinkPanelProps = {
  initialValue: string | undefined;
  setLink: (link: string) => void;
  unsetLink: () => void;
};

const LinkPopover = ({
  buttonProps,
  panelProps,
}: {
  buttonProps: LinkButtonProps;
  panelProps: LinkPanelProps;
}) => {
  return (
    <WithProximityPopover
      disabled={!buttonProps.canLink}
      panelContentElement={({ close: closePanel }) => (
        <LinkPanel closePanel={closePanel} {...panelProps} />
      )}
    >
      <LinkButton {...buttonProps} />
    </WithProximityPopover>
  );
};

const LinkButton = ({ canLink }: LinkButtonProps) => {
  return (
    <MenuButton
      icon={<Link />}
      tooltipText={canLink ? "set link" : "select text before setting link"}
      isDisabled={!canLink}
    />
  );
};

const LinkPanel = ({
  closePanel,
  setLink,
  unsetLink,
  initialValue,
}: { closePanel: () => void } & LinkPanelProps) => {
  const [value, setValue] = useState(initialValue || "");

  console.log(initialValue);
  const selectedTextHasLink = initialValue?.length;

  const handleEditLink = () => {
    const isInputtedValue = value.length;

    if (isInputtedValue) {
      setLink(value);
    } else {
      unsetLink();
    }

    closePanel();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleEditLink();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div css={[s_linkPanel.input.container]}>
        <input
          css={[
            s_linkPanel.input.input,
            s_linkPanel.input.unfocused,
            s_linkPanel.input.focused,
          ]}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter link here"
          type="text"
        />
      </div>
      <div css={[s_linkPanel.buttons.container]}>
        {selectedTextHasLink ? (
          <button
            css={[
              s_linkPanel.buttons.button,
              tw`border-gray-600 text-gray-700`,
            ]}
            onClick={unsetLink}
            type="button"
          >
            Remove link
          </button>
        ) : null}
        <button
          css={[s_linkPanel.buttons.button, tw`border-gray-600 text-gray-700`]}
          onClick={() => {
            handleEditLink();
          }}
          type="button"
        >
          Set link
        </button>
      </div>
    </form>
  );
};

const s_linkPanel = {
  input: {
    container: tw`px-lg py-lg`,
    input: tw`outline-none border rounded-sm transition-all ease-in duration-75`,
    focused: tw`focus:outline-none focus:border-gray-500 focus:px-3 focus:py-2`,
    unfocused: tw`p-0 border-transparent`,
  },
  buttons: {
    container: tw`flex justify-between items-center px-lg py-sm bg-gray-50 rounded-md`,
    button: tw`py-1 px-2 border-2 uppercase tracking-wide text-xs rounded-sm font-medium hover:bg-gray-100 bg-gray-50 transition-colors ease-in-out duration-75`,
  },
};

type Selection = Editor["state"]["selection"] & {
  node?: { type: { name: string } };
};

// * programmatic control of bubble menu wasn't working so below is a workaround. May have to create own bubble menu from scratch to do it properly. See https://github.com/ueberdosis/tiptap/issues/2305
const BubbleMenu = ({ editor }: { editor: Editor }) => {
  const selection = editor.state.selection as Selection;
  const isSelectedImage = selection.node?.type.name === "image";

  return (
    <BubbleMenuShell editor={editor}>
      <>
        {isSelectedImage ? (
          <div css={[s_imageMenu.menu]}>
            <WithWarning
              callbackToConfirm={() =>
                editor.chain().focus().deleteSelection().run()
              }
              warningText={{ heading: "Delete image?" }}
            >
              <MenuButton icon={<Trash />} tooltipText="delete image" />
            </WithWarning>
          </div>
        ) : null}
      </>
    </BubbleMenuShell>
  );
};

const s_imageMenu = {
  menu: tw`px-xs py-xxs flex items-center gap-xs bg-white rounded-md border shadow-lg`,
};
