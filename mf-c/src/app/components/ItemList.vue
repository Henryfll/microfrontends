<script setup lang="ts">
import type { Item } from '../item.model';
import ItemRow from './ItemRow.vue';

defineProps<{
  items: Item[];
}>();

const emit = defineEmits<{
  (e: 'update', id: number, name: string): void;
  (e: 'remove', id: number): void;
}>();

const handleUpdate = (id: number, name: string): void => {
  emit('update', id, name);
};

const handleRemove = (id: number): void => {
  emit('remove', id);
};
</script>

<template>
  <p v-if="items.length === 0" class="item-list__empty">
    No items yet. Add your first one above.
  </p>
  <ul v-else class="item-list">
    <ItemRow
      v-for="item in items"
      :key="item.id"
      :item="item"
      @update="handleUpdate"
      @remove="handleRemove"
    />
  </ul>
</template>

<style>
.item-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-list__empty {
  text-align: center;
  color: #757575;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}
</style>
