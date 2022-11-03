import {
  cloneElement,
  FormEvent,
  MutableRefObject,
  ReactElement,
  useRef,
  useState,
} from "react";
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
} from "phosphor-react";

import { useStickyContext } from "^context/StickyContext";

import WithTooltip from "^components/WithTooltip";
import WithProximityPopover from "^components/WithProximityPopover";

import { s_editorMenu } from "^styles/menus";

type OnUpdate = {
  onUpdate: (output: string) => void;
};

const ArticleEditor = ({
  initialContent,
  placeholder,
  ...passedProps
}: {
  initialContent: string | undefined;
  placeholder: string | (() => string);
} & OnUpdate) => {
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
    ],
    editorProps: {
      attributes: {
        class: "prose prose-lg w-full font-serif-eng focus:outline-none",
      },
    },
    content: initialContent,
  });

  if (!editor) {
    return null;
  }

  return <EditorInitialised editor={editor} {...passedProps} />;
};

export default ArticleEditor;

const EditorInitialised = ({
  editor,
  onUpdate,
}: { editor: Editor } & OnUpdate) => {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="group"
      css={[tw`relative w-full`]}
      onBlur={(event) => {
        const childHasFocus = event.currentTarget.contains(event.relatedTarget);
        if (childHasFocus) {
          return;
        }
        const output = editor.getHTML();
        onUpdate(output);
      }}
      ref={editorContainerRef}
    >
      <MenuContainer editorRef={editorContainerRef}>
        <MenuButtons editor={editor} />
      </MenuContainer>
      <div
        className="no-scrollbar"
        css={[tw`overflow-x-hidden overflow-y-auto z-20 w-full`]}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const MenuContainer = ({
  children,
  editorRef,
}: {
  children: ReactElement;
  editorRef: MutableRefObject<HTMLDivElement | null>;
}) => {
  const [isSticky, setIsSticky] = useState(false);

  const { scrollContainerTop } = useStickyContext({
    onScroll: ({ scrollContainerTop }) => {
      const stickPointInitialised = typeof scrollContainerTop === "number";
      const editorTopPos = editorRef.current?.getBoundingClientRect().top;
      const editorPosReady = typeof editorTopPos === "number";
      if (!stickPointInitialised || !editorPosReady) {
        return;
      }
      const stickPoint = scrollContainerTop + 60;

      if (editorTopPos <= stickPoint) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    },
  });

  const stickPointInitialised = typeof scrollContainerTop === "number";

  return (
    <menu
      css={[s_menu.menu, isSticky && tw`fixed`]}
      style={{
        top: isSticky && stickPointInitialised ? scrollContainerTop : -60,
      }}
    >
      {children}
    </menu>
  );
};

const s_menu = {
  // * container is to allow spacing whilst maintaining hover between editor and menu
  menu: css`
    ${tw`absolute `}
    ${s_editorMenu.menu} ${tw`mb-sm z-40`}
    ${tw`z-40 invisible opacity-0 group-focus-within:visible group-focus-within:opacity-100 transition-all ease-in-out duration-150`}
  `,
};

const MenuButtons = ({ editor }: { editor: Editor }) => {
  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  const selection = editor.state.selection as Selection;
  const isSelection = !selection.empty;
  const isSelectedText = isSelection && isTextSelection(selection);

  const imageOrVideoIsSelected = Boolean(selection.node?.type.name);

  // const stickMenu = menuTop && menuTop <= canvasTop;

  return (
    <>
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
        isDisabled={imageOrVideoIsSelected}
      />
      <MenuButton
        icon={<TextItalic />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        tooltipText="italic"
        isActive={editor.isActive("italic")}
        isDisabled={imageOrVideoIsSelected}
      />
      <MenuButton
        icon={<ListBullets />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        tooltipText="bullet list"
        isActive={editor.isActive("bulletList")}
        isDisabled={imageOrVideoIsSelected}
      />
      <MenuButton
        icon={<ListNumbers />}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        tooltipText="ordered list"
        isActive={editor.isActive("orderedList")}
        isDisabled={imageOrVideoIsSelected}
      />
      <LinkPopover
        isDisabled={!isSelectedText}
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
        isDisabled={imageOrVideoIsSelected}
      />
    </>
  );
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
          s_editorMenu.button.button,
          isDisabled && s_editorMenu.button.disabled,
          isActive && s_editorMenu.button.isActive,
        ]}
        onClick={onClick}
        type="button"
      >
        {cloneElement(icon, { weight: "bold" })}
      </button>
    </WithTooltip>
  );
};

type LinkPanelProps = {
  initialValue: string | undefined;
  setLink: (link: string) => void;
  unsetLink: () => void;
};

const LinkPopover = ({
  isDisabled,
  panelProps,
}: {
  isDisabled: boolean;
  panelProps: LinkPanelProps;
}) => {
  return (
    <WithProximityPopover
      isDisabled={isDisabled}
      panel={({ close: closePanel }) => (
        <LinkPanel closePanel={closePanel} {...panelProps} />
      )}
    >
      <LinkButton isDisabled={isDisabled} />
    </WithProximityPopover>
  );
};

const LinkButton = ({ isDisabled }: { isDisabled: boolean }) => {
  return (
    <MenuButton
      icon={<Link />}
      tooltipText={isDisabled ? "set link" : "select text before setting link"}
      isDisabled={isDisabled}
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
    container: tw`px-lg py-lg bg-white shadow-md`,
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
  node?: {
    attrs?: {
      alt?: string;
      caption?: string;
      id?: string;
      src?: string;
      title?: string;
      class?: string;
    };
    type: { name: "image" | "external-video" };
  };
};