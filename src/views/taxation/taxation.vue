<template>
  <div class="">
    <ts-header title="税费标准" back></ts-header>
    <page>
      <div class="wrap" ref="wrap"></div>
    </page>
  </div>
</template>

<script>
  import {Agreement} from '../../assets/js/api'
  export default {
    name:'taxation',
    data () {
      return {}
    },
    created () {
      this.getAgreementData()
    },
    methods: {
      async getAgreementData(){
        let json = await this.$http.get(Agreement,{doc_code:'taxation'},{show:true,type:'mini'})
        this.$refs.wrap.innerHTML = json.datas.doc_content
      },
    },
    components: {},
    computed: {}
  }
</script>

<style lang="scss" scoped>
  .wrap{
    background: #fff;
    padding: 0.5rem 0.8rem;
    font-size: 20px;
  }
</style>
