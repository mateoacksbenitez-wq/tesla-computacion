import path from "path";
import type { BannerMensaje, PcArmada, Producto } from "./types";

const usePostgres = !!process.env.POSTGRES_URL;

const PCS_ARMADAS_SCHEMA = `(
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  imagen TEXT,
  precio INTEGER NOT NULL DEFAULT 0,
  componentes TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'Disponible',
  destacado BOOLEAN NOT NULL DEFAULT false
)`;

const BANNER_SCHEMA = `(
  id TEXT PRIMARY KEY,
  texto TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0
)`;

// ---------- Postgres (producción) ----------
async function getPgPool() {
  const { Pool } = await import("pg");
  let pool = global.__teslaPgPool;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });
    global.__teslaPgPool = pool;
    await pool.query(`CREATE TABLE IF NOT EXISTS pcs_armadas ${PCS_ARMADAS_SCHEMA}`);
    await pool.query(`CREATE TABLE IF NOT EXISTS banner_mensajes ${BANNER_SCHEMA}`);
    await pool.query(
      `ALTER TABLE productos ADD COLUMN IF NOT EXISTS destacado BOOLEAN NOT NULL DEFAULT false`
    );
    await pool.query(
      `ALTER TABLE pcs_armadas ADD COLUMN IF NOT EXISTS destacado BOOLEAN NOT NULL DEFAULT false`
    );
  }
  return pool;
}

// ---------- SQLite (desarrollo local) ----------
function getSqliteDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  if (!global.__teslaDb) {
    const dbPath = path.join(process.cwd(), "data", "database.sqlite");
    const instance: import("better-sqlite3").Database = new Database(dbPath);
    instance.pragma("journal_mode = WAL");
    instance.exec(`CREATE TABLE IF NOT EXISTS pcs_armadas ${PCS_ARMADAS_SCHEMA}`);
    instance.exec(`CREATE TABLE IF NOT EXISTS banner_mensajes ${BANNER_SCHEMA}`);
    for (const [table] of [["productos"], ["pcs_armadas"]] as const) {
      const cols = instance.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
      if (!cols.some((c) => c.name === "destacado")) {
        instance.exec(`ALTER TABLE ${table} ADD COLUMN destacado INTEGER NOT NULL DEFAULT 0`);
      }
    }
    global.__teslaDb = instance;
  }
  return global.__teslaDb as import("better-sqlite3").Database;
}

declare global {
  // eslint-disable-next-line no-var
  var __teslaDb: import("better-sqlite3").Database | undefined;
  // eslint-disable-next-line no-var
  var __teslaPgPool: import("pg").Pool | undefined;
}

export async function getAllProducts(): Promise<Producto[]> {
  if (usePostgres) {
    const pool = await getPgPool();
    const { rows } = await pool.query(
      "SELECT * FROM productos ORDER BY categoria, precio_estimado ASC"
    );
    return rows as Producto[];
  }
  return getSqliteDb()
    .prepare("SELECT * FROM productos ORDER BY categoria, precio_estimado ASC")
    .all() as Producto[];
}

export async function getProductById(id: string): Promise<Producto | undefined> {
  if (usePostgres) {
    const pool = await getPgPool();
    const { rows } = await pool.query("SELECT * FROM productos WHERE id = $1", [id]);
    return rows[0] as Producto | undefined;
  }
  return getSqliteDb().prepare("SELECT * FROM productos WHERE id = ?").get(id) as
    | Producto
    | undefined;
}

