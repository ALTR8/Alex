var nunjucks    = require('nunjucks')
,   config      = require('config')
,   path        = require('path')
,   url         = require('url')
,   env
;

module.exports = function(app) {

    env = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(app.get('views'))
    ,   config.Nunjucks
    );

    /* ========== ADD FILTERS ========== */

    // asset linker
    env.addFilter('asset', function(asset_str) {
        var asset_link = config.Asset.link || "/"
        ,   asset_ext  = path.extname(asset_str)
        ;

        if(app.get('env') === 'production') {
            switch(asset_ext) {
                case ".js":
                case ".css":
                    asset_str = asset_str.replace(asset_ext, ".min"+asset_ext);
                break;
            }
        }

        return url.resolve(asset_link, asset_str);
    });

    //  Example Filter
    env.addFilter('strlen', function(str) {

        if(typeof str != 'string') {
            return 0;
        }
        
        return str.length;
    });

    return env.express(app);

};