import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local'; // Agrega la importación de LocalStrategy
import userService from '../services/user.service.js';
import { hashPassword, comparePassword } from '../utils/encript.js';
import crypto from 'crypto';

const initializePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.getById(id);
    done(null, user);
  });

  // Configuración de la estrategia GitHub
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv1.b918d72caea3389c',
        clientSecret: 'f72da97f3bfaf5c6ccd4399febfa81a04b9ef9b3',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          // Obtener el correo electrónico del perfil de GitHub
          const email = profile._json.email;
  
          if (!email) {
            return done(null, false, { message: 'Correo electrónico no proporcionado en el perfil de GitHub' });
          }
  
          // Intentar obtener el usuario existente por correo electrónico
          let user = await userService.getByEmail(email);
  
          if (!user) {
            // El usuario no existe, crea uno nuevo
            const randomPassword = crypto.randomBytes(6).toString('hex');
            const hashedPassword = hashPassword(randomPassword);
  
            user = await userService.createUser({
              first_name: profile._json.name,
              last_name: 'ApellidoPorDefecto',
              email: email,
              password: hashedPassword,
              img: profile._json.avatar_url,
            });
  
            console.log(`Contraseña aleatoria generada para ${user.email}: ${randomPassword}`);
          } else {
            // El usuario ya existe
            const isPasswordValid = comparePassword('la-contrasena-proporcionada-por-el-usuario', user.password);
            if (!isPasswordValid) {
              return done(null, false, { message: 'Contraseña incorrecta' });
            }
          }
  
          // Continuar con el resto de la lógica de autenticación...
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  )


  // Configura la estrategia local
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email', // El campo del formulario donde se espera el correo electrónico del usuario
        passwordField: 'password', // El campo del formulario donde se espera la contraseña del usuario
      },
      async (email, password, done) => {
        try {
          const user = await userService.getByEmail(email);
  
          if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
          }
  
          // Convierte la contraseña proporcionada a cadena
          const inputPassword = password.toString();
  
          // Compara la contraseña proporcionada con la contraseña almacenada
          const isPasswordValid = await comparePassword(inputPassword, user.password);
  
          if (!isPasswordValid) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }
  
          return done(null, user);
        } catch (error) {
          return done(error, false, { message: 'Error de autenticación' });
        }
      }
    )
  );
};

export default initializePassport;
