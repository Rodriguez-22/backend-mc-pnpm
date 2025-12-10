// ✅ Ruta corregida: añadimos /productos/
export * from './ms-productos/productos/create-productos.dto';
export * from './ms-productos/productos/update-productos.dto';
export * from './ms-productos/categorias/create-categoria.dto';
export * from './ms-productos/categorias/update-categoria.dto';


// Usuarios
export * from './ms-usuarios/create-usuario.dto';
export * from './ms-usuarios/update-usuario.dto';

// ... tus otros exports
export * from './ms-productos/alergenos/create-alergeno.dto';
export * from './ms-productos/alergenos/update-alergeno.dto';

// Si necesitas categorías en el futuro, añádelas así:
// export * from './ms-productos/categorias/create-categoria.dto';