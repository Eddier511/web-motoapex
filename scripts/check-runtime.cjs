const [major, minor, patch] = process.versions.node.split('.').map(Number)
if (major !== 24 || minor < 22 || (minor === 22 && patch < 1)) {
  console.error(`Se requiere Node.js 24.22.1 o posterior de la rama 24.x. Runtime actual: ${process.version}. Configura el entorno de compilación; la web publicada sigue siendo estática.`)
  process.exit(1)
}
