const baseUrl = 'http://192.168.1.2:8000'
// const baseUrl = 'https://all.meedu.tech'

export default function instance(params) {
  return new Promise((resolve, reject) => {
    wx.showLoading()
    wx.request({
      method: params.method || 'GET',
      url: baseUrl + params.url || '',
      data: params.data || {},
      header: {
        Authorization: `Bearer ${wx.getStorageSync('access_token')}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'meedu-platform': 'MINI'
      },
      success(res) {
        if (res.statusCode !== 200) {
          wx.showToast({
            icon: 'none',
            title: '系统错误'
          });
          reject('系统错误');
          return;
        }
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          if (res.data.code === 401) {
            // 需要重新登录
            if (wx.getStorageSync('access_token')) {
              wx.removeStorageSync('access_token');
              wx.navigateTo({
                url: '/pages/auth/login',
              })
              return
            }
          }
          
          reject(res.data.message)
        }
      },
      fail(err) {
        reject(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  })
}