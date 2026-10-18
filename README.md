# RAMS · HRN PWA — AVEC

Aplicación web progresiva para relevamientos de seguridad industrial, con jerarquía Cliente → Proyecto → Línea/Máquina → Límites → Peligros/Tareas → RAMS/HRN.

## Archivos principales
- `index.html`: interfaz.
- `styles.css`: look & feel adaptable.
- `app.js`: lógica de registros, matriz y cálculos.
- `manifest.webmanifest`: metadatos PWA.
- `sw.js`: caché y funcionamiento offline.
- `assets/logo-avec-plumas-azules.png`: logo AVEC adjunto por el usuario.
- `data/`: catálogos provisionales.
- `reference/`: reservado para el Excel oficial de referencia.
- `docs/`: instrucciones.
- `.github/workflows/deploy.yml`: publicación automática.

## Publicar
Subir todos los archivos al repositorio y activar GitHub Pages con GitHub Actions. Ver `docs/INSTALACION.md`.

## Importante
El HRN se calcula como `FE × DPH × NP × LO`. Validar escalas, listas desplegables, fórmula y categorías de riesgo contra el Excel oficial antes del uso operativo. Los datos se almacenan en el navegador y no se sincronizan automáticamente entre dispositivos.
