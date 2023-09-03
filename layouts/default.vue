<template>
  <div class="bg-grey-lighten-5 text-black overflow-hidden designed-scrollbar">
    <div
      :style="{ 'max-width': '920px', 'min-height': 'calc(100dvh - 94px)' }"
      class="mx-5 mx-md-auto"
    >
      <module-header />
      <NuxtPage />
    </div>
    <module-footer />
  </div>
</template>
