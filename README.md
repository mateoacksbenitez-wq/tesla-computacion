# Tesla Computación — Web a medida

Sitio web para un local de venta, armado y service de PCs en Santa Fe, Argentina.

**En vivo:** https://tesla-computacion.vercel.app

## Funcionalidades

- **Armador de PC en 10 pasos** (uso, nivel, procesador, RAM, placa de video, gabinete, almacenamiento, cooler, fuente y checkout), con filtros por marca y gama, aviso de cuello de botella, cálculo de la fuente recomendada y envío del presupuesto armado por WhatsApp.
- **Catálogo con stock real**, filtrado por categoría, con estados "Disponible", "Última unidad" y "Agotado".
- **PCs armadas**: combos listos con foto, precio y lista de componentes.
- **Destacados y ofertas** en la página de inicio, y un **banner rotativo** de promociones.
- **Página de notebooks** como dealer oficial NetComeX.
- **Panel de administración** con login: el dueño gestiona productos, fotos, precios, stock, ofertas, PCs armadas y banner sin tocar código.
- **Carga de imágenes**: desde la PC o pegando un link externo; en ese caso el servidor descarga la foto y la guarda en el almacenamiento propio.
- Diseño oscuro y adaptado a celulares.

## Tecnologías

- **Next.js** (App Router) · **React** · **TypeScript**
- **Tailwind CSS** · componentes shadcn/ui · **Framer Motion**
- **Zustand** para el estado del armador
- **PostgreSQL** (Neon) en producción y SQLite en desarrollo, con la misma capa de datos
- **Vercel Blob** para las imágenes · deploy en **Vercel**
- Autenticación del panel con **JWT** (jose) y contraseña hasheada con **bcrypt**

## Correr en local

```bash
npm install
cp .env.local.example .env.local   # completar ADMIN_PASSWORD_HASH y JWT_SECRET
npm run dev
```

Sin `POSTGRES_URL` usa una base SQLite local en `data/`, y sin `BLOB_READ_WRITE_TOKEN` guarda las fotos en `public/uploads/`.

Para generar el hash de la contraseña del panel:

```bash
node scripts/set-admin-password.mjs "tu-clave"
```
