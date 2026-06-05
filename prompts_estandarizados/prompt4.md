{INCLUIR BLOQUE GLOBAL}

Integra el microfrontend {MF-A | MF-B | MF-C} usando single-spa.

Requisitos:

* Configurar el microfrontend como aplicación registrable en single-spa
* Implementar correctamente lifecycle functions:

  * bootstrap
  * mount
  * unmount
* Permitir integración con un root-config (host)
* Mantener independencia del microfrontend
* Registrar aplicaciones usando las URLs basadas en los puertos definidos en el entorno experimental.

Restricciones:

* No modificar la lógica funcional interna
* No optimizar el código

VALIDACIÓN OBLIGATORIA:

1. Verificar que el proyecto compile correctamente
2. Verificar que el microfrontend se ejecute sin errores
3. Verificar que:

   * bootstrap se ejecute correctamente
   * mount renderice la aplicación
   * unmount limpie correctamente el DOM
4. Verificar que el microfrontend pueda ser cargado desde un root-config
5. Si ocurre algún error:

   * identificar la causa
   * corregir automáticamente la configuración
   * reintentar hasta que funcione correctamente

CONSIDERACIONES POR FRAMEWORK:

* Para Angular:

  * Usar single-spa-angular
  * Configurar correctamente zone.js
  * Adaptar bootstrap para single-spa
  * Verificar que no haya conflictos con el ciclo de vida Angular

* Para React:

  * Usar single-spa-react
  * Verificar render y unmount correctos

* Para Vue:

  * Usar single-spa-vue
  * Verificar montaje y desmontaje correcto

SALIDA OBLIGATORIA:

* Configuración completa funcional
* Código actualizado
* Registro en root-config (ejemplo)
* Confirmación explícita de que:
  ✔ compila
  ✔ ejecuta
  ✔ se monta correctamente
  ✔ se desmonta correctamente
  ✔ funciona dentro de single-spa
