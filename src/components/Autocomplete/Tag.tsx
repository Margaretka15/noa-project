import React from 'react';
import styles from './Autocomplete.module.scss';

type Props = {
    label: string;
    id: string | number;
    onRemove: (id: string | number) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, id: string | number) => void;
};

const Tag: React.FC<Props> = ({ label, id, onRemove, onKeyDown }) => (
    <div
        className={styles.tag}
        tabIndex={0}
        onKeyDown={(e) => onKeyDown(e, id)}
        aria-label={`${label}, press Delete or Backspace to remove`}
    >
        <span className={styles.tagText}>{label}</span>
        <span
            className={styles.remove}
            onClick={() => onRemove(id)}
            aria-label={`Remove ${label}`}
            role="button"
        >
      ×
    </span>
    </div>
);

export default Tag;
