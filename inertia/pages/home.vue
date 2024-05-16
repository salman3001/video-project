<script lang="ts">
import DefaultLayout from '~/layouts/DefaultLayout.vue'
import AlertMessage from '~/components/AlertMessage.vue'

export default {
  layout: DefaultLayout,
}
</script>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import type Video from '#models/video'

defineProps<{ videos: Video[] }>()
</script>

<template>
  <Head title="Homepage" />
  <h1 class="text-2xl font-bold">Video list</h1>
  <br />
  <br />
  <br />
  <div>
    <Link href="/upload">
      <button class="btn btn-primary">Upload new video</button>
    </Link>
  </div>
  <br />
  <br />

  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>Video name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr v-for="video in videos" :key="video.id">
          <th>{{ video.id }}</th>
          <td>{{ video.name }}</td>
          <td>
            <div class="flex gap-2">
              <Link :href="'http://localhost:3333/view-video/' + video?.id" target="_blank">
                <button class="btn btn-sm">view</button>
              </Link>
              <button class="btn btn-sm">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
