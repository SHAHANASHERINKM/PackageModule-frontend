// ckTextEditor.tsx

import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface TextEditorProps {
  value: string;
  onChange: (data: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const [editorData, setEditorData] = useState(value);

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '6px' }}>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        config={{
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'blockQuote',
            'undo',
            'redo'
          ],
          removePlugins: [
            'Image',
            'ImageToolbar',
            'ImageCaption',
            'ImageStyle',
            'ImageUpload',
            'EasyImage',
            'MediaEmbed',
            'Table',
            'TableToolbar',
            'CKFinder',
            'CKFinderUploadAdapter'
          ]
        }}
        onChange={(_, editor: any) => {
          const data = editor.getData();
          setEditorData(data);
          onChange(data);
        }}
        onReady={(editor: any) => {
          console.log('Editor is ready!', editor);
        }}
      />
    </div>
  );
};

export default TextEditor;
