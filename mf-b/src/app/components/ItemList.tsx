import { Item } from '../item.model';
import { ItemRow } from './ItemRow';
import './ItemList.css';

interface ItemListProps {
  items: Item[];
  onUpdate: (id: number, name: string) => void;
  onRemove: (id: number) => void;
}

export function ItemList({ items, onUpdate, onRemove }: ItemListProps) {
  if (items.length === 0) {
    return <p className="item-list__empty">No items yet. Add your first one above.</p>;
  }

  return (
    <ul className="item-list">
      {items.map((item) => (
        <ItemRow key={item.id} item={item} onUpdate={onUpdate} onRemove={onRemove} />
      ))}
    </ul>
  );
}
