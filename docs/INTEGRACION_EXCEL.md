# Integración Excel RAMS v9

La exportación se realiza exclusivamente a nivel de Proyecto.

La jerarquía de origen es:

Cliente → Proyecto → Máquina / Línea → Zona → RAMS (Evaluación) → Evidencias

El archivo `NOMBRE_PROYECTO_RAMS_Integracion.xlsx` se guarda en la raíz de la carpeta del Proyecto cuando existe una carpeta local vinculada. También se descarga al dispositivo.

La hoja `RAMS_Integration` incluye Cliente, Proyecto, Máquina/Línea, Zona, RAMS, peligro, tarea, valores FE/DPH/NP/LO, HRN, controles, reducción, PLr y cantidad/ruta de evidencias.

Cada análisis Peligro/Tarea se exporta en una hoja `RAMS-N`, manteniendo las posiciones principales de datos del formulario RAMS original.
