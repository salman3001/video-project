<script lang="ts">
import DefaultLayout from '~/layouts/DefaultLayout.vue'

export default {
  layout: DefaultLayout,
}
</script>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'

const form = useForm({
  name: '',
  file: '',
})

const submit = () => {
  form.post('/upload')
}
</script>

<template>
  <Head title="Upload video" />
  <h1 class="text-2xl font-bold">Upload video</h1>
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
  <form action="" class="flex flex-col gap-4" @submit.prevent="submit">
    <div class="flex flex-col">
      <label for="name">Name</label>
      <input
        type="text"
        placeholder="Video name"
        class="input input-bordered w-full max-w-xs"
        :class="{ 'input-error': form.errors.name }"
        v-model="form.name"
      />
      <span class="text-red-500" v-if="form.errors.name"> {{ form.errors.name }}</span>
    </div>
    <div class="flex flex-col">
      <label for="name">File</label>
      <input
        type="file"
        class="file-input file-input-bordered w-full max-w-xs"
        :class="{ 'input-error': form.errors.file }"
        @change="
          (e) => {
            // @ts-ignore
            form.file = e!.target!.files[0]
          }
        "
      />
      <span class="text-red-500" v-if="form.errors.file">{{ form.errors.file }}</span>
    </div>
    <div>
      <button class="btn btn-primary" :disabled="form.processing">Uplaod</button><br />

      <progress v-if="form.progress" :value="form.progress.percentage" max="100">
        {{ form.progress.percentage }}%
      </progress>
    </div>
  </form>
</template>
