ENTORNO EXPERIMENTAL (OBLIGATORIO):

* Node.js: 24.13.0
* npm: 11.6.2
* Angular: 21.1.0
* React: 19.2.0
* Vue: 3.5.24
* Webpack: 5.x
* Docker: 29.4.0
* Kubernetes: v1.34.3
* No usar versiones beta o experimentales

CONFIGURACIÓN DE COMPATIBILIDAD (OBLIGATORIO):

* TypeScript: usar la versión estrictamente compatible con el framework seleccionado
* No usar automáticamente la última versión de TypeScript
* Mantener compatibilidad entre:

  * Framework
  * TypeScript
  * Node.js

REGLAS DE COMPATIBILIDAD:

* Si ocurre error de compilación:

  * identificar incompatibilidad de versiones
  * ajustar TypeScript a una versión compatible
  * actualizar tsconfig.json si es necesario
  * reintentar compilación hasta que funcione correctamente

* No modificar la lógica del sistema para resolver errores

* Solo ajustar configuración y dependencias

CONFIGURACIÓN DE PUERTOS (OBLIGATORIO):

* Host: 4200
* MF-A: 4201
* MF-B: 4202
* MF-C: 4203

Reglas:

* Usar el puerto asignado según el microfrontend
* No cambiar puertos entre ejecuciones

REGLAS GENERALES:

* Mantener consistencia entre implementaciones
* No optimizar código específicamente para el framework
* No introducir librerías adicionales innecesarias
* Mantener complejidad estructural similar entre microfrontends
* Garantizar funcionalidad equivalente en todos los casos
