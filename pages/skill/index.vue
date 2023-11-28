<script setup lang="ts">
import type { ListSkillsQuery, Skill } from '~/assets/API'
import { listSkills } from '~/assets/graphql/queries'
const skills = ref<Skill[]>([])
useHead({ title: 'スキル一覧' })
const getSkills = async () => {
  const { data } = await listQuery<ListSkillsQuery, Skill>({
    query: listSkills,
    queryName: 'listSkills'
  })
  if (data.value) skills.value = data.value
}
await getSkills()
</script>
<template>
  <atom-text font-size="text-h4" text="Skills" class="py-10" />
  <v-chip-group column class="ml-n3">
    <v-hover v-for="item in skills" :key="item.id" v-slot="{ isHovering, props }">
      <v-chip
        :ripple="false"
        class="ma-2 transition-short-ease-out"
        :class="[isHovering ? 'text-white bg-main-color' : 'bg-white text-grey-darken-4']"
        variant="outlined"
        prepend-icon="mdi-music-accidental-sharp"
        v-bind="props"
        link
        :to="'/skill/' + item.id"
      >
        {{ item.title }}
      </v-chip>
    </v-hover>
  </v-chip-group>
</template>
