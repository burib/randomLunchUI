// This is a sample example for a project

let protractorConfigOverrides = {};
let protractorSettings = {
  waitForPathPattern: /\//,
  chromeOptions: {
    args: []
  },
  projectSrcDir: __dirname + '/src'
};
let ProtractorConf = require('./protractor.base.conf.js');

module.exports = ProtractorConf(protractorConfigOverrides, protractorSettings);