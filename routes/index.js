var express     = require('express')
,   router      = express.Router()
//  Include individual routes here
,   main        = require('./main.js')
;

router.use(main);

module.exports = router;