import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { registerSchema } from '../utils/validationSchemas.mjs';
import { register, login, getUsers, getUsernames } from '../controllers/authController.mjs';

const router = Router();

router.post('/register', checkSchema(registerSchema), register);
router.post('/login', login);
router.get('/users', getUsers);
router.post('/usernames', getUsernames);

export default router;
