import { Component, input, output, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Item } from '../item.model';

@Component({
  selector: 'app-item-row',
  imports: [FormsModule],
  templateUrl: './item-row.component.html',
  styleUrl: './item-row.component.css',
})
export class ItemRowComponent {
  readonly item = input.required<Item>();
  readonly remove = output<number>();
  readonly edit = output<{ id: number; name: string }>();

  protected readonly editing = signal(false);
  protected readonly draft = signal('');
  protected readonly maxLength = 50;

  protected startEdit(): void {
    this.draft.set(this.item().name);
    this.editing.set(true);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
    this.draft.set('');
  }

  protected saveEdit(): void {
    const value = this.draft().trim();
    if (!value || value.length > this.maxLength) {
      return;
    }
    this.edit.emit({ id: this.item().id, name: value });
    this.editing.set(false);
  }

  protected onRemove(): void {
    this.remove.emit(this.item().id);
  }
}
