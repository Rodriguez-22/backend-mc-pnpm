set -e

main() {
  # Ejecutar el microservicio Client Gateway en modo desarrollo
  # Se asume que el script 'start:client-gateway:dev' está definido
  # en el package.json principal.
  pnpm start:gateway:dev
}

main
# Se elimina 'tail -f /dev/null' ya que la aplicación NestJS
# debe ser el proceso principal (PID 1) del contenedor.