<template>
  <div class="">
    <ts-header title="帐号" back></ts-header>
    <page>
      <div class="box">
        <Refresh off>
          <ds-cell title="手机号" left-img :tipStatus="member_mobile">
            <img slot="leftImg" src="../../assets/imgs/icon/shouji.png" alt="">
          </ds-cell>
          <!--<ds-cell title="微信" left-img tipStatus="weixin_info">-->
            <!--<img slot="leftImg" src="../../assets/imgs/icon/weixin.png" alt="">-->
          <!--</ds-cell>-->
        </Refresh>

      </div>
    </page>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {}
  },
  methods: {},
  computed: {
    member_mobile () {
      return this.$store.state.userinfo.member_mobile
    },
    weixin_info () {
      return this.$store.state.userinfo.weixin_info
    }
  },
  created () {}
}
</script>

<style lang="scss" scoped>
.box {
  background: #ffffff;
  .kefu {
    float: right;
    font-size: pxTorem(26);
    color: #999999;
  }
}

.logout {
  padding: 1.5rem 0.5rem 0;
}
</style>
