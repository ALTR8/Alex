var fs          = require('fs')
,   yaml        = require('js-yaml')
,   GULPCONFIG  = 'config/gulpconf.yaml'
;

function buildConfig() {
    var gconf;

    gconf = yaml.safeLoad(fs.readFileSync(GULPCONFIG, 'utf-8'));

    return gconf;

}

module.exports = buildConfig();
