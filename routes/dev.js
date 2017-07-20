//  Simple Development Routes
var express     = require('express')
,   debug       = require('debug')('vm:devroutes')
,   router      = express.Router()
,   fs          = require('fs')
,   _           = require('lodash')
;

router.route('/dev')
    .get(function(req, res) {
        res.send("OK");
    })
;

router.route('/dev/todo')
    .get(function(req, res) {
        fs.readdir('libs/dev/todos', function(err, files) {
            var all_todo_data = [];

            if(err) {
                return res.status(500).send(err);
            }

            _.each(files, function(file) {
                var todo_json = JSON.parse(fs.readFileSync("./libs/dev/todos/"+file, 'utf-8'));
                all_todo_data = _.union(all_todo_data, todo_json);
            });

            return res.render("dev/todos", {
                title: "All TODOs",
                todos: all_todo_data
            });
        });
    })
;

router.route('/dev/todo/:type')
    .get(function(req, res) {
        var todo_json_file = './libs/dev/todos/todo-'+req.params.type+".json"
        ,   todo_json
        ;

        if(!fs.existsSync(todo_json_file)) {
            return res.send("TODOS DNE")
        }

        todo_json = JSON.parse(fs.readFileSync(todo_json_file, 'utf-8'));
        
        return res.render("dev/todos", {
            todos: todo_json
        ,   title: (req.params.type.toUpperCase())+" TODOs"
        });
    })
;

module.exports = router;