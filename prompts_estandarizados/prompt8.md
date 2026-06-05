{INCLUIR BLOQUE GLOBAL}

Genera la configuración Kubernetes para este componente de microfrontend.

---

PARÁMETROS:

* Orquestador: {Module Federation | single-spa}
* Namespace: {mf-experiment | single-spa-experiment}
* Componente: {host | mf-a | mf-b | mf-c}

---

OBJETIVO:

Desplegar el componente en un entorno Kubernetes local manteniendo consistencia, aislamiento y reproducibilidad entre todos los escenarios experimentales.

---

REQUISITOS:

Generar:

* deployment.yaml
* service.yaml

Utilizar:

* la imagen Docker previamente generada
* configuración consistente entre escenarios
* misma estructura Kubernetes para todos los componentes

---

CONFIGURACIÓN OBLIGATORIA:

Namespace:

* Todos los recursos deben desplegarse en el namespace indicado
* Incluir metadata.namespace en todos los manifiestos

Namespaces experimentales:

* Module Federation → mf-experiment
* single-spa → single-spa-experiment

Réplicas:

* replicas: 2

Puertos:

* Host → 4200
* MF-A → 4201
* MF-B → 4202
* MF-C → 4203

---

DEPLOYMENT:

* apiVersion: apps/v1
* kind: Deployment
* Estrategia RollingUpdate básica
* Reinicio automático habilitado
* imagePullPolicy consistente entre escenarios
* No usar autoscaling
* No usar ingress
* No usar service mesh
* No usar configuraciones cloud específicas
* No agregar sidecars
* Mantener labels equivalentes entre escenarios

Labels obligatorios:

labels:
  app: <nombre-componente>
  orchestrator: <module-federation | single-spa>
  experiment: microfrontend-study

---

SERVICE:

* kind: Service
* Tipo: NodePort o ClusterIP
  (usar el MISMO tipo en todos los escenarios)
* Exponer únicamente el puerto correspondiente
* Selector consistente con labels del deployment

---

RESTRICCIONES:

* No optimizar específicamente para ningún framework
* Mantener equivalencia estructural entre Module Federation y single-spa
* No modificar lógica de aplicaciones
* No introducir herramientas adicionales
* No alterar arquitectura experimental
* Mantener consistencia de configuración Kubernetes entre escenarios

---

VALIDACIÓN OBLIGATORIA:

Verificar que:

* los pods inicien correctamente
* los deployments alcancen estado Ready
* los servicios sean accesibles
* los microfrontends respondan correctamente
* no existan errores de red o comunicación
* las réplicas permanezcan estables
* los recursos estén desplegados en el namespace correcto

Comandos de validación:

* kubectl get pods -n <namespace>
* kubectl get svc -n <namespace>
* kubectl describe deployment <deployment> -n <namespace>

Si ocurre error:

* identificar causa
* reportar error
* NO modificar automáticamente la arquitectura
* NO introducir configuraciones no definidas experimentalmente

---

SALIDA ESPERADA:

* deployment.yaml completo
* service.yaml completo
* comandos kubectl apply
* comandos kubectl delete
* comandos kubectl get pods/services
* instrucciones de validación
* confirmación explícita de funcionamiento
* confirmación del namespace utilizado