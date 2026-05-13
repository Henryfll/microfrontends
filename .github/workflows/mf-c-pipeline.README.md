# Pipeline CI/CD - MF-C (Module Federation)

Pipeline experimental reproducible para el microfrontend **MF-C** (Vue 3.5.24).
Archivo: [`.github/workflows/mf-c-pipeline.yml`](mf-c-pipeline.yml).

> Este pipeline construye, despliega y valida **únicamente** MF-C.
> Host, MF-A y MF-B tienen sus propios workflows equivalentes.

---

## 1. Parámetros del experimento

| Parámetro          | Valor                       |
| ------------------ | --------------------------- |
| Orquestador        | Module Federation           |
| Componente         | mf-c                        |
| Namespace K8s      | `mf-experiment`             |
| Puerto             | `4203`                      |
| Imagen Docker      | `mf-c-mf:latest`            |
| Node.js            | `24.13.0` (fija)            |
| npm                | `11.6.2`                    |
| Vue                | `3.5.24`                    |
| TypeScript         | `~5.8.3` (compatible vue-tsc 2.x) |
| Webpack            | `5.x`                       |

---

## 2. Variables de entorno (`env:`)

Todas se definen al inicio del workflow para facilitar trazabilidad.

| Variable           | Propósito                                                             |
| ------------------ | --------------------------------------------------------------------- |
| `NODE_VERSION`     | Versión fija de Node usada por `actions/setup-node`.                  |
| `NPM_VERSION`      | Versión esperada de npm (validada en `Verify toolchain versions`).    |
| `COMPONENT_NAME`   | Identificador del microfrontend (`mf-c`).                             |
| `COMPONENT_ROLE`   | Rol del componente dentro de Module Federation (`mf-c`).              |
| `ORCHESTRATOR`     | `module-federation`. Se mantiene igual al variar a `single-spa`.      |
| `K8S_NAMESPACE`    | Namespace destino (`mf-experiment`).                                  |
| `K8S_DEPLOYMENT`   | Nombre del Deployment a esperar (`mf-c`).                             |
| `K8S_SERVICE`      | Nombre del Service expuesto (`mf-c`).                                 |
| `APP_PORT`         | Puerto asignado al microfrontend (`4203`).                            |
| `SMOKE_URL`        | URL del smoke test (`http://localhost:4203`).                         |
| `DOCKER_IMAGE`     | Nombre de imagen (`mf-c-mf`).                                         |
| `DOCKER_TAG`       | Tag de imagen (`latest`).                                             |
| `COMPONENT_DIR`    | Directorio del microfrontend en el monorepo (`mf-c`).                 |
| `K8S_DIR`          | Directorio de manifiestos K8s (`mf-c/k8s`).                           |
| `METRICS_FILE`     | Salida JSON con las métricas del experimento.                         |

---

## 3. Secuencia fija del pipeline

| #  | Paso                              | Step en el workflow            | Métrica          |
| -- | --------------------------------- | ------------------------------ | ---------------- |
| 0  | Init pipeline timer               | `Init pipeline timer`          | `t_total` start  |
| 1  | Checkout                          | `Checkout repository`          | -                |
| 2  | Setup Node.js fijo                | `Setup Node.js`                | -                |
| 3  | `npm ci`                          | `npm ci (install)`             | `t_install`      |
| 4  | Build app (`npm run build`)       | `Build application`            | `t_build`        |
| 5  | Docker build                      | `Docker build`                 | `t_docker_build` |
| 6  | `kubectl apply` manifiestos       | `Apply manifests & wait ...`   | `t_deploy` start |
| 7  | `kubectl rollout status`          | `Apply manifests & wait ...`   | `t_deploy` end   |
| 8  | Smoke test HTTP `localhost:4203`  | `Smoke test (HTTP)`            | `smoke_result`   |
| Z  | Cierre + dump JSON métricas       | `Compute total ... metrics`    | `t_total`        |

> Idéntica para `host`, `mf-a`, `mf-b`, `mf-c` y para la variante single-spa.
> No se permite saltarse pasos ni reordenarlos.

