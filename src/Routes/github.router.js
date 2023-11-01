import { Router } from 'express';
import passport from 'passport';

const githubRouter = Router();

githubRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

githubRouter.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

export default githubRouter;