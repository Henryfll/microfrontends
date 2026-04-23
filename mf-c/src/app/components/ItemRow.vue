<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Item } from '../item.model';

const props = defineProps<{
  item: Item;
}>();

const emit = defineEmits<{
  (e: 'update', id: number, name: string): void;
  (e: 'remove', id: number): void;
}>();

const editing = ref<boolean>(false);
const draft = ref<string>(props.item.name);

const trimmed = computed<string>(() => draft.value.trim());
const invalid = computed<boolean>(
  () => !trimmed.value || trimmed.value.length > 50,
);

const startEdit = (): void => {
  draft.value = props.item.name;
  editing.value = true;
};

const cancelEdit = (): void => {
  editing.value = false;
  draft.value = props.item.name;
};

const saveEdit = (): void => {
  if (invalid.value) {
    return;
  }
  emit('update', props.item.id, trimmed.value);
  editing.value = false;
};

const handleRemove = (): void => {
  emit('remove', props.item.id);
};
</script>

<template>
  <li class="item-row">
    <span class="item-row__id">#{{ item.id }}</span>
    <input
      v-if="editing"
      v-model="draft"
      class="item-row__input"
      type="text"
      :maxlength="50"
    />
    <span v-else class="item-row__name">{{ item.name }}</span>
    <div class="item-row__actions">
      <template v-if="editing">
        <button
          class="item-row__btn item-row__btn--save"
          type="button"
          :disabled="invalid"
          @click="saveEdit"
        >
          Save
        </button>
        <button
          class="item-row__btn item-row__btn--cancel"
          type="button"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </template>
      <template v-else>
        <button
          class="item-row__btn item-row__btn--edit"
          type="button"
          @click="startEdit"
        >
          Edit
        </button>
        <button
          class="item-row__btn item-row__btn--remove"
          type="button"
          @click="handleRemove"
        >
          Delete
        </button>
      </template>
    </div>
  </li>
</template>

<style>
.item-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.item-row__id {
  color: #616161;
  font-size: 0.85rem;
  min-width: 2.5rem;
}

.item-row__name {
  flex: 1;
  font-size: 0.95rem;
}

.item-row__input {
  flex: 1;
  padding: 0.35rem 0.5rem;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  font-size: 0.95rem;
}

.item-row__actions {
  display: flex;
  gap: 0.35rem;
}

.item-row__btn {
  border: none;
  border-radius: 4px;
  padding: 0.35rem 0.65rem;
  cursor: pointer;
  font-size: 0.8rem;
  color: #fff;
}

.item-row__btn--edit {
  background: #607d8b;
}

.item-row__btn--save {
  background: #2e7d32;
}

.item-row__btn--save:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

.item-row__btn--cancel {
  background: #9e9e9e;
}

.item-row__btn--remove {
  background: #c62828;
}
</style>
