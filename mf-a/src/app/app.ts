import { Component } from '@angular/core';
import { ItemFormComponent } from './item-form/item-form.component';
import { ItemListComponent } from './item-list/item-list.component';

@Component({
  selector: 'app-root',
  imports: [ItemFormComponent, ItemListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = 'MF-A';
  protected readonly framework = 'Angular 21.1.0';
}
