import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'blockquote', 'code-block',
  'link'
];

export default function RichTextEditor({ value, onChange }) {
  return (
    <div className="rich-text-editor">
      <style>{`
        .rich-text-editor .ql-container {
          min-height: 400px;
          font-size: 16px;
          border: none;
          font-family: inherit;
        }
        
        .rich-text-editor .ql-editor {
          padding: 0;
          color: #3C3835;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #C4A57B;
          opacity: 0.5;
          font-style: normal;
        }
        
        .rich-text-editor .ql-toolbar {
          border: 1px solid #E8DDD0;
          border-radius: 12px;
          background: #F5F0E8;
          margin-bottom: 20px;
          padding: 12px;
        }
        
        .rich-text-editor .ql-stroke {
          stroke: #8B7355;
        }
        
        .rich-text-editor .ql-fill {
          fill: #8B7355;
        }
        
        .rich-text-editor .ql-picker-label {
          color: #8B7355;
        }
        
        .rich-text-editor .ql-active .ql-stroke {
          stroke: #6F5A44;
        }
        
        .rich-text-editor .ql-active .ql-fill {
          fill: #6F5A44;
        }
        
        .rich-text-editor .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          color: #3C3835;
          margin-bottom: 0.5em;
        }
        
        .rich-text-editor .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          color: #3C3835;
          margin-bottom: 0.4em;
        }
        
        .rich-text-editor .ql-editor h3 {
          font-size: 1.25em;
          font-weight: bold;
          color: #3C3835;
          margin-bottom: 0.3em;
        }
        
        .rich-text-editor .ql-editor strong {
          font-weight: 700;
        }
        
        .rich-text-editor .ql-editor em {
          font-style: italic;
        }
        
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #8B7355;
          padding-left: 1em;
          margin: 1em 0;
          color: #8B7355;
          font-style: italic;
        }
        
        .rich-text-editor .ql-editor code-block {
          background: #F5F0E8;
          padding: 1em;
          border-radius: 8px;
          margin: 1em 0;
        }
      `}</style>
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your thoughts..."
      />
    </div>
  );
}