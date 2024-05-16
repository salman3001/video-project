<script lang="ts">
import DefaultLayout from '~/layouts/DefaultLayout.vue'
import DashPlayer from '~/components/DashPlayer.vue'
import { ref } from 'vue'

export default {
  layout: DefaultLayout,
}
</script>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import type Video from '#models/video'

const props = defineProps<{ video: Video }>()
</script>

<template>
  <Head title="Homepage" />
  <h1 class="text-2xl font-bold">View video</h1>
  <br />
  <br />
  <br />
  <div>
    <Link href="/">
      <button class="btn btn-primary">Go Back</button>
    </Link>
  </div>
  <br />
  <br />

  <div class="overflow-x-auto">
    <h2 class="text-2xl font-bold">{{ video.name }}</h2>
    <br />
    <br />
    <DashPlayer :url="'/uploads/' + props.video.data.url" />
    <br />
  </div>
</template>
