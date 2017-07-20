var express     = require('express')
,   router      = express.Router()
;

router.route('/')
    .get(function(req, res) {
        res.render('index', { title: 'VM Dinner Boilerplate', word: 'alex did a thing'});
    })
;

module.exports = router;
