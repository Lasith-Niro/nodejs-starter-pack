import express from 'express'
var router = express.Router();
import dashboard from '../controllers/dashboard/dashboard'

router.get('/test',
        dashboard.test
        );

router.post('/generate',
        dashboard.generate
        );

router.post('/verify',
        dashboard.verify
        );

router.post('/org/new',
        dashboard.orgInit
        );

router.post('/handshake',
        dashboard.handshake
        );

module.exports = router;