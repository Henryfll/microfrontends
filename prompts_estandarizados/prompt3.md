{INCLUIR BLOQUE GLOBAL}

Integra el microfrontend {MF-A | MF-B | MF-C} usando Module Federation.

---

OBJETIVO:

Exponer el microfrontend como módulo remoto totalmente compatible con el host, evitando conflictos de versiones y errores de carga.

---

REQUISITOS:

* Usar Webpack 5.x
* Exponer el microfrontend como módulo remoto
* Permitir consumo desde host
* Mantener independencia del microfrontend
* Configurar remotes usando los puertos definidos:

  * MF-A → http://localhost:4201
  * MF-B → http://localhost:4202
  * MF-C → http://localhost:4203

---

REGLA CRÍTICA DE COMPATIBILIDAD (OBLIGATORIO):

Si el framework es Angular, asegurar que TODOS los proyectos (host y microfrontends) usen EXACTAMENTE:

* @angular/core: 21.1.0
* @angular/common: 21.1.0
* @angular/forms: 21.1.0
* @angular/router: 21.1.0

Reglas:

* No usar ^ o ~
* No usar versiones distintas entre proyectos
* Si detecta inconsistencias:

  * corregir automáticamente package.json
  * eliminar node_modules
  * reinstalar dependencias

---

CONFIGURACIÓN DE MODULE FEDERATION:

* Configurar Webpack 5 correctamente
* Exponer el microfrontend como remote
* Configurar:

  library: { type: "var", name: "<nombre_del_microfrontend>" }

---

CONFIGURACIÓN DE SHARED (CRÍTICO PARA ANGULAR):

Si el microfrontend usa Angular, configurar explícitamente:

shared: {
"@angular/core": {
singleton: true,
strictVersion: true,
requiredVersion: "21.1.0"
},
"@angular/common": {
singleton: true,
strictVersion: true,
requiredVersion: "21.1.0"
},
"@angular/forms": {
singleton: true,
strictVersion: true,
requiredVersion: "21.1.0"
},
"@angular/router": {
singleton: true,
strictVersion: true,
requiredVersion: "21.1.0"
}
}

Reglas:

* No usar requiredVersion: "auto"
* No omitir dependencias Angular
* No usar configuraciones implícitas

---

VALIDACIÓN DE COMPATIBILIDAD (OBLIGATORIA):

1. Verificar que NO exista:

   library: { type: "module" }

2. Si existe:

   * convertir automáticamente a:
     library: { type: "var" }

3. Verificar que:

   * remoteEntry.js sea accesible en:
     [http://localhost:PUERTO/remoteEntry.js](http://localhost:PUERTO/remoteEntry.js)
   * cargue correctamente en el navegador
   * funcione como script clásico (no ESM)

---

VALIDACIÓN FUNCIONAL (OBLIGATORIA):

1. Verificar que el proyecto compile correctamente
2. Verificar que el microfrontend se ejecute sin errores
3. Verificar que el módulo remoto sea accesible
4. Verificar integración con host

---

MANEJO AUTOMÁTICO DE ERRORES (OBLIGATORIO):

Si ocurre:

* Unsatisfied version
* Error de shared
* Fallo al cargar remoteEntry

Entonces:

* identificar dependencia conflictiva
* alinear versiones Angular
* corregir configuración shared
* limpiar dependencias
* reconstruir proyecto
* reintentar hasta que funcione

---

CONSIDERACIONES POR FRAMEWORK:

* Angular:

  * Asegurar compatibilidad con Webpack 5
  * Configurar custom webpack o builders necesarios
  * Validar bootstrap dinámico si aplica
  * Forzar consistencia de versiones (CRÍTICO)

* React y Vue:

  * Configuración estándar con webpack
  * No aplicar reglas de Angular

---

RESTRICCIONES:

* No modificar la lógica funcional interna
* No optimizar el código
* Solo ajustar configuración de integración

---

SALIDA ESPERADA:

* Configuración webpack completa y funcional
* Código necesario actualizado
* Ejemplo de integración en host

---

CONFIRMACIÓN FINAL (OBLIGATORIA):

Indicar explícitamente:

✔ compila correctamente
✔ microfrontend ejecuta sin errores
✔ remoteEntry.js accesible
✔ módulo expuesto correctamente
✔ integración funcional con host
✔ sin errores de tipo "Unsatisfied version"
✔ versiones Angular alineadas (si aplica)
