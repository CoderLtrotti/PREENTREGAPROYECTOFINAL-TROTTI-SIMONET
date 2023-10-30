import express from 'express';
import passport from 'passport';
import UsersController from '../controllers/UserControllers.js';
import { getUsers, getUserById, saveUser } from '../controllers/UserControllers.js'

const usersRouter = express.Router();

// Rutas
usersRouter.post('/', UsersController.createUser);
usersRouter.post('/auth', UsersController.loginUser);
usersRouter.post('/logout', UsersController.logoutUser);
usersRouter.get('/:id', UsersController.getsUserById); // Nueva ruta para obtener un usuario por ID
usersRouter.delete('/:id', UsersController.deleteUserById); // Nueva ruta para
usersRouter.post("/", saveUser)
usersRouter.get("/", getUsers)
usersRouter.get("/:uid", getUserById)

export default usersRouter;

/*import { Router } from 'express'
import { getUsers, getUserById, saveUser } from '../controllers/users.controller.js'

const router = Router()

router.get("/", getUsers)
router.get("/:uid", getUserById)
router.post("/", saveUser)

export default router */