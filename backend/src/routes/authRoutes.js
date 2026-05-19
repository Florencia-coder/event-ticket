import { Router } from "express";
const router = Router();

import {
    register,
    getRegister,
    deleteRegister,
    updateRegister,
    checkEmailExists
} from "../controllers/registerController.js";

import {
    login,
    getLogin,
    deleteLogin,
    updateLogin
} from "../controllers/loginController.js";

import {
    sendOTPCode,
    verifyOTP
} from "../controllers/otpController.js";

import {
    validateRegisterInput,
    validateLoginInput,
    validateUpdateRegisterInput,
    validateUpdatePasswordInput
} from "../middlewares/validators.js";

// Register endpoints
router.get("/register", getRegister);
router.get("/register/exists", checkEmailExists);
router.post("/register", validateRegisterInput, register);
router.delete("/register/:userId", deleteRegister);
router.put("/register/:userId", validateUpdateRegisterInput, updateRegister);
router.patch("/register/:userId", validateUpdateRegisterInput, updateRegister);

// Login endpoints (contraseña)
router.get("/login", getLogin);
router.post("/login", validateLoginInput, login);
router.delete("/login", deleteLogin);
router.put("/login/:userId", validateUpdatePasswordInput, updateLogin);
router.patch("/login/:userId", validateUpdatePasswordInput, updateLogin);

// OTP endpoints (código 4 dígitos)
router.post("/login/send-code", sendOTPCode);
router.post("/login/verify-code", verifyOTP);


export default router;