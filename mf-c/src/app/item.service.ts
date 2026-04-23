import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import type { Item } from './item.model';

export interface ItemService {
  list: ComputedRef<Item[]>;
  create: (name: string) => void;
  remove: (id: number) => void;
  update: (id: number, name: string) => void;
}

export function useItemService(): ItemService {
  const items = ref<Item[]>([]);
  const nextId = ref<number>(1);

  const create = (name: string): void => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 50) {
      return;
    }
    const id = nextId.value;
    nextId.value = id + 1;
    items.value = [...items.value, { id, name: trimmed }];
  };

  const remove = (id: number): void => {
    items.value = items.value.filter((item) => item.id !== id);
  };

  const update = (id: number, name: string): void => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 50) {
      return;
    }
    items.value = items.value.map((item) =>
      item.id === id ? { ...item, name: trimmed } : item,
    );
  };

  const list = computed<Item[]>(() =>
    [...items.value].sort((a, b) => a.id - b.id),
  );

  return { list, create, remove, update };
}
