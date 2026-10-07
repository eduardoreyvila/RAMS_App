# RAMS PWA v9

PWA offline para relevamientos RAMS, preparada para Android, cámara, evidencias, almacenamiento local, carpetas de proyecto, exportación Excel por proyecto y GitHub Pages mediante GitHub Actions.

## Jerarquía obligatoria

**Cliente → Proyecto → Máquina / Línea → Zona → RAMS (Evaluación) → Evidencias**

La creación es estrictamente secuencial:

1. Se crea/selecciona un Cliente.
2. Dentro de la pantalla de ese Cliente se crean/seleccionan sus Proyectos.
3. Dentro del Proyecto se crean/seleccionan Máquinas / Líneas.
4. Dentro de la Máquina / Línea se crean/seleccionan Zonas.
5. Dentro de una Zona se crean/seleccionan evaluaciones RAMS.
6. Cada RAMS contiene los peligros/tareas, cálculo HRN y sus Evidencias fotográficas.

No se permite crear un Proyecto sin Cliente, una Máquina/Línea sin Proyecto, una Zona sin Máquina/Línea ni una evaluación RAMS sin Zona.

## Estructura de carpetas

Seleccionando una única carpeta raíz en Chrome/Edge de escritorio, la PWA crea y reutiliza una sola carpeta por Cliente:

```text
CARPETA_RAIZ/
└── CLIENTE/
    ├── PROYECTO_1/
    │   ├── PROYECTO_1_RAMS_Integracion.xlsx
    │   ├── RAMS_Project.json
    │   └── MAQUINA_LINEA/
    │       └── ZONA/
    │           └── RAMS-001/
    │               └── Evidencias/
    │                   ├── 001_EVIDENCIA.jpg
    │                   └── 002_EVIDENCIA.jpg
    └── PROYECTO_2/
        └── ...
```

La carpeta del Excel de exportación está en la raíz del Proyecto. Las fotografías están dentro de la carpeta de cada evaluación RAMS.

## Exportación Excel

La exportación se ejecuta **a nivel del Proyecto**. El `.xlsx` contiene:

- Instrucciones
- RAMS Cover
- Machine Limits
- RAMS_Integration
- RAMS Mapping
- una hoja RAMS-N por cada análisis Peligro/Tarea del proyecto

Cada fila conserva Cliente, Proyecto, Máquina/Línea, Zona, RAMS, peligro, tarea, HRN y ruta de evidencias.

## GitHub Pages

En GitHub: **Settings → Pages → Source → GitHub Actions**.

El workflow es estático y no necesita `npm ci` ni `package-lock.json`.
