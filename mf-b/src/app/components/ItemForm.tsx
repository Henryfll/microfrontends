import { FormEvent, useState } from 'react';
import './ItemForm.css';

interface ItemFormProps {
  onCreate: (name: string) => void;
}

export function ItemForm({ onCreate }: ItemFormProps) {
  const [name, setName] = useState<string>('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 50) {
      return;
    }
    onCreate(trimmed);
    setName('');
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <input
        className="item-form__input"
        type="text"
        placeholder="Item name"
        maxLength={50}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button
        className="item-form__submit"
        type="submit"
        disabled={!name.trim() || name.trim().length > 50}
      >
        Add
      </button>
    </form>
  );
}
