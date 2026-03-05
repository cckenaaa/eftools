// 咪咕视频去广告 - 导航栏 & 个人中心

let body = $response.body;
if (!body) { $done({}); return; }

const url = $request.url;

if (/staticcache\/navigation-list\/miguvideo/.test(url)) {
  try {
    let obj = JSON.parse(body);
    const allowTabs = ['首页', '体育', 'VI1P', '我的'];
    if (Array.isArray(obj?.body?.list)) {
      obj.body.list.forEach(item => {
        item.byVersion = 0;
        if (Array.isArray(item?.bottomBar?.buttonConfigs)) {
          item.bottomBar.buttonConfigs = item.bottomBar.buttonConfigs
            .filter(btn => allowTabs.includes(btn?.defaultbar?.displayText));
        }
      });
    }
    body = JSON.stringify(obj);
  } catch (e) {
    console.log("navigation-list: " + e);
  }
  $done({ body });

} else if (/PERSONAL_CENTER/.test(url)) {
  try {
    let obj = JSON.parse(body);
    const keywords = ['我的设置', '缓存'];
    if (obj?.body?.data && typeof obj.body.data === 'object') {
      const dataStr = JSON.stringify(obj.body.data);
      const hasKeyword = keywords.some(k => dataStr.includes(k));
      if (!hasKeyword) {
        obj.body.data = {};
      }
    }
    body = JSON.stringify(obj);
  } catch (e) {
    console.log("personal-center: " + e);
  }
  $done({ body });

} else {
  $done({});
}
