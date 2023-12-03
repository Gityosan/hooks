<script setup lang="ts">
import type { Event, ListEventsQuery } from '~/assets/API'
import { listEvents } from '~/assets/graphql/queries'
const { isSignedIn } = useLoginState()
const events = ref<Event[]>([])
useHead({ title: 'イベント一覧' })
const getEvents = async () => {
  const { data } = await listQuery<ListEventsQuery, Event>({
    query: listEvents,
    queryName: 'listEvents',
    filter: { published: { eq: true } }
  })
  if (data.value) events.value = data.value
}
await getEvents()
</script>
<template>
  <div class="d-flex py-10">
    <atom-text font-size="text-h4" text="Event" />
    <v-spacer />
    <nuxt-link v-if="isSignedIn" to="/admin/event">
      <atom-button text="編集する" />
    </nuxt-link>
  </div>
  <div class="d-flex flex-wrap">
    <nuxt-link
      v-for="item in events"
      :key="item.id"
      :to="`/event/${item.id}`"
      class="text-decoration-none v-col-12 v-col-sm-6 v-col-md-4 pa-4"
    >
      <module-content-medium
        :created-at="item.createdAt"
        :title="item.title"
        :img-key="item.file?.key"
        :identity-id="item.file?.identityId"
      >
        <template #meta>
          <v-chip
            :text="item.wanted ? '募集中' : '募集停止'"
            :color="item.wanted ? 'success' : 'grey'"
            density="compact"
            class="font-weight-bold line-height-20"
          >
            <template #prepend>
              <v-icon
                :icon="item.wanted ? 'mdi-check' : 'mdi-pause-octagon-outline'"
                size="20"
                class="mr-1"
              />
            </template>
          </v-chip>
        </template>
      </module-content-medium>
    </nuxt-link>
  </div>
</template>
