import { Router } from 'express';
import passport from 'passport';

const sessionRouter = Router();

// Ruta para el inicio de sesión
sessionRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  // Si la autenticación es exitosa, puedes responder con éxito aquí
  res.json({ message: 'Inicio de sesión exitoso' });
});

export default sessionRouter;