{INCLUIR BLOQUE GLOBAL}

Genera un Dockerfile para este microfrontend {MF-A | MF-B | MF-C | HOST}.

OBJETIVO:

Contenerizar el microfrontend manteniendo consistencia y reproducibilidad entre todos los escenarios experimentales.

---

REQUISITOS:

* Usar estrategia multi-stage build

Build stage:
* Imagen base: node:24-alpine
* Usar npm ci
* Generar build de producción reproducible

Runtime stage:
* Imagen base: nginx:alpine
* Servir archivos estáticos generados

---

CONFIGURACIÓN DE PUERTOS:

* Host → 4200
* MF-A → 4201
* MF-B → 4202
* MF-C → 4203

El contenedor debe exponer únicamente el puerto correspondiente.

---

RESTRICCIONES:

* No optimizar específicamente para un framework
* Mantener estructura Docker equivalente entre escenarios
* No agregar herramientas adicionales
* No modificar lógica del microfrontend
* Mantener consistencia entre Module Federation y single-spa

---

VALIDACIÓN OBLIGATORIA:

Verificar que:

* la imagen construya correctamente
* el contenedor inicie sin errores
* la aplicación sea accesible desde el puerto asignado
* los archivos estáticos se sirvan correctamente
* no existan errores de runtime en navegador

Si ocurre error:
* identificar causa
* reportar error
* NO modificar automáticamente la arquitectura

---

SALIDA ESPERADA:

* Dockerfile completo
* Comandos docker build
* Comandos docker run
* Ejemplo de mapeo de puertos
* Confirmación de funcionamiento