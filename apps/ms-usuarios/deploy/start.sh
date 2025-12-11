set -e


config_git() {
  git clone "https://github.com/Rodriguez-22/backend-mc-pnpm.git"

}



main() {
  #config_git
  npm install -g npm@11.6.4
  npm install -g pnpm
  pnpm install --frozen-lockfile
  pnpm start:usuarios:dev



}
tail -f /dev/null
