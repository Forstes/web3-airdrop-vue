<script setup lang="ts">
import router from "@/plugins/router";
import { address } from "@/scripts/wallet";
import { ClipboardIcon } from "@heroicons/vue/24/outline";

function copyAddress() {
  navigator.clipboard.writeText(address.value);
}
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-zinc-700">
    <nav class="sticky z-20 border-stone-200 px-4 py-3 bg-stone-900">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <a class="flex items-center justify-center gap-3 cursor-pointer">
          <img src="/assets/token.png" width="40" height="40" class="inline-block" />
          <span
            class="font-bold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
            @click="router.push('/')"
          >
            Just Token
          </span>
        </a>

        <div class="w-auto flex items-center gap-3 cursor-pointer">
          <ClipboardIcon class="w-7 h-7 p-1 text-white border rounded-md active:border-2 hover:bg-gray-700" @click="copyAddress" />
          <span class="truncate text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">{{ address || "..." }}</span>
        </div>
      </div>
    </nav>

    <main class="grow overflow-auto p-2">
      <router-view />
    </main>
  </div>
</template>

<style>
/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: auto;
  scrollbar-color: #ffffff #000000;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: #000000;
}

*::-webkit-scrollbar-thumb {
  background-color: #ffffff;
  border-radius: 8px;
  border: 2px solid #ffffff;
}
</style>
