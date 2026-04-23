<script setup lang="ts">
import { useItemService } from './item.service';
import ItemForm from './components/ItemForm.vue';
import ItemList from './components/ItemList.vue';

const TITLE = 'MF-C';
const FRAMEWORK = 'Vue 3.5.24';

const { list, create, remove, update } = useItemService();
</script>

<template>
  <main class="shell">
    <header class="shell__header">
      <h1>{{ TITLE }}</h1>
      <span class="badge">{{ FRAMEWORK }}</span>
    </header>
    <section class="shell__content">
      <ItemForm @create="create" />
      <ItemList :items="list" @update="update" @remove="remove" />
    </section>
  </main>
</template>

<style>
.shell {
  max-width: 640px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.shell__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.75rem;
}

.shell__header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1976d2;
}

.badge {
  background: #1976d2;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.shell__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
