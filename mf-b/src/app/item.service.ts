import { useCallback, useState } from 'react';
import { Item } from './item.model';

export interface ItemService {
  list: Item[];
  create: (name: string) => void;
  remove: (id: number) => void;
  update: (id: number, name: string) => void;
}

export function useItemService(): ItemService {
  const [items, setItems] = useState<Item[]>([]);
  const [nextId, setNextId] = useState<number>(1);

  const create = useCallback(
    (name: string): void => {
      const trimmed = name.trim();
      if (!trimmed || trimmed.length > 50) {
        return;
      }
      const id = nextId;
      setNextId((current) => current + 1);
      setItems((current) => [...current, { id, name: trimmed }]);
    },
    [nextId],
  );

  const remove = useCallback((id: number): void => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const update = useCallback((id: number, name: string): void => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 50) {
      return;
    }
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, name: trimmed } : item)),
    );
  }, []);

  const list = [...items].sort((a, b) => a.id - b.id);

  return { list, create, remove, update };
}
