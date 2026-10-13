export type Categoria =
  | "uso"
  | "cpu"
  | "gpu"
  | "gabinete"
  | "fuente"
  | "mother"
  | "cooler"
  | "almacenamiento"
  | "ram"
  | "perifericos";
export type Gama = "baja" | "media" | "alta";
export type Estado = "Disponible" | "Agotado";

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  uso: "Uso / Perfil",
  cpu: "Procesador (CPU)",
  gpu: "Placa de Video (GPU)",
  gabinete: "Gabinete",
  fuente: "Fuente de Alimentación",
  mother: "Motherboard",
  cooler: "Cooler / Refrigeración",
  almacenamiento: "Almacenamiento",
  ram: "Memoria RAM",
  perifericos: "Agregados",
};

export interface Producto {
  id: string;
  categoria: Categoria;
  nombre: string;
  imagen: string | null;
  stock: number;
  gama: Gama;
  specs: string | null;
  fuente_minima: number;
  precio_estimado: number;
  estado: Estado;
  has_igpu: number; // 0 | 1, sqlite boolean
  destacado: boolean;
}

export const GAMA_LABEL: Record<Gama, string> = {
  baja: "Entrada",
  media: "Media",
  alta: "Alta",
};

export interface PcArmada {
  id: string;
  nombre: string;
  imagen: string | null;
  precio: number;
  componentes: string;
  stock: number;
  estado: Estado;
  destacado: boolean;
}

export interface BannerMensaje {
  id: string;
  texto: string;
  orden: number;
}
