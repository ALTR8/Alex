// custom task plugin to concat files through an entry point

var through = require('through2')
,   fs      = require('fs')
,   path    = require('path')
;

module.exports = function(options) {

    if(!options) {
        options = {
            ext: '.js'
        };
    }

    var stream = through.obj(function (file, enc, callback) {
        // takes a json array w/ files and then concats them.
        // assumes files are properly organized

         if(file.isNull()) {
            //  Do nothing if no contents
            return callback(null);
        }

        if(file.isStream()) {
            return callback(new gutil.PluginError(PLUGIN_NAME, 'No stream support.'));
        }

        var filearr     = JSON.parse(file.contents.toString())
        ,   concat_file = ""
        ,   filename    = file.relative
        ;

        for(var i = 0; i < filearr.length; i++) {
            var buff = fs.readFileSync(path.join(file.base, filearr[i]));

            concat_file += buff.toString() + "\n";
        }

        file.contents = new Buffer(concat_file);

        concat_file = "";

        this.push(file);

        callback();

    });

    return stream;
};