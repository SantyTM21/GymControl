import type {
  ExternalExercise,
  WgerCategory,
  WgerEquipment,
  WgerExerciseInfo,
  WgerExerciseResponse,
  WgerImage,
  WgerMuscle,
  WgerTranslation,
} from "@/types/external-exercise";

const WGER_EXERCISES_URL =
  "https://wger.de/api/v2/exerciseinfo/?limit=24&language=4";
const SPANISH_LANGUAGE_ID = 4;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCategory(value: unknown): value is WgerCategory {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string"
  );
}

function isMuscle(value: unknown): value is WgerMuscle {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.name_en === "string"
  );
}

function isEquipment(value: unknown): value is WgerEquipment {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string"
  );
}

function isImage(value: unknown): value is WgerImage {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.image === "string" &&
    typeof value.is_main === "boolean"
  );
}

function isTranslation(value: unknown): value is WgerTranslation {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.language === "number" &&
    typeof value.name === "string" &&
    typeof value.description_source === "string"
  );
}

function isExerciseInfo(value: unknown): value is WgerExerciseInfo {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    isCategory(value.category) &&
    Array.isArray(value.muscles) &&
    value.muscles.every(isMuscle) &&
    Array.isArray(value.equipment) &&
    value.equipment.every(isEquipment) &&
    Array.isArray(value.images) &&
    value.images.every(isImage) &&
    Array.isArray(value.translations) &&
    value.translations.every(isTranslation)
  );
}

function isExerciseResponse(value: unknown): value is WgerExerciseResponse {
  return (
    isRecord(value) &&
    typeof value.count === "number" &&
    Array.isArray(value.results) &&
    value.results.every(isExerciseInfo)
  );
}

function normalizeDescription(description: string): string {
  const normalized = description.replace(/[*_#`]/g, "").replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "Descripcion no disponible para este ejercicio.";
  }

  return normalized.length > 220
    ? `${normalized.slice(0, 217).trimEnd()}...`
    : normalized;
}

function mapExercise(exercise: WgerExerciseInfo): ExternalExercise | null {
  const translation =
    exercise.translations.find(
      (item) => item.language === SPANISH_LANGUAGE_ID,
    );

  if (!translation?.name.trim()) {
    return null;
  }

  const mainImage =
    exercise.images.find((image) => image.is_main) ?? exercise.images[0];
  const primaryMuscle = exercise.muscles[0];
  const equipment = exercise.equipment.map((item) => item.name).join(", ");

  return {
    id: exercise.id,
    nombre: translation.name.trim(),
    grupoMuscular:
      primaryMuscle?.name_en || primaryMuscle?.name || exercise.category.name,
    descripcion: normalizeDescription(translation.description_source),
    equipamiento: equipment || "No especificado",
    imagenUrl: mainImage?.image ?? null,
    fuente: "wger",
  };
}

export async function getExternalExercises(): Promise<ExternalExercise[]> {
  const response = await fetch(WGER_EXERCISES_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`wger API responded with status ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!isExerciseResponse(payload)) {
    throw new Error("wger API returned an unexpected response");
  }

  return payload.results
    .map(mapExercise)
    .filter((exercise): exercise is ExternalExercise => exercise !== null)
    .slice(0, 12);
}
