import { useRef, useState } from 'react';
import { IconUpload } from './Icons';
import './FileDropzone.css';

// Zone de dépôt de fichiers façon "glisser-déposer", utilisée dans le
// questionnaire de devis. `files` est toujours un tableau (même pour un seul
// fichier) et `onFilesChange` reçoit le tableau mis à jour.
export default function FileDropzone({
  label,
  hint,
  multiple = false,
  accept,
  files = [],
  onFilesChange,
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    onFilesChange(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
  };

  const removeFile = (index) => {
    const next = files.slice();
    next.splice(index, 1);
    onFilesChange(next);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="dropzone-field">
      {label && <span className="dropzone-label">{label}</span>}
      <div
        className={`dropzone ${dragActive ? 'dropzone-active' : ''}`}
        onClick={openPicker}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          addFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
      >
        <span className="dropzone-icon">
          <IconUpload width={28} height={28} strokeWidth={1.4} />
        </span>
        <p className="dropzone-text">
          Glissez-déposez {multiple ? 'vos fichiers' : 'votre fichier'} ici
        </p>
        <p className="dropzone-sub">
          ou <span className="dropzone-browse">parcourez</span> votre ordinateur
        </p>
        {hint && <p className="dropzone-hint">{hint}</p>}
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="dropzone-filelist">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <span>{f.name}</span>
              <button
                type="button"
                className="dropzone-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                aria-label={`Retirer ${f.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
