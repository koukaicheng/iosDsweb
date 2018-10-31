<template>
  <div class="">
    <ts-header back title="身份认证" :rightText="rightText" rightColor="#bd081c" @headerEvent="edit"
               v-if="formData.allow_edit"></ts-header>
    <ts-header back title="身份认证" v-else></ts-header>

    <page>
      <div class="wrapper">

        <Refresh off>
          <div class="wrap-top">
            <div>认证状态: {{formData.joinin_state_str}}</div>
          </div>
          <div v-if="tabIndex === 0" class="content-box">
            <div class="content-item border-1px">
              <span class="name">企业名称</span>
              <input class="input" type="text" :disabled="!editStatus" v-model="formData.company_name"
                     placeholder="请输入企业名称"/>
            </div>
            <div class="content-item border-1px">
              <span class="name">社会统一信用代码</span>
              <input class="input" type="text" :disabled="!editStatus" v-model="formData.business_licence_number"
                     placeholder="请输入社会统一信用代码"/>
            </div>
            <div class="content-item border-1px">
              <span class="name">负责人</span>
              <input class="input" type="text" :disabled="!editStatus" v-model="formData.contacts_name"
                     placeholder="请输入负责人"/>
            </div>
            <div class="content-item border-1px">
              <span class="name">电话</span>
              <input class="input" type="number" :disabled="!editStatus" v-model="formData.contacts_phone"
                     placeholder="请输入电话"/>
            </div>
            <div class="content-item border-1px" @click="pickerFn(0)">
              <span class="name">纳税资质</span>
              <p class="right">
              <span>
                <template v-if="formData.store_class_commis_rates == 1">小规模纳税人</template>
                <template v-if="formData.store_class_commis_rates == 2">一般纳税人</template>
              </span>
                <icon class="moreicon" font-name="icon-fanhui" size="30"></icon>
              </p>

            </div>
            <div class="content-item border-1px" @click="pickerFn(1)">
              <span class="name">进口资质</span>
              <p class="right">
              <span>
                <template v-if="formData.paying_money_certificate == 0">无</template>
                <template v-if="formData.paying_money_certificate == 1">钻交会所</template>
                <template v-if="formData.paying_money_certificate == 2">其他</template>
              </span>
                <icon class="moreicon" font-name="icon-fanhui" size="30"></icon>
              </p>
            </div>
            <div class="content-item border-1px" @click="pickerFn(2)">
              <span class="name">二手钻石经营资质</span>
              <p class="right">
              <span>
                <template v-if="formData.paying_money_certif_exp == 0">无</template>
                <template v-if="formData.paying_money_certif_exp == 1">有</template>
              </span>
                <icon class="moreicon" font-name="icon-fanhui" size="30"></icon>
              </p>
            </div>
            <div class="autoHeight border-1px">
              <div class="content-item">
                <span class="name">营业执照</span>
                <p class="look" @click="previewImage('q')">
                  查看范例
                </p>
              </div>
              <ul class="content">
                <li class="img">
                  <div class="img-box">
                    <div class="img-item add" @click="prod===true?addImg('',0,'business_licence_number_elc'):''">
                      <input v-if="!prod&&formData.allow_edit" ref="uload" type="file" id="upload"
                             style="position:absolute;width: 100%;height: 100%;opacity: 0"
                             accept="image/png, image/jpeg, image/gif, image/jpg"
                             @change="addImg($event,0,'business_licence_number_elc')">
                      <img :src="localImage[0].url" alt="" v-show="formData.business_licence_number_elc!==''">
                      <icon font-name="icon-jiahao" size="70" color="#c3c3c3"
                            v-show="formData.business_licence_number_elc===''"></icon>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div v-else="tabIndex===1" class="content-box">
            <div class="content-item border-1px">
              <span class="name">真实姓名</span>
              <input class="input" type="text" :disabled="!editStatus" v-model="formData.person_contacts_name"
                     placeholder="请输入真实姓名"/>
            </div>
            <div class="content-item border-1px">
              <span class="name">联系电话</span>
              <input class="input" type="number" :disabled="!editStatus" v-model="formData.person_contacts_phone"
                     placeholder="请输入联系电话"/>
            </div>
            <div class="content-item border-1px">
              <span class="name">身份证号码</span>
              <input class="input" type="text" min="18" :disabled="!editStatus"
                     v-model="formData.person_business_licence_number"
                     placeholder="请输入身份证号码"/>
            </div>
            <div class="autoHeight border-1px">
              <div class="content-item">
                <span class="name">身份证照片</span>
                <p class="look" @click="previewImage('g')">
                  查看范例
                </p>
              </div>
              <ul class="content">
                <li class="shenfenzheng">
                  <label class="img-box" @click="prod===true?addImg({},1,'person_general_taxpayer'):''">
                    <input v-if="!prod&&formData.allow_edit" ref="uload" type="file"
                           style="position:absolute;width: 100%;height: 100%;opacity: 0"
                           accept="image/png, image/jpeg, image/gif, image/jpg"
                           @change="addImg($event,1,'person_general_taxpayer')">
                    <div v-show="formData.person_general_taxpayer===''" class="img-item add ">
                      <icon font-name="icon-jiahao" size="70" color="#c3c3c3"></icon>
                      <p>身份证人像面</p>
                    </div>
                    <div v-show="formData.person_general_taxpayer!==''" class="add-img-box">
                      <img :src="localImage[1].url" alt="">
                    </div>

                  </label>
                </li>
                <li class="shenfenzheng">
                  <label class="img-box" @click="prod===true?addImg($event,2,'person_organization_code_electronic'):''">
                    <input v-if="!prod&&formData.allow_edit" ref="uload" type="file"
                           style="position:absolute;width: 100%;height: 100%;opacity: 0"
                           accept="image/png, image/jpeg, image/gif, image/jpg"
                           @change="addImg($event,2,'person_organization_code_electronic')">
                    <div v-show="formData.person_organization_code_electronic===''" class="img-item add ">
                      <icon font-name="icon-jiahao" size="70" color="#c3c3c3"></icon>
                      <p>身份证国徽面</p>
                    </div>
                    <div class="add-img-box" v-show="formData.person_organization_code_electronic!==''">
                      <img :src="localImage[2].url" alt="">
                    </div>

                  </label>
                </li>
                <li class="shenfenzheng">
                  <label class="img-box" @click="prod===true?addImg($event,3,'person_business_licence_number_elc'):''">
                    <input v-if="!prod&&formData.allow_edit" ref="uload" type="file"
                           style="position:absolute;width: 100%;height: 100%;opacity: 0"
                           accept="image/png, image/jpeg, image/gif, image/jpg"
                           @change="addImg($event,3,'person_business_licence_number_elc')">
                    <div v-show="formData.person_business_licence_number_elc===''" class="img-item add ">
                      <icon font-name="icon-jiahao" size="70" color="#c3c3c3"></icon>
                      <p>手持身份证人像照片</p>
                    </div>
                    <div class="add-img-box" v-show="formData.person_business_licence_number_elc!==''">
                      <img :src="localImage[3].url" alt="">
                    </div>

                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div class="submit" @click="submit" v-show="editStatus">
            <ds-button type="primary" size="large" :disabled="!valid">保存</ds-button>
          </div>


        </Refresh>

      </div>
      <picker ref="nashui" :values="nashui" @confirm="confirmNashui"></picker>
      <picker ref="chukou" :values="chukou" @confirm="confirmChukou"></picker>
      <picker ref="ershou" :values="ershou" @confirm="confirmErshou"></picker>
    </page>
  </div>
