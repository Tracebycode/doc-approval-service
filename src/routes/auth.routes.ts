// ---- AUTH ROUTES ----
import { authcontroller } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();


// ---- AUTH ROUTES ----
router.post("/login",authcontroller);

export default router;