---

## 4. Puntos donde se capturan métricas

Cada paso medido envuelve la operación entre dos `date +%s%N` (nanosegundos)
y emite el delta en segundos por `GITHUB_OUTPUT`. Al final, el step
`Compute total pipeline time & emit metrics` consolida todo en
`metrics-mf-c.json`:

```json
{
  "component":     "mf-c",
  "orchestrator":  "module-federation",
  "namespace":     "mf-experiment",
  "image":         "mf-c-mf:latest",
  "node_version":  "24.13.0",
  "started_at":    "2026-05-12T12:00:00Z",
  "metrics_seconds": {
    "install":      12.345,
    "build":        34.567,
    "docker_build": 56.789,
    "deploy":        8.901,
    "total":       125.678
  },
  "smoke_test": {
    "url":       "http://localhost:4203",
    "http_code": "200",
    "result":    "success"
  }
}
```

El archivo se publica como artefacto `metrics-mf-c-<run_id>` (retención 30 días)
para alimentar las tablas comparativas de la tesis.

---

## 5. Comandos equivalentes de ejecución manual

Reproducción local **idéntica** al pipeline (Linux/macOS o Git-Bash en Windows).
Cada bloque mide el tiempo de su paso para igualar las métricas del runner.

```bash
# Variables (espejo del workflow)
export NODE_VERSION=24.13.0
export COMPONENT_DIR=mf-c
export K8S_DIR=mf-c/k8s
export K8S_NAMESPACE=mf-experiment
export K8S_DEPLOYMENT=mf-c
export K8S_SERVICE=mf-c
export DOCKER_IMAGE=mf-c-mf
export DOCKER_TAG=latest
export APP_PORT=4203
export SMOKE_URL="http://localhost:${APP_PORT}"

# 0. Inicio total
t_pipeline_start=$(date +%s%N)

# 1. Checkout (asumido: ya estás en el repo)
git rev-parse --is-inside-work-tree

# 2. Node fijo (usar nvm/volta/asdf segun el host)
node --version   # debe imprimir v24.13.0
npm  --version   # debe imprimir 11.6.2

# 3. npm ci  (METRICA: t_install)
cd "$COMPONENT_DIR"
t0=$(date +%s%N); npm ci --no-audit --no-fund; t1=$(date +%s%N)
echo "t_install_s = $(awk "BEGIN{printf \"%.3f\", ($t1-$t0)/1e9}")"

# 4. Build  (METRICA: t_build)
t0=$(date +%s%N); npm run build; t1=$(date +%s%N)
echo "t_build_s = $(awk "BEGIN{printf \"%.3f\", ($t1-$t0)/1e9}")"

# 5. Docker build  (METRICA: t_docker_build)
t0=$(date +%s%N)
docker build --no-cache --pull=false -t "${DOCKER_IMAGE}:${DOCKER_TAG}" .
t1=$(date +%s%N)
echo "t_docker_s = $(awk "BEGIN{printf \"%.3f\", ($t1-$t0)/1e9}")"
cd ..

# 6 + 7. Apply + rollout  (METRICA: t_deploy)
kubectl get ns "$K8S_NAMESPACE" >/dev/null 2>&1 || kubectl create ns "$K8S_NAMESPACE"
t0=$(date +%s%N)
kubectl apply -n "$K8S_NAMESPACE" -f "$K8S_DIR/deployment.yaml"
kubectl apply -n "$K8S_NAMESPACE" -f "$K8S_DIR/service.yaml"
kubectl rollout restart "deployment/$K8S_DEPLOYMENT" -n "$K8S_NAMESPACE"
kubectl rollout status  "deployment/$K8S_DEPLOYMENT" -n "$K8S_NAMESPACE" --timeout=300s
t1=$(date +%s%N)
echo "t_deploy_s = $(awk "BEGIN{printf \"%.3f\", ($t1-$t0)/1e9}")"

# 8. Smoke test (port-forward al puerto asignado)
kubectl port-forward -n "$K8S_NAMESPACE" "svc/$K8S_SERVICE" "${APP_PORT}:${APP_PORT}" \
  > pf-mf-c.log 2>&1 &
PF_PID=$!
for i in 1 2 3 4 5 6 7 8 9 10; do
  sleep 1
  curl -fsS -o /dev/null "$SMOKE_URL" && break
done

http_code=$(curl -s -o /dev/null -w "%{http_code}" "$SMOKE_URL")
[ "$http_code" = "200" ] && smoke_result=success || smoke_result=fail
echo "smoke_result=$smoke_result http_code=$http_code"

kill "$PF_PID" 2>/dev/null || true

# Z. Total
t_pipeline_end=$(date +%s%N)
echo "t_total_s = $(awk "BEGIN{printf \"%.3f\", ($t_pipeline_end-$t_pipeline_start)/1e9}")"
```

