<template>
  <div>
    <ts-header title="关于我们" back></ts-header>
    <page>
      <div class="wrap">
        <Refresh off>
          <div class="box">
            <div class="logo">
              <img src="../../../assets/imgs/logo.png" alt="">
            </div>
            <div class="version-info">
              当前版本号:V1.1.1
            </div>
          </div>
        </Refresh>
      </div>
    </page>
  </div>
</template>

<script>
export default {
  name: 'auout',
  data () {
    return {}
  },
  created () {},
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/mixin";

.wrap {
  background: #fff;
  .box {
    padding-top: pxTorem(60);
    @include fja();
    flex-direction: column;
    .logo {
      @include wh(pxTorem(200), pxTorem(200));
      img {
        @include wh(100%, 100%)
      }
    }
    .version-info {
      padding-top: pxTorem(40);
      font-size: pxTorem(30);
    }
  }
}
</style>
