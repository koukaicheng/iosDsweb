import Swipe from './swipe'
import SwipeItem from './swipe-item'

Swipe.install = function (Vue) {
  Vue.component(Swipe.name, Swipe)
  Vue.component(SwipeItem.name, SwipeItem)
}

Swipe.Item = SwipeItem

export default Swipe
