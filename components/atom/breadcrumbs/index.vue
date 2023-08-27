<script setup lang="ts">
type Breadcrumbs = {
  title: string
  to: string
  disabled: boolean
}
const props = withDefaults(
  defineProps<{
    items: Breadcrumbs[]
  }>(),
  {
    items: () => []
  }
)
const route = useRoute()
const breadcrumbs = computed(() => {
  return props.items.length
    ? [{ title: 'top', to: '/', disabled: route.path === '/' }, ...props.items]
    : [
        { title: 'top', to: '/', disabled: route.path === '/' },
        ...route.path
          .slice(1)
          .split('/')
          .map((v, i, a) => {
            return {
              title: v,
              to: '/' + a.slice(0, i + 1).join('/'),
              disabled: route.path.endsWith(v)
            }
          })
      ]
})
</script>
<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    class="pa-0 ml-0 text-caption line-height-lg"
    style="--v-disabled-opacity: 0.5"
  ></v-breadcrumbs>
</template>
