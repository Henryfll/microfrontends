import { Injectable, signal, computed } from '@angular/core';
import { Item } from './item.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly items = signal<Item[]>([]);
  private nextId = 1;

  readonly list = computed(() =>
    [...this.items()].sort((a, b) => a.id - b.id)
  );

  create(name: string): void {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 50) {
      return;
    }
    const item: Item = { id: this.nextId++, name: trimmed };
    this.items.update((current) => [...current, item]);
  }

  remove(id: number): void {
    this.items.update((current) => current.filter((item) => item.id !== id));
  }

  update(id: number, name: string): void {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 50) {
      return;
    }
    this.items.update((current) =>
      current.map((item) => (item.id === id ? { ...item, name: trimmed } : item))
    );
  }
}
