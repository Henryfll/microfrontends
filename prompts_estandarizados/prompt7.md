{INCLUIR BLOQUE GLOBAL}

Genera un pipeline CI/CD completo para este microfrontend dentro de un entorno experimental controlado y reproducible.

---

PARÁMETROS:

* Orquestador: {Module Federation | single-spa}
* Rol del componente: {host | mf-a | mf-b | mf-c}
* Namespace Kubernetes: {mf-experiment | single-spa-experiment}
* Puerto: {4200 | 4201 | 4202 | 4203}
* Branch: {module-federation | single-spa}
* Imagen Docker: generada previamente en la fase de contenedorización

---

OBJETIVO:

Implementar un pipeline CI/CD homogéneo que permita medir tiempos de ejecución, calidad de código y despliegue en Kubernetes, garantizando comparabilidad entre arquitecturas de microfrontends.

---

FLUJO OBLIGATORIO DEL PIPELINE (ORDEN FIJO):

1. Checkout del repositorio
2. Configuración de entorno Node.js (versión fija del experimento)
3. Instalación de dependencias con npm ci
4. ANÁLISIS DE CALIDAD (SONARQUBE)
5. Build de la aplicación
6. Construcción de imagen Docker
7. Despliegue en Kubernetes
8. Espera de estado Ready (rollout status)
9. Ejecución de prueba de humo (smoke test HTTP)

---

QUALITY GATE (OBLIGATORIO - SONARQUBE):

* Ejecutar análisis estático antes del build
* Validar:
  - code smells
  - duplicación de código
  - complejidad ciclomática
  - maintainability index
* Si falla quality gate:
  - detener pipeline
  - registrar error
  - NO continuar a build ni deploy

---

CONFIGURACIÓN KUBERNETES:

* Usar namespace definido en parámetros
* No usar ingress
* No usar autoscaling
* No usar service mesh
* Mantener replicas fijas en 2
* Usar configuración previamente generada en fase Kubernetes

---

SMOKE TEST (OBLIGATORIO):

Validar acceso HTTP en:

http://localhost:<PUERTO>

Si falla:
* detener pipeline
* registrar error
* no intentar corrección automática

---

REGLAS EXPERIMENTALES:

* No modificar lógica del microfrontend
* No optimizar código por framework
* Mantener pipeline idéntico entre Module Federation y single-spa
* No introducir herramientas adicionales fuera del stack definido
* No usar caching que afecte tiempos de medición
* No cambiar orden de ejecución del pipeline

---

MÉTRICAS OBLIGATORIAS A CAPTURAR:

CI/CD:
* tiempo de instalación (npm ci)
* tiempo de build
* tiempo de docker build
* tiempo de despliegue en Kubernetes
* tiempo total del pipeline

CALIDAD:
* score de SonarQube
* code smells
* duplicación de código
* maintainability rating

RUNTIME:
* resultado del smoke test (success/fail)

---

RESTRICCIÓN EXPERIMENTAL CLAVE:

Este pipeline debe ejecutarse de forma independiente para cada microfrontend (host, mf-a, mf-b, mf-c).

Cada ejecución representa una unidad experimental única.

No se permite ejecutar múltiples microfrontends en un solo pipeline.

---

SALIDA ESPERADA:

* archivo YAML de GitHub Actions o GitLab CI
* variables de entorno explicadas
* puntos exactos de medición de tiempos
* comandos de despliegue Kubernetes
* comandos de verificación (kubectl)
* estructura reproducible del pipeline
* confirmación de consistencia entre escenarios

---

CONFIRMACIÓN FINAL:

El pipeline debe garantizar:

✔ ejecución reproducible  
✔ consistencia entre arquitecturas  
✔ medición objetiva de tiempos  
✔ análisis de calidad con SonarQube  
✔ despliegue controlado en Kubernetes  
✔ ausencia de optimizaciones específicas por framework  
✔ comparabilidad directa entre Module Federation y single-spa