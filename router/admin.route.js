import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { Login, Signup } from "../controller/admin.controller.js";
const route=Router();

route.post('/login',Login)
route.post('/signup', Signup);


export default route