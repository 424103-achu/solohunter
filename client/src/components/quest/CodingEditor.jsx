import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { LANGUAGES } from '../../utils/constants';

const CodingEditor = ({ initialCode = '', language = 'javascript', onCodeChange, onLanguageChange, readOnly = false }) => {
  const [code, setCode] = useState(initialCode);

  const handleChange = (value) => {
    setCode(value);
    onCodeChange?.(value);
  };

  const monacoLang = LANGUAGES.find((l) => l.id === language)?.monacoId || 'javascript';

  return (
    <div className="rounded overflow-hidden border border-primary/15">
      {/* Language selector */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-primary/10" style={{ background: '#0c0e1a' }}>
        <span className="system-tag text-[8px]">Code Editor</span>
        <select
          value={language}
          onChange={(e) => onLanguageChange?.(e.target.value)}
          className="text-xs bg-dark-surface text-text-primary border border-primary/15 rounded px-2 py-1 font-game focus:outline-none focus:border-secondary/40"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>{lang.label}</option>
          ))}
        </select>
      </div>

      {/* Editor */}
      <Editor
        height="400px"
        language={monacoLang}
        value={code}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          tabSize: 2,
          automaticLayout: true,
          readOnly,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
};

export default CodingEditor;