</template>
<script>
import { Step2, StoreInfo } from '../../assets/js/api'
import mixins from './mixins'

export default {
  mixins: [mixins],
  data () {
    return {}
  },
  created () {
    this.storeInfo()
  },
  mounted () {},
  methods: {
    edit () {
      this.editStatus = !this.editStatus
      this.rightText = this.editStatus ? '取消' : '编辑'
    },
    async storeInfo () {
      let json = await this.$http.post(StoreInfo, {}, {}, {})
      if (json.code === 200) {
        this.formData = json.datas
        this.formData.is_person = parseInt(this.formData.is_person)
        this.tabIndex = this.formData.is_person
        // this.rightText = !this.formData.allow_edit ? '编辑' : '取消'
        if (this.tabIndex === 0) {
          [this.formData.store_class_commis_rates, this.formData.paying_money_certificate, this.formData.paying_money_certif_exp, this.localImage[0].url] = [1, 0, 0, this.formData.business_licence_number_elc]
        } else {
          [this.localImage[3].url, this.localImage[2].url, this.localImage[1].url] = [this.formData.person_business_licence_number_elc, this.formData.person_organization_code_electronic, this.formData.person_general_taxpayer]
        }
      }
    },
  },
  beforeRouteLeave (to, from, next) {
    if (this.editStatus) {
      this.$modal({message: '是否保存', lock: true, cancel: true}).then(async action => {
        let getStep2Data = await this.$http.post(Step2, {
          post: this.formData
        })
        if (getStep2Data.code === 200) {
          this.editStatus = false
          this.$toast('认证已发送')
          next()
        }
      }, () => {
        next(false)
      })
    } else {
      next()
    }
  },
  watch: {
    editStatus (val) {
      if (!val) {
        this.storeInfo()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "entercation";

input {
  background: none;
}

</style>
