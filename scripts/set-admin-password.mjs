// Uso: node scripts/set-admin-password.mjs "nueva-clave"
// Genera el hash de la nueva contraseña y lo escribe en .env.local (ADMIN_PASSWORD_HASH),
// escapando los signos $ para que Next.js no los interprete como variables.
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const newPassword = process.argv[2];
if (!newPassword) {
  console.error('Uso: node scripts/set-admin-password.mjs "nueva-clave"');
  process.exit(1);
}

const envPath = path.join(import.meta.dirname, "..", ".env.local");
const hash = bcrypt.hashSync(newPassword, 12);
const escapedHash = hash.replace(/\$/g, "\\$");

let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
if (content.match(/^ADMIN_PASSWORD_HASH=.*$/m)) {
  content = content.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${escapedHash}`);
} else {
  content += `${content.endsWith("\n") || content === "" ? "" : "\n"}ADMIN_PASSWORD_HASH=${escapedHash}\n`;
}
fs.writeFileSync(envPath, content);

console.log("Contraseña de admin actualizada. Reiniciá `npm run dev` para que tome efecto.");
