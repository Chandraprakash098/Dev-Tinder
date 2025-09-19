const express = require("express");
const connectionController = require("../controllers/connectionController");
const authMiddleware = require("../middlewares/auth");
const router = express.Router()


router.get("/feed/users", authMiddleware, connectionController.seeUsersinFeedPage)

router.post("/request/send/:status/:toUserId", authMiddleware, connectionController.sendRequest)
router.get("/requests/received",  authMiddleware, connectionController.getThePendingConnectionRequest)
router.post("/request/review/:status/:requestId", authMiddleware, connectionController.AcceptOrRejectTheRequest)
router.get("/my/connections", authMiddleware, connectionController.seeTheConnection)

module.exports = router;