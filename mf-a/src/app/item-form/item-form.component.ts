import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-form',
  imports: [FormsModule],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.css',
})
export class ItemFormComponent {
  private readonly itemService = inject(ItemService);
  protected readonly name = signal('');
  protected readonly error = signal('');
  protected readonly maxLength = 50;

  protected submit(): void {
    const value = this.name().trim();
    if (!value) {
      this.error.set('El nombre es obligatorio');
      return;
    }
    if (value.length > this.maxLength) {
      this.error.set('Máximo 50 caracteres');
      return;
    }
    this.itemService.create(value);
    this.name.set('');
    this.error.set('');
  }
}
