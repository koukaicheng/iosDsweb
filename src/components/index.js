import tsHeader from './module/Header/Header.vue'
import Page from './module/Page/Page.vue'
import dsFooter from './module/Footer/Footer.vue'
import dsCell from './module/Cell/Cell.vue'
import dsInput from './module/Input/Input'
import dsButton from './module/Button/Button'
import dsModal from './module/Modal/Modal'
import dsCheckbox from './module/Checkbox/Checkbox'
import dsHead from './uiModule/ListTitle/ListTItle'
import dsOrderList from './uiModule/OrderList/OrderList'
import Scroll from './module/Scroll/Scroll'
import Refresh from './module/Refresh/Refresh.vue'

import icon from './uiModule/Icon/Icon'
import slide from './uiModule/SlideDel/SlideDel'
import kcCheckbox from './module/Checkbox/dsCheckbox'
import dsGrade from './uiModule/Grade/Grade'
import Toast from './module/toast/toast.js'
import Modal from './module/Modal'

import { Popup, Picker, Spinner } from 'mint-ui'
import dsSwiper from './module/Swiper/Swiper';
import dsSwiperItem from './module/Swiper/SwiperItem';

const install = function (Vue, config = {}) {
  if (install.installed) return
  Vue.component(dsSwiper.name, dsSwiper)
  Vue.component(dsSwiperItem.name, dsSwiperItem)
  Vue.component(tsHeader.name, tsHeader)
  Vue.component(Page.name, Page)
  Vue.component(dsFooter.name, dsFooter)
  Vue.component(dsGrade.name, dsGrade)
  Vue.component(dsCell.name, dsCell)
  Vue.component(dsInput.name, dsInput)
  Vue.component(dsButton.name, dsButton)
  Vue.component(dsModal.name, dsModal)
  Vue.component(dsHead.name, dsHead)
  Vue.component(icon.name, icon)
  Vue.component(slide.name, slide)
  Vue.component(dsOrderList.name, dsOrderList)
  Vue.component(Refresh.name, Refresh)
  // cube-ui抽离出来
  Vue.component(Scroll.name, Scroll)
  Vue.component(dsCheckbox.name, dsCheckbox)
  Vue.component(kcCheckbox.name, kcCheckbox)
  //mint-ui
  Vue.component(Popup.name, Popup)
  Vue.component(Picker.name, Picker)
  Vue.component(Spinner.name, Spinner)

  Vue.$modal = Vue.prototype.$modal = Modal
  Vue.$toast = Vue.prototype.$toast = Toast
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export default install

