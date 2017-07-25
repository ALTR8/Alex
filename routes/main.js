var express     = require('express')
,   router      = express.Router()
;

router.route('/')
    .get(function(req, res) {
        res.render('index', { title: 'Alexandra Roth'});
    })
;

router.route('/power')
    .get(function(req, res) {
        res.render('power', { title: 'Alex lifts heavy things'});
    })
;

module.exports = router;