> En PowerShell, sustituir `date +%s%N` por `[DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()`
> y ajustar la división correspondiente. El resto de comandos (`npm`, `docker`, `kubectl`, `curl`)
> es idéntico.

---

## 6. Requisitos del runner

El workflow declara `runs-on: [self-hosted, linux, k8s-local]`. El runner debe:

- Tener Node `24.13.0` disponible (lo provee `actions/setup-node`).
- Tener Docker `29.4.0` con permisos para `docker build`.
- Tener `kubectl` apuntando al cluster local Kubernetes `v1.34.3` (kind/minikube/k3d).
- Poder leer la imagen `mf-c-mf:latest` desde el daemon local
  (la imagen se construye en el mismo runner, por eso `imagePullPolicy: IfNotPresent`).
- Tener libre el puerto `4203` durante el `port-forward` del smoke test.

---

## 7. Cumplimiento de reglas experimentales

| Regla                                                          | Cumplimiento                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| No modificar lógica del microfrontend                          | El pipeline solo ejecuta `npm ci`, `npm run build`, `docker build`, K8s.  |
| No optimizar el build para frameworks específicos              | Se invoca `webpack --mode production` vía `npm run build`, sin flags extra. |
| Pipeline idéntico entre Module Federation y single-spa         | La secuencia y el JSON de métricas son los mismos; solo cambian env vars. |
| No introducir herramientas adicionales fuera del stack         | Solo `node`, `npm`, `docker`, `kubectl`, `curl`, `awk`.                   |
| No usar estrategias cloud-managed                              | Runner self-hosted + cluster local.                                       |
| No usar caching agresivo                                       | `actions/setup-node` sin `cache:`; `docker build --no-cache --pull=false`. |
| Smoke test sin autocorrección                                  | Si falla, `exit 1` detiene el pipeline; no hay reintentos.                |
| Validar estado Ready antes de continuar                        | `kubectl rollout status ... --timeout=300s` antes del smoke.              |
| Service expuesto en el puerto asignado                         | `port-forward svc/mf-c 4203:4203` -> `http://localhost:4203`.             |
| Una corrida = un microfrontend                                 | El workflow solo opera sobre `mf-c/`.                                     |

---

## 8. Disparadores

- **Manual**: `workflow_dispatch` (para corridas controladas del experimento).
- **Push**: solo cuando cambian `mf-c/**` o el propio workflow, en la rama
  `module-federation`. Esto evita corridas cruzadas con otros microfrontends.

---

## 9. Cómo replicar para otros componentes

Duplicar este archivo y ajustar **únicamente** las variables `env:`
(ver tabla §1):

| Componente | Puerto | `K8S_DEPLOYMENT` / `K8S_SERVICE` | `DOCKER_IMAGE`     |
| ---------- | ------ | -------------------------------- | ------------------ |
| host       | 4200   | `host`                           | `host-mf`          |
| mf-a       | 4201   | `mf-a`                           | `mf-a-mf`          |
| mf-b       | 4202   | `mf-b`                           | `mf-b-mf`          |
| mf-c       | 4203   | `mf-c`                           | `mf-c-mf`          |

La estructura del pipeline y los puntos de medición permanecen idénticos.
