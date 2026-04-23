import { useItemService } from './item.service';
import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import './App.css';

const TITLE = 'MF-B';
const FRAMEWORK = 'React 19.2.0';

export function App() {
  const { list, create, remove, update } = useItemService();

  return (
    <main className="shell">
      <header className="shell__header">
        <h1>{TITLE}</h1>
        <span className="badge">{FRAMEWORK}</span>
      </header>
      <section className="shell__content">
        <ItemForm onCreate={create} />
        <ItemList items={list} onUpdate={update} onRemove={remove} />
      </section>
    </main>
  );
}
