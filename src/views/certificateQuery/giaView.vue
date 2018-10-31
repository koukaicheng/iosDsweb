<template>
  <div class="">
    <ts-header title="GIA查询" back></ts-header>
    <page>
      <div>
        <iframe id="test" :src="nextPath" width="100%" height="100%"></iframe>
      </div>
    </page>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'

export default {
  data () {
    return {
      nextPath: ''
    }
  },
  created () {
    const {reportno} = this.$route.query
    this.nextPath = `https://www.gia.edu/CN/report-check?reportno=${reportno}`
    // Indicator.open({text:'跳转中'})
  },
  mounted () {

    document.addEventListener('DOMContentLoaded', () => {
      // Indicator.close()
      console.log(12331)
    }, false)
  },
  methods: {},
  components: {},
  computed: {
    kkc () {
      return document.getElementById('test').children.length
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
