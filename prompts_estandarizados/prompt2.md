{INCLUIR BLOQUE GLOBAL}
{INCLUIR CONTRATO FUNCIONAL}

Analiza el siguiente microfrontend {MF-A | MF-B | MF-C} y verifica que cumpla:

* El contrato funcional exactamente
* Misma estructura lógica
* Complejidad equivalente a otros microfrontends
* Respetar la configuración de puertos definida en el entorno experimental.
* Configurar scripts de inicio con el puerto correspondiente al microfrontend.

Corrige cualquier diferencia detectada sin:

* cambiar funcionalidad
* optimizar rendimiento

Salida:

* Código corregido
* Lista breve de ajustes realizados

REGLA DE COMPATIBILIDAD GLOBAL:

* El microfrontend debe ser independiente del orquestador
* No debe depender de Module Federation ni de single-spa en su lógica base
* Debe existir una única build base reutilizable
* Para compatibilidad con herramientas de integración:
* El sistema debe poder adaptarse sin cambiar su lógica funcional
* No generar implementaciones distintas por orquestador
