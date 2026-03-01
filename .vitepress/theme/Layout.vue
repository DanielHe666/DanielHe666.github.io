<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <HomeBackground v-if="isHome" />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeBackground from './components/HomeBackground.vue'

const { frontmatter } = useData()
const isHome = computed(() => (frontmatter.value as any)?.layout === 'home')
</script>
