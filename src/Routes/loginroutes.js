import { Router } from "express";

const loginrouter = Router();

loginrouter.get('/index', (req, res) => {
  const { user } = req.session;

  // Renderiza la vista "index" con el mensaje de bienvenida y el botón de cierre de sesión
  res.render('index', {
    title: 'Página de Inicio',
    user,
    showWelcomeMessage: !!user, // Muestra el mensaje de bienvenida si el usuario está autenticado
    showLogoutButton: !!user, // Muestra el botón de cierre de sesión si el usuario está autenticado
  });
});

loginrouter.post('/login', (req, res) => {
  const { email, password } = req.body; // Supongamos que se envía el correo y la contraseña desde el formulario

  // Aquí debes realizar la lógica de autenticación, por ejemplo, consultar una base de datos
  // para verificar si el usuario existe y si la contraseña es válida

  // Ejemplo de verificación simple (esto puede variar dependiendo de tu implementación real):
  if (email === 'usuario@example.com' && password === 'contraseña') {
    // Autenticación exitosa, configura la variable de sesión con los datos del usuario
    const user = {
      id: 1,
      email: email,
      // Otras propiedades del usuario
    };
    req.session.user = user;

    // Redirige al usuario a la página de bienvenida (index)
    res.redirect('/index');
  } else {
    // Autenticación fallida, puedes mostrar un mensaje de error o redirigir a la página de inicio de sesión nuevamente
    res.render('login', { error: 'Credenciales incorrectas' });
  }
});

export default loginrouter;