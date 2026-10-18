# Instalación y publicación

## Publicación en GitHub Pages
1. Descomprimir el paquete y cargar **todo el contenido** en la raíz del repositorio.
2. En GitHub, abrir **Settings → Pages** y seleccionar **GitHub Actions**.
3. En **Actions**, verificar el workflow `Deploy RAMS HRN PWA`.
4. Abrir la URL de Pages. Para instalar en móvil, utilizar el menú del navegador o el botón de instalación si aparece.

## Uso local
La PWA requiere servirse por HTTP/HTTPS para que el service worker funcione; no alcanza con abrir `index.html` como archivo local.

## Copias de seguridad
Usar `Exportar respaldo` para generar JSON e importar en otro dispositivo. CSV exporta las evaluaciones en formato legible por Excel. Los datos permanecen en el navegador y no se sincronizan automáticamente entre dispositivos.

## Datos técnicos
El producto HRN calculado es FE × DPH × NP × LO. Confirmar los nombres, escalas, criterios y umbrales contra el archivo Excel RAMS aprobado antes de utilizar los resultados como registro de seguridad definitivo.
