"use client";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React from 'react';

interface TextEditorProps {
  value: string;
  onChange: (data: string) => void;
}

const Editor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '6px' }}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          placeholder: "Write your success message here...",
          licenseKey: "",
          ckfinder: {
            uploadUrl: "http://localhost:3000/package/success-images", 
          },
          // You can extend this toolbar and plugin list later as needed
        }}
        onReady={(editor: any) => {
          console.log('Editor is ready!', editor);
        }}
        onChange={(_, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default Editor;
