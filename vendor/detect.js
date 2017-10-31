module.exports = function() {
  // detect.js - browser & os detection
// 2011 (c) Ben Brooks Scholz. MIT Licensed.
  var browser,
    version = [],
    mobile = false,
    os,
    osversion,
    bit,
    ua = window.navigator.userAgent || '',
    platform = window.navigator.platform || '',
    updateUrls = {
      chrome: 'https://www.google.com/chrome/browser/desktop/index.html',
      safari: 'http://www.apple.com/safari/',
      edge: 'https://www.microsoft.com/en-us/download/details.aspx?id=48126',
      firefox: 'http://www.getfirefox.com/',
      ie: 'http://www.microsoft.com/ie',
      opera: 'http://www.opera.com/browser/'
    };

  if (/MSIE/.test(ua)) {

    browser = 'ie';

    if (/IEMobile/.test(ua)) {
      mobile = true;
    }

    version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];

  } else if (/Chrome/.test(ua)) {
    // Platform override for Chromebooks
    if (/CrOS/.test(ua)) {
      platform = 'crOs';
    }

    browser = 'chrome';
    version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];

  } else if (/Opera/.test(ua)) {

    browser = 'opera';

    if (/mini/.test(ua) || /Mobile/.test(ua)) {
      mobile = true;
    }

  } else if (/Android/.test(ua)) {

    browser = 'androidWebkitBrowser';
    mobile = true;
    os = /Android\s[\.\d]+/.exec(ua)[0];

  } else if (/Firefox/.test(ua)) {

    browser = 'firefox';

    if (/Fennec/.test(ua)) {
      mobile = true;
    }
    version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];

  } else if (/Safari/.test(ua)) {

    browser = 'safari';

    if ((/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua))) {
      os = 'ios';
      mobile = true;
    }

  }

  if (!version) {

    version = /Version\/[\.\d]+/.exec(ua) || [];

    if (version) {
      version = version[0].split('/')[1];
    } else {
      version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1];
    }

  }

  if (platform === 'macIntel' || platform === 'macPPC') {
    os = 'macOSX';
    osversion = /10[\.\_\d]+/.exec(ua) || [];
    osversion = osversion[0];

    if (/[\_]/.test(osversion)) {
      osversion = osversion.split('_').join('.');
    }
  } else if (platform === 'crOs') {
    os = 'chromeOS';
  } else if (platform === 'win32' || platform == 'win64') {
    os = 'windows';
    bit = platform.replace(/[^0-9]+/, '');
  } else if (!os && /Android/.test(ua)) {
    os = 'android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'linux';
  } else if (!os && /Windows/.test(ua)) {
    os = 'windows';
  }

  function isNotSupportedBrowser() {
    var browserVersion = parseFloat(version);
    var isNotSupported = (browser === 'ie' && browserVersion < 10) ||
      (browser === 'safari' && browserVersion < 8.1);

    return isNotSupported;
  }

  window.juno = window.juno || {};
  window.juno.userInfo = {
    browser: browser,
    version: version,
    mobile: mobile,
    os: os,
    osversion: osversion,
    bit: bit
  };
  if (isNotSupportedBrowser()) {
    const el = document.createElement('div');
    el.className = 'browserBar';
    el.innerHTML = 'Your browser is outdated. ' +
      'Please <a href="' + updateUrls[browser] || updateUrls.chrome + '" target="_blank">update</a> your browser.';

    window.document.body.insertBefore(el, window.document.body.firstElementChild);
  }
};