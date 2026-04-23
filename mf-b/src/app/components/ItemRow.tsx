import { useState } from 'react';
import { Item } from '../item.model';
import './ItemRow.css';

interface ItemRowProps {
  item: Item;
  onUpdate: (id: number, name: string) => void;
  onRemove: (id: number) => void;
}

export function ItemRow({ item, onUpdate, onRemove }: ItemRowProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(item.name);

  const startEdit = (): void => {
    setDraft(item.name);
    setEditing(true);
  };

  const cancelEdit = (): void => {
    setEditing(false);
    setDraft(item.name);
  };

  const saveEdit = (): void => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed.length > 50) {
      return;
    }
    onUpdate(item.id, trimmed);
    setEditing(false);
  };

  return (
    <li className="item-row">
      <span className="item-row__id">#{item.id}</span>
      {editing ? (
        <input
          className="item-row__input"
          type="text"
          maxLength={50}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      ) : (
        <span className="item-row__name">{item.name}</span>
      )}
      <div className="item-row__actions">
        {editing ? (
          <>
            <button
              className="item-row__btn item-row__btn--save"
              type="button"
              onClick={saveEdit}
              disabled={!draft.trim() || draft.trim().length > 50}
            >
              Save
            </button>
            <button
              className="item-row__btn item-row__btn--cancel"
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="item-row__btn item-row__btn--edit"
              type="button"
              onClick={startEdit}
            >
              Edit
            </button>
            <button
              className="item-row__btn item-row__btn--remove"
              type="button"
              onClick={() => onRemove(item.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}
