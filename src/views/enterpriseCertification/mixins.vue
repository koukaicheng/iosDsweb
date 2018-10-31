<script>
import Picker from '../../components/module/Picker/Picker'
import { GetToken, Step2, HttpImgUrl } from '../../assets/js/api'
import { dataURLtoBlob, get_suffix } from '../../utils/currency'
import verify from '../../utils/verify'
import { Actionsheet } from 'mint-ui'

export default {
  name: 'certificationDetails',
  data () {
    return {
      tabIndex: 0,
      values: [],
      nashui: [{id: 1, name: '小规模纳税人'}, {id: 2, name: '一般纳税人'}],
      chukou: [{id: 0, name: '无'}, {id: 1, name: '钻交所会员'}, {id: 2, name: '其他'}],
      ershou: [{id: 0, name: '无'}, {id: 1, name: '有'}],
      formData: {
        is_person: 0, //0企业 1个人
        contacts_phone: '', //电话
        company_name: '', //公司名称
        contacts_name: '', //公司负责人
        store_class_commis_rates: 1, //纳税资质  1小规模纳税人  2一般纳税人
        paying_money_certificate: 0, //进口资质 0无 1钻交会所 2其他
        paying_money_certif_exp: 0, //二手钻石经验资格  0无 1有
        business_licence_number: '',  //社会统一信用代码
        business_licence_number_elc: '',//营业执照图片
        person_contacts_name: '', // 姓名（个人）
        person_contacts_phone: '', //电话（个人）
        person_business_licence_number: '',//身份证号（个人）
        person_business_licence_number_elc: '',//手持身份证照片（个人)
        person_organization_code_electronic: '',//身份证背面照（个人）
        person_general_taxpayer: '', //身份证正面照（个人）
      },
      localImage: [{url: '',}, {url: '',}, {url: '',}, {url: '',}],
      editStatus: false,
      rightText: '编辑',
      sheetVisible: false,
      actions: [{
        name: '拍照',
        method: this.camera
      }, {
        name: '从相册选择',
        method: this.gallery
      }],
      num: 0,
      key: '',
    }
  },
  created () {},
  mounted () {},
  methods: {
    confirmNashui (val) {
      this.formData.store_class_commis_rates = val
    },
    confirmChukou (val) {
      this.formData.paying_money_certificate = val
    },
    confirmErshou (val) {
      this.formData.paying_money_certif_exp = val
    },
    previewImage (type) {
      if (!$prod) return
      if (type === 'q') {
        let url = `${HttpImgUrl}static/example/business_license.png`
        plus.nativeUI.previewImage([url])
      } else {
        let url = `${HttpImgUrl}static/example/id_card.jpg`
        plus.nativeUI.previewImage([url])
      }
    },
    // 获取oss 信息
    async getGetTokenData (file, filesName, key) {
      let getGetTokenData = await this.$http.get(GetToken, {
        type: 'auth'
      })
      if (getGetTokenData.code === 200) {
        this.plusUpload(getGetTokenData, file, filesName, key)
      }
    },
    //原生图片压缩
    compressImage (src, num, key) {
      let u = navigator.userAgent
      if (u.indexOf('Android') > -1) {
        plus.zip.compressImage({
          src: src,
          dst: '_doc/kkc.jpg',
          overwrite: true,
          quality: 70,
          width: 'auto',
          height: 'auto',
          rotate: 0
        }, (i) => {
          plus.nativeUI.showWaiting()
          let reader = new window.plus.io.FileReader()
          reader.onloadend = (e) => {
            let blob = dataURLtoBlob(e.target.result)
            this.localImage[num].url = ''
            this.getGetTokenData(blob, src, key)
          }
          reader.readAsDataURL(i.target)
        })
      } else {
        let bitmap = new plus.nativeObj.Bitmap('test')
        bitmap.load(src, () => {
          let data = bitmap.toBase64Data()
          let blob = dataURLtoBlob(data)
          this.getGetTokenData(blob, src, key)
        })
      }

    },
    //从相册选取照片
    gallery () {
      plus.gallery.pick((p) => {
        console.log(p)
        this.compressImage(p, this.num, this.key)
      }, (e) => { plus.nativeUI.alert(e)}, {filter: 'image'})
    },
    //调用相机拍照
    camera () {
      console.log(this.key, this.num)
      this.sheetVisible = false
      let cmr = plus.camera.getCamera()
      cmr.captureImage((p) => {
        console.log(p)
        this.compressImage(p, this.num, this.key)
      }, (e) => {})
    },
    async addImg (e, num, key) {
      if (this.prod) {
        this.num = num
        this.key = key
        this.sheetVisible = true
      } else {
        let file = e.target.files[0]
        let filesName = file.name
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        let oFReader = new FileReader()
        oFReader.readAsDataURL(file)
        oFReader.onload = async (oFREvent) => {
          const noCropAvatar = oFREvent.target.result
          let blob = dataURLtoBlob(noCropAvatar)
          this.getGetTokenData(blob, filesName, key)
          this.localImage[num].url = noCropAvatar
        }
      }
    },
    // 上传操作
    async plusUpload (resData, file, filesName, key) {
      let suffix1 = get_suffix(filesName) //文件后缀  例如   .jpg
      await this.$http.post(resData.datas.host, {
        key: resData.datas.dir + suffix1,
        policy: resData.datas.policy,
        success_action_status: '200',
        OSSAccessKeyId: resData.datas.accessid,
        signature: resData.datas.signature,
        callback: resData.datas.callback,
        file,
      }).then((res) => {
        this.formData[key] = res.filename
        this.localImage[this.num].url = HttpImgUrl + res.filename
        if ($prod) {
          plus.nativeUI.closeWaiting()
        }
      })
    },
    delImage (index) {
      this.localImage.splice(index, 1)
    },
    submit () {
      this.getStep2Data()
    },
    pickerFn (type) {
      if (type === 0) {
        this.$refs.nashui.open()
      } else if (type === 1) {
        this.$refs.chukou.open()
      } else if (type === 2) {
        this.$refs.ershou.open()
      }
    },
    ergodicImage () {
      let img = []
      for (let i = 0, len = this.localImage.length; i < len; i++) {
        img.push(this.localImage[i].name)
      }
      return img
    },
    async getStep2Data () {
      if (this.tabIndex === 1) {
        if (!this.formFillter.isValid) {
          this.$toast(this.formFillter.message)
          return
        }
      }
      let getStep2Data = await this.$http.post(Step2, {
        post: this.formData
      })
      if (getStep2Data.code === 200) {
        this.$toast('认证已发送')
        setTimeout(() => {
          this.$router.goBack()
        }, 1000)
      }
    },

  },
  components: {Picker, 'mt-actionsheet': Actionsheet},
  computed: {
    prod () {
      return $prod
    },
    valid () {
      let obj = {}
      let index = this.tabIndex
      if (index === 0) {
        let {contacts_phone, company_name, contacts_name, business_licence_number, business_licence_number_elc} = this.formData
        obj = {contacts_phone, company_name, contacts_name, business_licence_number, business_licence_number_elc}
      } else {
        let {person_contacts_name, person_contacts_phone, person_business_licence_number, person_business_licence_number_elc, person_organization_code_electronic, person_general_taxpayer} = this.formData
        obj = {
          person_contacts_name,
          person_contacts_phone,
          person_business_licence_number,
          person_business_licence_number_elc,
          person_organization_code_electronic,
          person_general_taxpayer
        }
      }
      return verify.requiredObjProp(obj).isValid
    },
    formFillter () {
      if (!verify.idCard(this.formData.person_business_licence_number)) {
        return {
          isValid: false,
          message: '身份证为18位数字或17位数字+字母',
          duration: 3000,
          key: 'person_business_licence_number'
        }
      }
      return {isValid: true}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
