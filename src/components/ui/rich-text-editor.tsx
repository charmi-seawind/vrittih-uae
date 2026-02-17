"use client";

import { useState, useRef } from "react";
import { Button } from "./button";
import { Bold, Italic, List, Smile } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`border rounded-md ${className}`}>
      <div className="flex gap-1 p-2 border-b bg-gray-50">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => execCommand('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => execCommand('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => execCommand('insertUnorderedList')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            const emoji = prompt("Enter emoji:");
            if (emoji) execCommand('insertText', emoji);
          }}
        >
          <Smile className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="p-3 min-h-[150px] focus:outline-none prose max-w-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        onBlur={handleInput}
        suppressContentEditableWarning={true}
        style={{
          minHeight: '150px'
        }}
      />
    </div>
  );
}