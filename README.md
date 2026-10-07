# RAMS PWA v10

Jerarquía obligatoria: **Cliente → Proyecto → Máquina / Línea → Zona → RAMS (Evaluación) → Peligros/Tareas → Evidencias**.

- El Proyecto solo se crea desde la pantalla del Cliente.
- La Máquina/Línea solo se crea dentro del Proyecto.
- Una Máquina/Línea puede contener múltiples Zonas.
- Cada Zona puede contener múltiples evaluaciones RAMS.
- Las evidencias fotográficas pertenecen a una evaluación RAMS.
- La pantalla inicial no muestra el logo grande; el logo se conserva únicamente en el encabezado y como icono PWA.
- Se restauran los desplegables de los campos iniciales y los desplegables del análisis a partir de `data/model.json`.
- Tipo de peligro y Descripción del peligro funcionan como desplegables relacionados: primero se selecciona la familia y luego la descripción proveniente del catálogo original.
- Exportación Excel a nivel Proyecto.
- GitHub Pages + GitHub Actions.
- Android/PWA/offline.

La exportación Excel no aparece en la pantalla de Cliente: solo se habilita dentro del Proyecto seleccionado.
