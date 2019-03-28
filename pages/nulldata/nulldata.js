Page({
  config: {
    usingComponents: {
      'wxc-panel': '@minui/wxc-panel'
    }
  },
  data: {
    types: [
      'beauty', 'selection', 'disabled',
      'danger', 'success', 'secondary',
      'primary', 'info', 'dark', 'warning'
    ],
    style: 'width: 222rpx;background: #ff9300;border-radius: 66rpx;color: #fff;',
    icons: [
      'yes', 'check', 'help', 'no', 'warning',
      'add', 'close', 'star', 'star-active', 'more',
      'right', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
      'minus', 'cart', 'home', 'search', 'search-square',
      'camera', 'scan', 'corcer-l', 'corcer-r', 'alipay',
      'yen', 'mogujie', 'group', 'pintuan', 'share',
      'notice', 'shop', 'delete', 'comment', 'edit',
      'feedback', 'location', 'address', 'after-sales', 'footprint',
      'weixin', 'top', 'purse', 'unreceived', 'truck',
      'rate', 'coupon', 'message', 'clear'
    ]
  },
  /** note: 在 wxp 文件或者页面文件中请去掉 methods 包装 */
  methods: {
    onClick(event) {
      console.log(event)
    },
    onSubmit(e) {
      console.log(e.detail.formId)
    }
  }
})
