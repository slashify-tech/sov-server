import { Router } from "express";
import { verifyAdmin, verifyJwt } from "../middlewares/auth.middleware.js";
import { getConnectionDetails, getConnectionDetailsAdmin } from "../controllers/getConnectionDetails.controller.js";
const router = Router();

router.route("/get-connection-details").get(verifyJwt, getConnectionDetails);
router.route("/get-admin-connection-details").get(verifyAdmin, getConnectionDetailsAdmin);

export default router;