export async function insertProduct(
  p: Omit<Producto, "estado"> & { estado?: string }
) {
  const estado = p.stock > 0 ? "Disponible" : "Agotado";
  if (usePostgres) {
    const pool = await getPgPool();
    await pool.query(
      `INSERT INTO productos (id, categoria, nombre, imagen, stock, gama, specs, fuente_minima, precio_estimado, estado, has_igpu, destacado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        p.id,
        p.categoria,
        p.nombre,
        p.imagen,
        p.stock,
        p.gama,
        p.specs,
        p.fuente_minima,
        p.precio_estimado,
        estado,
        p.has_igpu,
        !!p.destacado,
      ]
    );
    return;
  }
  getSqliteDb()
    .prepare(
      `INSERT INTO productos (id, categoria, nombre, imagen, stock, gama, specs, fuente_minima, precio_estimado, estado, has_igpu, destacado)
       VALUES (@id, @categoria, @nombre, @imagen, @stock, @gama, @specs, @fuente_minima, @precio_estimado, @estado, @has_igpu, @destacado)`
    )
    .run({ ...p, estado, destacado: p.destacado ? 1 : 0 });
}

export async function updateProduct(
  id: string,
  fields: Partial<Omit<Producto, "id">>
): Promise<boolean> {
  const current = await getProductById(id);
  if (!current) return false;
  const merged = { ...current, ...fields };
  merged.estado = merged.stock > 0 ? "Disponible" : "Agotado";

  if (usePostgres) {
    const pool = await getPgPool();
    await pool.query(
      `UPDATE productos SET nombre=$1, imagen=$2, stock=$3, gama=$4, specs=$5,
       fuente_minima=$6, precio_estimado=$7, categoria=$8, has_igpu=$9, estado=$10, destacado=$11 WHERE id=$12`,
      [
        merged.nombre,
        merged.imagen,
        merged.stock,
        merged.gama,
        merged.specs,
        merged.fuente_minima,
        merged.precio_estimado,
        merged.categoria,
        merged.has_igpu,
        merged.estado,
        !!merged.destacado,
        id,
      ]
    );
    return true;
  }
  getSqliteDb()
    .prepare(
      `UPDATE productos SET nombre=@nombre, imagen=@imagen, stock=@stock, gama=@gama, specs=@specs,
       fuente_minima=@fuente_minima, precio_estimado=@precio_estimado, categoria=@categoria,
       has_igpu=@has_igpu, estado=@estado, destacado=@destacado WHERE id=@id`
    )
    .run({ ...merged, destacado: merged.destacado ? 1 : 0 });
  return true;
}

export async function quickUpdateStock(id: string, stock: number): Promise<boolean> {
  const estado = stock > 0 ? "Disponible" : "Agotado";
  if (usePostgres) {
    const pool = await getPgPool();
    const res = await pool.query(
      "UPDATE productos SET stock = $1, estado = $2 WHERE id = $3",
      [stock, estado, id]
    );
    return (res.rowCount ?? 0) > 0;
  }
  const res = getSqliteDb()
    .prepare("UPDATE productos SET stock = ?, estado = ? WHERE id = ?")
    .run(stock, estado, id);
  return res.changes > 0;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (usePostgres) {
    const pool = await getPgPool();
    const res = await pool.query("DELETE FROM productos WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }
  const res = getSqliteDb().prepare("DELETE FROM productos WHERE id = ?").run(id);
  return res.changes > 0;
}

// ---------- PCs armadas ----------

export async function getAllPcsArmadas(): Promise<PcArmada[]> {
  if (usePostgres) {
    const pool = await getPgPool();
    const { rows } = await pool.query("SELECT * FROM pcs_armadas ORDER BY precio ASC");
    return rows as PcArmada[];
  }
  return getSqliteDb()
    .prepare("SELECT * FROM pcs_armadas ORDER BY precio ASC")
    .all() as PcArmada[];
}

export async function getPcArmadaById(id: string): Promise<PcArmada | undefined> {
  if (usePostgres) {
    const pool = await getPgPool();
    const { rows } = await pool.query("SELECT * FROM pcs_armadas WHERE id = $1", [id]);
    return rows[0] as PcArmada | undefined;
  }
  return getSqliteDb().prepare("SELECT * FROM pcs_armadas WHERE id = ?").get(id) as
    | PcArmada
    | undefined;
}

export async function insertPcArmada(
  p: Omit<PcArmada, "estado"> & { estado?: string }
) {
  const estado = p.stock > 0 ? "Disponible" : "Agotado";
  if (usePostgres) {
    const pool = await getPgPool();
    await pool.query(
      `INSERT INTO pcs_armadas (id, nombre, imagen, precio, componentes, stock, estado, destacado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [p.id, p.nombre, p.imagen, p.precio, p.componentes, p.stock, estado, !!p.destacado]
    );
    return;
  }
  getSqliteDb()
    .prepare(
      `INSERT INTO pcs_armadas (id, nombre, imagen, precio, componentes, stock, estado, destacado)
       VALUES (@id, @nombre, @imagen, @precio, @componentes, @stock, @estado, @destacado)`
    )
    .run({ ...p, estado, destacado: p.destacado ? 1 : 0 });
}

export async function updatePcArmada(
  id: string,
  fields: Partial<Omit<PcArmada, "id">>
): Promise<boolean> {
  const current = await getPcArmadaById(id);
  if (!current) return false;
  const merged = { ...current, ...fields };
  merged.estado = merged.stock > 0 ? "Disponible" : "Agotado";

  if (usePostgres) {
    const pool = await getPgPool();
    await pool.query(
      `UPDATE pcs_armadas SET nombre=$1, imagen=$2, precio=$3, componentes=$4, stock=$5, estado=$6, destacado=$7 WHERE id=$8`,
      [
        merged.nombre,
        merged.imagen,
        merged.precio,
        merged.componentes,
        merged.stock,
        merged.estado,
        !!merged.destacado,
        id,
      ]
    );
    return true;
  }
  getSqliteDb()
    .prepare(
      `UPDATE pcs_armadas SET nombre=@nombre, imagen=@imagen, precio=@precio,
       componentes=@componentes, stock=@stock, estado=@estado, destacado=@destacado WHERE id=@id`
    )
    .run({ ...merged, destacado: merged.destacado ? 1 : 0 });
  return true;
}

export async function quickUpdatePcArmadaStock(id: string, stock: number): Promise<boolean> {
  const estado = stock > 0 ? "Disponible" : "Agotado";
  if (usePostgres) {
    const pool = await getPgPool();
    const res = await pool.query(
      "UPDATE pcs_armadas SET stock = $1, estado = $2 WHERE id = $3",
      [stock, estado, id]
    );
    return (res.rowCount ?? 0) > 0;
  }
  const res = getSqliteDb()
    .prepare("UPDATE pcs_armadas SET stock = ?, estado = ? WHERE id = ?")
    .run(stock, estado, id);
  return res.changes > 0;
}

export async function deletePcArmada(id: string): Promise<boolean> {
  if (usePostgres) {
    const pool = await getPgPool();
    const res = await pool.query("DELETE FROM pcs_armadas WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }
  const res = getSqliteDb().prepare("DELETE FROM pcs_armadas WHERE id = ?").run(id);
  return res.changes > 0;
}

// ---------- Banner rotativo ----------

export async function getAllBannerMensajes(): Promise<BannerMensaje[]> {
  if (usePostgres) {
    const pool = await getPgPool();
    const { rows } = await pool.query("SELECT * FROM banner_mensajes ORDER BY orden ASC");
    return rows as BannerMensaje[];
  }
  return getSqliteDb()
    .prepare("SELECT * FROM banner_mensajes ORDER BY orden ASC")
    .all() as BannerMensaje[];
}

export async function insertBannerMensaje(m: BannerMensaje) {
  if (usePostgres) {
    const pool = await getPgPool();
    await pool.query(
      "INSERT INTO banner_mensajes (id, texto, orden) VALUES ($1,$2,$3)",
      [m.id, m.texto, m.orden]
    );
    return;
  }
  getSqliteDb()
    .prepare("INSERT INTO banner_mensajes (id, texto, orden) VALUES (@id, @texto, @orden)")
    .run(m);
}

export async function updateBannerMensaje(
  id: string,
  fields: Partial<Pick<BannerMensaje, "texto" | "orden">>
): Promise<boolean> {
  const sets: string[] = [];
  const values: unknown[] = [];
  if (fields.texto !== undefined) {
    sets.push(usePostgres ? `texto = $${sets.length + 1}` : "texto = ?");
    values.push(fields.texto);
  }
  if (fields.orden !== undefined) {
    sets.push(usePostgres ? `orden = $${sets.length + 1}` : "orden = ?");
    values.push(fields.orden);
  }
  if (sets.length === 0) return false;

  if (usePostgres) {
    const pool = await getPgPool();
    const res = await pool.query(
      `UPDATE banner_mensajes SET ${sets.join(", ")} WHERE id = $${sets.length + 1}`,
      [...values, id]
    );
    return (res.rowCount ?? 0) > 0;
  }
  const res = getSqliteDb()
    .prepare(`UPDATE banner_mensajes SET ${sets.join(", ")} WHERE id = ?`)
    .run(...values, id);
  return res.changes > 0;
}

export async function deleteBannerMensaje(id: string): Promise<boolean> {
  if (usePostgres) {
    const pool = await getPgPool();
    const res = await pool.query("DELETE FROM banner_mensajes WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }
  const res = getSqliteDb().prepare("DELETE FROM banner_mensajes WHERE id = ?").run(id);
  return res.changes > 0;
}
