export interface ExternalExercise {
  id: number;
  nombre: string;
  grupoMuscular: string;
  descripcion: string;
  equipamiento: string;
  imagenUrl: string | null;
  fuente: "wger";
}

export interface WgerCategory {
  id: number;
  name: string;
}

export interface WgerMuscle {
  id: number;
  name: string;
  name_en: string;
}

export interface WgerEquipment {
  id: number;
  name: string;
}

export interface WgerImage {
  id: number;
  image: string;
  is_main: boolean;
}

export interface WgerTranslation {
  id: number;
  language: number;
  name: string;
  description_source: string;
}

export interface WgerExerciseInfo {
  id: number;
  category: WgerCategory;
  muscles: WgerMuscle[];
  equipment: WgerEquipment[];
  images: WgerImage[];
  translations: WgerTranslation[];
}

export interface WgerExerciseResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WgerExerciseInfo[];
}
