"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";

type Props = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

const ToolbarButton = ({
  label,
  onClick,
  isActive = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-lg border px-3 py-1.5 text-sm font-medium transition",
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : isActive
          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
};

const WordCleanup = Extension.create({
  name: "wordCleanup",

  addPasteRules() {
    return [];
  },

  addProseMirrorPlugins() {
    return [];
  },

  transformPastedHTML(html) {
    return html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\sclass=("|\')(Mso|msocomtxt)[^"\']*("|\')/gi, "")
      .replace(/\sstyle=("|\')[^"\']*mso-[^"\']*("|\')/gi, "")
      .replace(/<o:p>\s*<\/o:p>/gi, "")
      .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "&nbsp;")
      .replace(/\sxmlns(:\w+)?=("|\')[^"\']*("|\')/gi, "")
      .replace(/<span>\s*<\/span>/gi, "")
      .replace(/<font[^>]*>/gi, "")
      .replace(/<\/font>/gi, "");
  },
});

export default function RichTextEditor({
  value,
  onChange,
  readOnly = false,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnly,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      WordCleanup,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      if (readOnly) return;
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: [
          "tiptap prose prose-sm max-w-none min-h-[240px] p-4 focus:outline-none",
          readOnly ? "bg-slate-100 text-slate-600" : "",
        ].join(" "),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  useEffect(() => {
    if (!editor) return;

    const nextValue = value || "";
    const isSame = editor.getHTML() === nextValue;

    if (!isSame) {
      editor.commands.setContent(nextValue);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
      {!readOnly && (
        <div className="flex flex-wrap gap-2 border-b bg-slate-50 p-3">
          <ToolbarButton
            label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          />

          <ToolbarButton
            label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          />

          <ToolbarButton
            label="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          />

          <ToolbarButton
            label="H1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
          />

          <ToolbarButton
            label="H2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
          />

          <ToolbarButton
            label="P"
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph")}
          />

          <ToolbarButton
            label="• List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
          />

          <ToolbarButton
            label="1. List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
          />

          <ToolbarButton
            label="Left"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
          />

          <ToolbarButton
            label="Center"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
          />

          <ToolbarButton
            label="Right"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
          />

          <ToolbarButton
            label="Justify"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
          />

          <label className="ml-1 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700">
            <span>Color</span>
            <input
              type="color"
              value={editor.getAttributes("textStyle").color || "#000000"}
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
              className="h-7 w-8 cursor-pointer border-0 bg-transparent p-0"
              title="Text color"
            />
          </label>

          <ToolbarButton
            label="Clear"
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
          />
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}