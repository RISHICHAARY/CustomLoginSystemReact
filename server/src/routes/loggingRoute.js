const { Router } = require('express');

const controllers = require('../controllers/loggingController');
const { tokenVerifier } = require('../Helpers/jwtHelpers');

const router = Router()

router.post("/loginUser", controllers.loginUser );
router.post("/registerUser", controllers.registerUser );
router.get("/cookieVerifier",tokenVerifier, controllers.verifyCookie );
router.post("/sendOtp", controllers.getOtp);
router.post("/getUser", controllers.getUser);
router.post("/updatePassword", controllers.updatePassword);

module.exports = router;