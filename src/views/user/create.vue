<template>
  <user-detail :is-edit='false'></user-detail>
</template>

<script>
import userDetail from './components/userDetail'

export default {
  name: 'createArticle',
  components: { userDetail }
}
</script>
