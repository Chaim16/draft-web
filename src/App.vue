<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user/login')">
      <LoginLayout />
    </template>
    <template v-else-if="route.path.startsWith('/user/register')">
      <LoginLayout />
    </template>
    <template v-else-if="route.path.startsWith('/static/')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

import BasicLayout from "@/layouts/BasicLayout.vue";
import LoginLayout from "@/layouts/LoginLayout.vue";
</script>

<style>
#app {
}
</style>
