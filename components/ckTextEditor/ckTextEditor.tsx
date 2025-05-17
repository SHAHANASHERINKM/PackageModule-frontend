"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Dynamically import CKEditor with SSR disabled
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

interface TextEditorProps {
  value: string;
  onChange: (data: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<any>(null);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "6px",
        
      }}
    >
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onReady={(editor: any) => {
          editorRef.current = editor;
          console.log("Editor ready");
        }}
        onChange={(_: unknown, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          placeholder: "Insert your description",
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "undo",
            "redo",
          ],
          removePlugins: [
            "Image",
            "ImageToolbar",
            "ImageCaption",
            "ImageStyle",
            "ImageUpload",
            "EasyImage",
            "MediaEmbed",
            "Table",
            "TableToolbar",
            "CKFinder",
            "CKFinderUploadAdapter",
          ],
        }}
      />
    </div>
  );
};

export default TextEditor;
