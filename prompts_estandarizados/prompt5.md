{INCLUIR BLOQUE GLOBAL}

Genera una aplicación host para microfrontends.

---

PARÁMETRO:

* Orquestador: {Module Federation | Single-SPA}

---

OBJETIVO:

Construir un host que integre múltiples microfrontends (MF-A, MF-B, MF-C) con bajo acoplamiento, garantizando consistencia funcional y correcta orquestación según el mecanismo seleccionado.

---

REQUISITOS:

* Integrar MF-A, MF-B, MF-C
* Navegación simple entre microfrontends
* Bajo acoplamiento
* Respetar los puertos definidos:

  * MF-A → http://localhost:4201
  * MF-B → http://localhost:4202
  * MF-C → http://localhost:4203

---

CONFIGURACIÓN SEGÚN ORQUESTADOR (OBLIGATORIO):

### Si Orquestador = Module Federation:

* Usar Webpack 5

* Configurar remotes en el host. El nombre a la izquierda del `@` debe coincidir EXACTAMENTE con el `name`/`library.name` declarado por cada microfrontend remoto:

  remotes: {
    mfa: "mfA@http://localhost:4201/remoteEntry.js",
    mfb: "mfB@http://localhost:4202/remoteEntry.js",
    mfc: "mfC@http://localhost:4203/remoteEntry.js"
  }

* Asegurar compatibilidad (NO usar ESM para los remoteEntry):

  * En cada microfrontend que EXPONE módulos:
    * library: { type: "var", name: "<nombre del MF>" }
    * output.scriptType: "text/javascript"
    * experiments.outputModule: false

  * En el host (que SOLO consume, no expone):
    * NO declarar `library` dentro de ModuleFederationPlugin
      (definir `library` con type "var" sobreescribe el `remoteType` por
      defecto y hace que webpack genere `module.exports = mfA@http://...;`
      como var-external — sintaxis inválida)
    * Declarar explícitamente: remoteType: "script"
    * output.scriptType: "text/javascript"
    * experiments.outputModule: false

* Si el host consume microfrontends Angular mediante shared dependencies:

  * Alinear versiones EXACTAS:

    * @angular/core: 21.1.0
    * @angular/common: 21.1.0
    * @angular/forms: 21.1.0
    * @angular/router: 21.1.0

  * Configurar shared:

    shared: {
      "@angular/core":   { singleton: true, strictVersion: true, requiredVersion: "21.1.0" },
      "@angular/common": { singleton: true, strictVersion: true, requiredVersion: "21.1.0" },
      "@angular/forms":  { singleton: true, strictVersion: true, requiredVersion: "21.1.0" },
      "@angular/router": { singleton: true, strictVersion: true, requiredVersion: "21.1.0" }
    }

  Reglas:

  * No usar ^ o ~
  * No usar requiredVersion: "auto"

Si el host consume microfrontends de distintos frameworks:

* Cada microfrontend debe ser autocontenido
* El host NO debe compartir runtimes específicos de frameworks
* El host únicamente debe orquestar carga y renderizado
* Cada microfrontend administra internamente su bootstrap y ciclo de vida

La estrategia de minificación debe ser CONSISTENTE en todos los escenarios experimentales.

---

### Si Orquestador = single-spa:

* Configurar root-config

* Registrar aplicaciones:

  * MF-A
  * MF-B
  * MF-C

* Definir lifecycle functions:

  * bootstrap
  * mount
  * unmount

* Configurar rutas o activación por navegación

* Cargar microfrontends mediante:

  * SystemJS o import dinámico

* No usar configuración de Webpack remotes

---

CONSISTENCIA DE INTERFAZ (OBLIGATORIO):

El host debe implementar una interfaz mínima equivalente en todos los escenarios:

Requisitos:

* Mostrar exactamente 3 opciones:

  * MF-A
  * MF-B
  * MF-C

* Navegación mediante:

  * botones simples o enlaces

* Layout:

  * contenedor principal
  * área de navegación
  * área de renderizado

Restricciones:

* No usar librerías de UI
* No agregar estilos complejos
* No introducir lógica adicional

---

VALIDACIÓN DE INTEGRACIÓN (OBLIGATORIA):

### Para Module Federation:

Verificar que:

* remoteEntry.js esté accesible en cada puerto (4201/4202/4203) → HTTP 200
* en el bundle del host, cada external se genere como wrapper script-external
  (Promise + __webpack_require__.l + global lookup), NO como
  `module.exports = <expr>@http://...`
* los remotes carguen correctamente en runtime
* no exista error:

  * SyntaxError: Invalid or unexpected token (causado por var-external mal generado)
  * ScriptExternalLoadError
  * incompatibilidad ESM vs script

Si ocurre error:
* identificar causa
* reportar el error
* NO modificar automáticamente la configuración

---

### Para single-spa:

Verificar que:

* cada microfrontend se registre correctamente
* lifecycle functions funcionen
* mount/unmount ocurra sin errores

Si ocurre error:
* identificar causa
* reportar error
* NO modificar automáticamente la configuración

---

VALIDACIÓN FUNCIONAL (OBLIGATORIA):

* El host compila correctamente (Las mediciones experimentales deben realizarse utilizando el mismo modo de compilación en todos los escenarios (development o production).)
* El host ejecuta sin errores
* MF-A carga correctamente (mount + unmount limpio)
* MF-B carga correctamente (mount + unmount limpio)
* MF-C carga correctamente (mount + unmount limpio)
* Navegación funcional entre microfrontends sin recarga
* No errores en consola del navegador
* Cambiar entre MFs no genera memory leaks ni componentes huérfanos

---

RESTRICCIONES:

* No modificar lógica interna de microfrontends
* No optimizar código
* Mantener consistencia entre escenarios
* No agregar `library` a la config de ModuleFederationPlugin del host
* No usar valores `auto`, `^` ni `~` en `requiredVersion`

---

SALIDA ESPERADA:

* Código del host
* Configuración completa según orquestador
* Ejemplo de integración de MF-A, MF-B, MF-C
* Instrucciones de ejecución (orden de arranque: MFs primero, host después)

---

CONFIRMACIÓN FINAL (OBLIGATORIA):

Indicar explícitamente:

✔ host compila
✔ host ejecuta
✔ microfrontends integrados
✔ navegación funcional
✔ sin errores de integración
✔ configuración correcta según orquestador
✔ externals del host generados como script-externals (no var-externals)
