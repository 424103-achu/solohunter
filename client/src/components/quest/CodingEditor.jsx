import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { LANGUAGES } from '../../utils/constants';

const SUPPORTED_LANGUAGES = LANGUAGES.filter((l) => l.id === 'python' || l.id === 'java');

// Fully controlled — parent owns code state
const CodingEditor = ({ code = '', language = 'python', questId = '', onChange, onLanguageChange, readOnly = false, aiQuest = false, layoutKey }) => {
  const editorRef = useRef(null);
  const monacoLang = LANGUAGES.find((l) => l.id === language)?.monacoId || 'python';

  useEffect(() => {
    if (editorRef.current) {
      // Small delay lets the flex layout settle before measuring
      setTimeout(() => editorRef.current?.layout(), 50);
    }
  }, [layoutKey]);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-primary/10 shrink-0" style={{ background: '#0a0c18' }}>
        <div className="flex items-center gap-2">
          <span className="system-tag text-[8px]">Code Editor</span>
          {aiQuest && (
            <span className="text-[9px] font-system tracking-wider px-2 py-0.5 rounded border border-primary/20 bg-primary/8 text-primary-light">
              AI Quest
            </span>
          )}
        </div>
        <select
          value={language}
          onChange={(e) => onLanguageChange?.(e.target.value)}
          className="text-xs bg-dark-surface text-text-primary border border-primary/15 rounded px-2 py-1 font-game focus:outline-none focus:border-secondary/40"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>{lang.label}</option>
          ))}
        </select>
      </div>

      {/* Editor — fills remaining height */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          path={`quest-${questId}-${language}`}
          onChange={(val) => onChange?.(val ?? '')}
          onMount={(editor) => { editorRef.current = editor; }}
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
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontLigatures: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodingEditor;
