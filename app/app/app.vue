<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">{{ todo.name }}</li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseKey,
);

const todos = ref([
  { id: 1, name: "Todo 1" },
  { id: 2, name: "Todo 2" },
  { id: 3, name: "Todo 3" },
]);

async function getTodos() {
  const { data } = await supabase.from("todos").select();
  todos.value = data;
}

onMounted(() => {
  getTodos();
});
</script>
