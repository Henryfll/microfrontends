<script setup lang="ts">
import { computed, ref } from 'vue';

const emit = defineEmits<{
  (e: 'create', name: string): void;
}>();

const name = ref<string>('');

const trimmed = computed<string>(() => name.value.trim());
const invalid = computed<boolean>(
  () => !trimmed.value || trimmed.value.length > 50,
);

const handleSubmit = (): void => {
  if (invalid.value) {
    return;
  }
  emit('create', trimmed.value);
  name.value = '';
};
</script>

<template>
  <form class="item-form" @submit.prevent="handleSubmit">
    <input
      v-model="name"
      class="item-form__input"
      type="text"
      placeholder="Item name"
      :maxlength="50"
    />
    <button class="item-form__submit" type="submit" :disabled="invalid">
      Add
    </button>
  </form>
</template>

<style>
.item-form {
  display: flex;
  gap: 0.5rem;
}

.item-form__input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  font-size: 0.95rem;
}

.item-form__submit {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.item-form__submit:disabled {
  background: #90caf9;
  cursor: not-allowed;
}
</style>
