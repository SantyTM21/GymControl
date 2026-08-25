-- =====================================================
-- DATOS DE PRUEBA - RUTINAS GYMCONTROL
-- =====================================================
-- Requiere que exista al menos un perfil con role = OWNER
-- =====================================================

WITH owner_user AS (
    SELECT id
    FROM public.profiles
    WHERE role = 'OWNER'
    LIMIT 1
)
INSERT INTO public.routines (
    id,
    owner_id,
    created_by,
    name,
    description,
    objective,
    level,
    duration_minutes,
    is_published,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    o.id,
    o.id,
    r.name,
    r.description,
    r.objective::routine_objective,
    r.level::routine_level,
    r.duration_minutes,
    r.is_published,
    now(),
    now()
FROM owner_user o
CROSS JOIN (
    VALUES

    (
        'Full Body Inicial',
        'Rutina de cuerpo completo diseñada para personas que están comenzando en el gimnasio. Trabaja los principales grupos musculares con ejercicios básicos.',
        'CONDITIONING',
        'BEGINNER',
        40,
        true
    ),

    (
        'Fuerza para Principiantes',
        'Rutina enfocada en desarrollar una base de fuerza mediante movimientos compuestos y una progresión controlada.',
        'STRENGTH',
        'BEGINNER',
        45,
        true
    ),

    (
        'Hipertrofia Inicial',
        'Entrenamiento orientado al aumento de masa muscular utilizando volumen moderado y ejercicios sencillos.',
        'HYPERTROPHY',
        'BEGINNER',
        50,
        true
    ),

    (
        'Quema Calorías Express',
        'Sesión dinámica para aumentar el gasto energético mediante ejercicios de cuerpo completo y descansos cortos.',
        'WEIGHT_LOSS',
        'BEGINNER',
        30,
        true
    ),

    (
        'Piernas y Glúteos Inicial',
        'Entrenamiento básico para fortalecer piernas y glúteos trabajando cuádriceps, femorales, pantorrillas y cadera.',
        'HYPERTROPHY',
        'BEGINNER',
        45,
        true
    ),

    (
        'Tren Superior Inicial',
        'Rutina para desarrollar pecho, espalda, hombros y brazos con una intensidad apropiada para principiantes.',
        'HYPERTROPHY',
        'BEGINNER',
        45,
        true
    ),

    (
        'Full Body Intermedio',
        'Entrenamiento completo con mayor volumen e intensidad para usuarios que ya poseen experiencia básica.',
        'CONDITIONING',
        'INTERMEDIATE',
        60,
        true
    ),

    (
        'Push - Pecho Hombro y Tríceps',
        'Sesión especializada en músculos de empuje con énfasis en pecho, deltoides y tríceps.',
        'HYPERTROPHY',
        'INTERMEDIATE',
        65,
        true
    ),

    (
        'Pull - Espalda y Bíceps',
        'Rutina de músculos de tirón enfocada en desarrollar amplitud y grosor de espalda junto con bíceps.',
        'HYPERTROPHY',
        'INTERMEDIATE',
        65,
        true
    ),

    (
        'Leg Day Intermedio',
        'Entrenamiento completo de piernas con ejercicios para cuádriceps, glúteos, femorales y pantorrillas.',
        'HYPERTROPHY',
        'INTERMEDIATE',
        70,
        true
    ),

    (
        'Fuerza 5x5',
        'Rutina basada en series de cinco repeticiones para desarrollar fuerza en los principales movimientos compuestos.',
        'STRENGTH',
        'INTERMEDIATE',
        70,
        true
    ),

    (
        'Cardio y Fuerza',
        'Entrenamiento combinado con bloques de fuerza y acondicionamiento cardiovascular.',
        'WEIGHT_LOSS',
        'INTERMEDIATE',
        50,
        true
    ),

    (
        'Core y Estabilidad',
        'Rutina enfocada en abdomen, zona media y estabilidad corporal mediante ejercicios de control y resistencia.',
        'CONDITIONING',
        'INTERMEDIATE',
        35,
        true
    ),

    (
        'Upper Body Strength',
        'Sesión de fuerza para tren superior centrada en press, remos y movimientos compuestos.',
        'STRENGTH',
        'INTERMEDIATE',
        75,
        true
    ),

    (
        'Hipertrofia Avanzada Push',
        'Entrenamiento de alto volumen para pecho, hombros y tríceps orientado a deportistas experimentados.',
        'HYPERTROPHY',
        'ADVANCED',
        80,
        true
    ),

    (
        'Hipertrofia Avanzada Pull',
        'Rutina avanzada para espalda y bíceps con diferentes ángulos, rangos de repetición y alta intensidad.',
        'HYPERTROPHY',
        'ADVANCED',
        80,
        true
    ),

    (
        'Piernas Alta Intensidad',
        'Rutina avanzada de piernas con alto volumen para aumentar fuerza y masa muscular.',
        'HYPERTROPHY',
        'ADVANCED',
        90,
        true
    ),

    (
        'Power Training',
        'Programa avanzado enfocado en fuerza máxima mediante movimientos compuestos y descansos prolongados.',
        'STRENGTH',
        'ADVANCED',
        90,
        true
    ),

    (
        'Metabolic Challenge',
        'Entrenamiento metabólico avanzado con intervalos de alta intensidad para mejorar condición y gasto energético.',
        'WEIGHT_LOSS',
        'ADVANCED',
        55,
        true
    ),

    (
        'Full Body Advanced',
        'Rutina avanzada de cuerpo completo que combina fuerza, hipertrofia y acondicionamiento.',
        'CONDITIONING',
        'ADVANCED',
        85,
        true
    ),

    (
        'Entrenamiento Express',
        'Rutina corta para días con poco tiempo que trabaja los principales grupos musculares.',
        'CONDITIONING',
        'BEGINNER',
        20,
        true
    ),

    (
        'Fuerza de Piernas',
        'Entrenamiento centrado en aumentar la fuerza del tren inferior mediante movimientos compuestos.',
        'STRENGTH',
        'INTERMEDIATE',
        70,
        true
    ),

    (
        'Hipertrofia de Brazos',
        'Sesión dedicada al desarrollo de bíceps y tríceps utilizando diferentes rangos de repeticiones.',
        'HYPERTROPHY',
        'INTERMEDIATE',
        50,
        true
    ),

    (
        'Circuito Fitness',
        'Circuito de cuerpo completo orientado a mejorar resistencia muscular y condición física general.',
        'WEIGHT_LOSS',
        'BEGINNER',
        35,
        true
    )

) AS r(
    name,
    description,
    objective,
    level,
    duration_minutes,
    is_published
);