const path = require('path');
let host = '127.0.0.1';
let port = '1337';
let protocol = 'http';
let baseUrl = protocol + '://' + host + ':' + port + '/';
let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
let protractorDefaultSettings = {
  waitForPathPattern: /home/,
  screenshotPath: './__screenshots__',
  pathToOpen: '/'
};
const ScreenShotReporter = require('protractor-screenshot-reporter');

module.exports = function(protractorConfig, protractorSettings) {
  const settings = Object.assign(protractorDefaultSettings, protractorSettings);

  if (typeof settings.projectSrcDir === 'undefined') {

    console.error(`\n\n!!!!! settings.projectSrcDir is required for protractor.conf.js !!!!!\n\n`);
    return {};
  }

  return {
    config: Object.assign({
      allScriptsTimeout: 11000,

      specs: [
        path.resolve(settings.projectSrcDir + '/./**/*.e2e.js')
      ],

      directConnect: true,
      chromeDriver: './node_modules/chromedriver/bin/chromedriver',

      multiCapabilities: [
        {
          browserName: 'chrome',
          directConnect: true,
          chromeOptions: settings.chromeOptions || {}
        }
      ],

      baseUrl: baseUrl,

      framework: 'jasmine2',

      jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        print: function() {
        }
      },

      plugins: [
        {
          package: 'protractor-screenshoter-plugin',
          screenshotPath: settings.screenshotPath,
          screenshotOnExpect: 'failure+success',
          screenshotOnSpec: 'none',
          withLogs: 'true',
          htmlReport: false,
          imageToAscii: 'none',
          clearFoldersBeforeTest: true
        }
      ],

      onPrepare: function() {
        // credits to 'Dan Haller' https://coderwall.com/p/tjx5zg/selecting-a-dropdown-option-with-webdriverjs
        browser.selectOption = selectOption.bind(browser);
        browser.waitForLogin = waitForLogin.bind(browser);

        browser.get(settings.pathToOpen);

        browser.getCapabilities().then(function(cap) {
          browser.capabilities = cap.caps_;
        });

        jasmine.getEnv().addReporter(new ScreenShotReporter({
          baseDirectory: settings.screenshotPath
        }));

        jasmine.getEnv().addReporter(new SpecReporter({
          spec: {
            displayStacktrace: false,
            displayDuration: true
          }
        }));

        return waitForLogin.bind(browser)(settings.waitForPathPattern);
      }
    }, protractorConfig)
  };
};

function waitForLogin(waitForPattern, waitForDelay = 10000) {
  var browser = this;

  // Login takes some time, so wait until it's done.
  // For the test app's login, we know it's done when the url matches
  // the specificied default route regex.
  return browser.driver.wait(function() {
    return browser.driver.getCurrentUrl().then(function(url) {
      return waitForPattern.test(url);
    });
  }, waitForDelay);
}

function selectOption(selector, item) {
  var selectList, desiredOption;

  selectList = this.findElement(selector);
  selectList.click();

  selectList.findElements(protractor.By.tagName('option'))
    .then(function findMatchingOption(options) {
      options.some(function(option) {
        option.getText().then(function doesOptionMatch(text) {
          if (item === text) {
            desiredOption = option;
            return true;
          }
        });
      });
    })
    .then(function clickOption() {
      if (desiredOption) {
        desiredOption.click();
      }
    });
}