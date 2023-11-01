export function checkRoles(roles) {
    return (req, res, next) => {
      const { user } = req.session; // Suponiendo que tienes el usuario en la sesión
  
      if (user && roles.includes(user.role)) {
        // El usuario tiene uno de los roles permitidos, permite el acceso
        next();
      } else {
        // El usuario no tiene permisos, redirige o muestra un mensaje de error
        res.status(403).send('No tienes permisos para acceder a esta página.');
      }
    };
  }