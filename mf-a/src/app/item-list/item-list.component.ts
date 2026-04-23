import { Component, inject } from '@angular/core';
import { ItemService } from '../item.service';
import { ItemRowComponent } from '../item-row/item-row.component';

@Component({
  selector: 'app-item-list',
  imports: [ItemRowComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent {
  private readonly itemService = inject(ItemService);
  protected readonly items = this.itemService.list;

  protected onRemove(id: number): void {
    this.itemService.remove(id);
  }

  protected onEdit(payload: { id: number; name: string }): void {
    this.itemService.update(payload.id, payload.name);
  }
}
