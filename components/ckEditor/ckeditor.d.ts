declare module '@ckeditor/ckeditor5-react' {
    import * as React from 'react';
    interface CKEditorProps {
      editor: any;
      data?: string;
      config?: Record<string, unknown>;
      disabled?: boolean;
      onReady?: (editor: any) => void;
      onChange?: (event: any, editor: any) => void;
      onBlur?: (event: any, editor: any) => void;
      onFocus?: (event: any, editor: any) => void;
    }
  
    export class CKEditor extends React.Component<CKEditorProps> {}
  }
  
  declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditor: any;
    export = ClassicEditor;
  }
  
  declare module '@ckeditor/ckeditor5-core';
  


declare module '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
// types/ckeditor-plugins.d.ts or src/ckeditor-plugins.d.ts







