<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

/*
 * Generic notification bell — dropdown with an unread badge, a recent
 * list, mark-as-read/mark-all-read, and a "view all" footer link. Data
 * fetching, icon/color/message resolution, and navigation are all
 * injected via props/emits, so this has no dependency on a specific API
 * shape, i18n event catalog, or router.
 *
 * Expected notification shape: { id, read_at, created_at, ...whatever
 * `icon`/`color`/`message` need }.
 */
const props = defineProps({
  // async ({ perPage }) => { items: Array, unreadCount: Number }
  fetchRecent: { type: Function, required: true },
  // async () => Number
  fetchUnreadCount: { type: Function, required: true },
  // async (id) => void
  markRead: { type: Function, required: true },
  // async () => void
  markAllRead: { type: Function, required: true },
  icon: { type: Function, default: (n) => (n.read_at ? 'mdi-bell-outline' : 'mdi-bell-ring-outline') },
  color: { type: Function, default: () => 'primary' },
  // (notification) => string — always app-specific text, no sensible default.
  message: { type: Function, required: true },
  formatDate: { type: Function, default: (d) => new Date(d).toLocaleString() },
  perPage: { type: Number, default: 10 },
  pollIntervalMs: { type: Number, default: 60000 },
  title: { type: String, default: 'Notifications' },
  emptyText: { type: String, default: 'No notifications' },
  markAllReadText: { type: String, default: 'Mark all read' },
  viewAllText: { type: String, default: 'View all' },
})

const emit = defineEmits(['item-click', 'view-all'])

const menuOpen = ref(false)
const loading = ref(false)
const notifications = ref([])
const unreadCount = ref(0)

async function refreshUnreadCount() {
  unreadCount.value = await props.fetchUnreadCount()
}

async function loadRecent() {
  loading.value = true
  try {
    const { items, unreadCount: count } = await props.fetchRecent({ perPage: props.perPage })
    notifications.value = items
    unreadCount.value = count
  } finally {
    loading.value = false
  }
}

async function handleItemClick(n) {
  menuOpen.value = false

  if (!n.read_at) {
    props.markRead(n.id).catch(() => {})
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  emit('item-click', n)
}

async function handleMarkAllRead() {
  await props.markAllRead()
  notifications.value = notifications.value.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
  unreadCount.value = 0
}

function handleViewAll() {
  menuOpen.value = false
  emit('view-all')
}

let pollHandle = null

onMounted(() => {
  refreshUnreadCount()
  pollHandle = window.setInterval(refreshUnreadCount, props.pollIntervalMs)
})

onUnmounted(() => {
  window.clearInterval(pollHandle)
})

defineExpose({ refresh: loadRecent })
</script>

<template>
  <v-menu
    v-model="menuOpen"
    location="bottom end"
    transition="scale-transition"
    :close-on-content-click="false"
    min-width="340"
    max-width="380"
    @update:model-value="(val) => val && loadRecent()"
  >
    <template #activator="{ props: menuProps }">
      <v-btn v-bind="menuProps" icon variant="text">
        <v-badge :content="unreadCount" :model-value="unreadCount > 0" color="error" floating>
          <v-icon icon="mdi-bell-outline" size="22" />
        </v-badge>
      </v-btn>
    </template>

    <v-card elevation="0" rounded="lg" class="overflow-hidden border">
      <div class="d-flex align-center justify-space-between pa-3 border-b">
        <span class="text-subtitle-2 font-weight-bold">{{ title }}</span>
        <v-btn
          v-if="unreadCount > 0"
          variant="text"
          size="small"
          density="compact"
          class="text-none"
          @click="handleMarkAllRead"
        >
          {{ markAllReadText }}
        </v-btn>
      </div>

      <v-progress-linear v-if="loading" indeterminate color="primary" height="2" />

      <v-list density="comfortable" class="py-0" style="max-height: 360px; overflow-y: auto">
        <v-list-item
          v-for="n in notifications"
          :key="n.id"
          rounded="md"
          class="mx-1 my-1"
          :class="{ 'bg-primary-lighten-5': !n.read_at }"
          @click="handleItemClick(n)"
        >
          <template #prepend>
            <v-icon :icon="icon(n)" :color="color(n)" size="20" class="mr-2" />
          </template>
          <v-list-item-title class="text-body-2 text-wrap" :class="{ 'font-weight-bold': !n.read_at }">
            {{ message(n) }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ formatDate(n.created_at) }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-list-item v-if="!loading && notifications.length === 0">
          <v-list-item-title class="text-body-2 text-medium-emphasis text-center py-2">
            {{ emptyText }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider />
      <v-list-item rounded="md" class="ma-1 text-center" density="compact" @click="handleViewAll">
        <v-list-item-title class="text-body-2 text-primary font-weight-medium">
          {{ viewAllText }}
        </v-list-item-title>
      </v-list-item>
    </v-card>
  </v-menu>
</template>
