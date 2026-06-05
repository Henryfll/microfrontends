# Evaluación de Herramientas y Estrategias para la Escalabilidad y Mantenimiento de Arquitecturas de Microfrontends

Repositorio de soporte para el artículo científico. Contiene el código base de los microfrontends, los prompts estandarizados utilizados durante el experimento y los resultados obtenidos.

---

## Estructura del repositorio

El repositorio está organizado en tres ramas principales:

| Rama | Contenido |
|---|---|
| `main` | Microfrontends base independientes, prompts estandarizados y resultados |
| `module-federation` | Integración de los microfrontends con Module Federation como orquestador |
| `single-spa` | Integración de los microfrontends con single-spa como orquestador |

### Estructura de carpetas (rama `main`)

```
microfrontends/
├── mf-a/                        # Microfrontend A — Angular
├── mf-b/                        # Microfrontend B — React
├── mf-c/                        # Microfrontend C — Vue
├── prompts_estandarizados/      # Prompts utilizados en el experimento
│   ├── bloque_global.md         # Bloque de entorno experimental (referencia global)
│   ├── contrato_funcional.md    # Contrato funcional de los microfrontends
│   ├── prompt1.md               # Generación del microfrontend base
│   ├── prompt2.md               # Verificación y estandarización
│   ├── prompt3.md               # Integración con Module Federation
│   ├── prompt4.md               # Integración con single-spa
│   ├── prompt5.md               # Generación del host (orquestador)
│   ├── prompt6.md               # Contenerización con Docker
│   ├── prompt7.md               # Pipeline CI/CD
│   └── prompt8.md               # Configuración Kubernetes
└── resultados/
    └── resultados_experimento.xlsx
```

---

## Tecnologías y versiones

Todas las versiones son fijas para garantizar reproducibilidad entre escenarios.

### Entorno de ejecución

| Herramienta | Versión |
|---|---|
| Node.js | 24.13.0 |
| npm | 11.6.2 |
| Webpack | 5.x |
| Docker | 29.4.0 |
| Kubernetes | v1.34.3 |

### Frameworks de microfrontends

| Microfrontend | Framework | Versión | TypeScript | Puerto |
|---|---|---|---|---|
| MF-A | Angular | 21.1.0 | ~5.9.2 | 4201 |
| MF-B | React | 19.2.0 | ~5.9.2 | 4202 |
| MF-C | Vue | 3.5.24 | ~5.8.3 | 4203 |
| Host | — | — | — | 4200 |

### Orquestadores evaluados

| Orquestador | Rama | Namespace Kubernetes |
|---|---|---|
| Module Federation | `module-federation` | `mf-experiment` |
| single-spa | `single-spa` | `single-spa-experiment` |

---

## Ejecución de los microfrontends base

Cada microfrontend es independiente y puede ejecutarse por separado.

```bash
# MF-A (Angular)
cd mf-a
npm install
npm start          # http://localhost:4201

# MF-B (React)
cd mf-b
npm install
npm start          # http://localhost:4202

# MF-C (Vue)
cd mf-c
npm install
npm start          # http://localhost:4203
```

---

## Prompts estandarizados

Los prompts son los instrumentos utilizados para generar y configurar los componentes del experimento mediante un asistente de inteligencia artificial. Están diseñados para ser reproducibles, comparables entre escenarios y libres de optimizaciones específicas por framework.

### Bloques de referencia

Antes de usar cualquier prompt numerado, es necesario comprender los dos bloques de referencia que se incluyen en los prompts:

**`bloque_global.md` — Entorno experimental**
Define las versiones exactas del entorno, las reglas de compatibilidad de TypeScript, la configuración de puertos y las restricciones generales del experimento. Este bloque se inserta al inicio de cada prompt que contiene la etiqueta `{INCLUIR BLOQUE GLOBAL}`.

**`contrato_funcional.md` — Contrato funcional**
Define la entidad de datos, las operaciones requeridas y las restricciones de implementación que deben cumplir todos los microfrontends por igual. Se inserta donde aparece `{INCLUIR CONTRATO FUNCIONAL}`.

La entidad base del contrato es:
```json
{
  "id": "number",
  "name": "string"
}
```

Con las operaciones: crear ítem, listar ítems ordenados por id, eliminar ítem por id y (opcional) editar ítem. Los datos se mantienen en memoria, sin backend ni librerías externas de UI o estado.

---

### Secuencia de ejecución (orden 1 → 8)

Los prompts se ejecutan en el orden indicado por su número. Cada prompt depende del resultado del anterior.

```
[prompt1] → [prompt2] → [prompt3] o [prompt4] → [prompt5] → [prompt6] → [prompt7 / prompt8]
```

---

#### Prompt 1 — Generación del microfrontend base

**Archivo:** `prompts_estandarizados/prompt1.md`

Genera la estructura inicial del microfrontend con el framework seleccionado. Incluye el bloque global y el contrato funcional.

**Parámetros a reemplazar:**

| Parámetro | Valores posibles |
|---|---|
| `{Angular 21.1.0 \| React 19.2.0 \| Vue 3.5.24}` | Elegir el framework correspondiente |
| `{MF-A \| MF-B \| MF-C}` | Nombre del microfrontend a generar |

**Salida esperada:** estructura del proyecto, código fuente principal, scripts de ejecución.

---

#### Prompt 2 — Verificación y estandarización

**Archivo:** `prompts_estandarizados/prompt2.md`

Verifica que el microfrontend generado cumpla exactamente con el contrato funcional y tenga complejidad equivalente a los demás. Corrige diferencias sin cambiar funcionalidad ni optimizar rendimiento.

**Parámetros a reemplazar:**

| Parámetro | Valores posibles |
|---|---|
| `{MF-A \| MF-B \| MF-C}` | Nombre del microfrontend a verificar |

**Salida esperada:** código corregido, lista de ajustes realizados.

---

#### Prompt 3 — Integración con Module Federation

**Archivo:** `prompts_estandarizados/prompt3.md`

Configura el microfrontend como módulo remoto compatible con Webpack 5 Module Federation. Aplica únicamente en la rama `module-federation`.

**Parámetros a reemplazar:**

| Parámetro | Valores posibles |
|---|---|
| `{MF-A \| MF-B \| MF-C}` | Nombre del microfrontend a integrar |

> Para Angular, el prompt incluye reglas estrictas de versiones exactas (`@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`: todos en `21.1.0`, sin `^` ni `~`).

**Salida esperada:** configuración webpack completa, código actualizado, ejemplo de integración en host.

---

#### Prompt 4 — Integración con single-spa

**Archivo:** `prompts_estandarizados/prompt4.md`

Adapta el microfrontend como aplicación registrable en single-spa, implementando las lifecycle functions `bootstrap`, `mount` y `unmount`. Aplica únicamente en la rama `single-spa`.

**Parámetros a reemplazar:**

| Parámetro | Valores posibles |
|---|---|
| `{MF-A \| MF-B \| MF-C}` | Nombre del microfrontend a integrar |

**Salida esperada:** configuración completa, código actualizado, registro en root-config de ejemplo.

---

#### Prompt 5 — Generación del host

**Archivo:** `prompts_estandarizados/prompt5.md`

Genera la aplicación host que integra MF-A, MF-B y MF-C. El comportamiento varía según el orquestador seleccionado.

**Parámetros a reemplazar:**

| Parámetro | Valores posibles |
|---|---|
| `{Module Federation \| Single-SPA}` | Orquestador a utilizar |

**Salida esperada:** código del host, configuración completa según orquestador, instrucciones de arranque (primero los microfrontends, luego el host).

---

#### Prompt 6 — Contenerización con Docker

**Archivo:** `prompts_estandarizados/prompt6.md`

Genera el `Dockerfile` para el componente indicado usando estrategia multi-stage build (`node:24-alpine` para build, `nginx:alpine` para runtime).

**Parámetros a reemplazar:**

| Parámetro | Valores posibles |
|---|---|
| `{MF-A \| MF-B \| MF-C \| HOST}` | Componente a contenerizar |

**Salida esperada:** Dockerfile completo, comandos `docker build` y `docker run`, mapeo de puertos.

---

#### Prompt 7 — Pipeline CI/CD

**Archivo:** `prompts_estandarizados/prompt7.md`

Genera el pipeline de integración y despliegue continuo. El flujo es fijo: checkout → instalación → análisis SonarQube → build → Docker → Kubernetes → smoke test.

**Parámetros a reemplazar:**

| Parámetro | Valores posibles |
|---|---|
| `{Module Federation \| single-spa}` | Orquestador del escenario |
| `{host \| mf-a \| mf-b \| mf-c}` | Rol del componente en el pipeline |
| `{mf-experiment \| single-spa-experiment}` | Namespace Kubernetes del escenario |
| `{4200 \| 4201 \| 4202 \| 4203}` | Puerto del componente |
| `{module-federation \| single-spa}` | Nombre de la rama en el repositorio |

> Cada componente (host, mf-a, mf-b, mf-c) debe tener su propio pipeline independiente. No se combinan componentes en un solo pipeline.

**Salida esperada:** archivo YAML (GitHub Actions o GitLab CI), puntos de medición de tiempos, comandos Kubernetes, estructura reproducible.

---

#### Prompt 8 — Configuración Kubernetes

**Archivo:** `prompts_estandarizados/prompt8.md`

Genera los manifiestos Kubernetes (`deployment.yaml` y `service.yaml`) para el componente indicado.

**Parámetros a reemplazar:**

| Parámetro | Valores posibles |
|---|---|
| `{Module Federation \| single-spa}` | Orquestador del escenario |
| `{mf-experiment \| single-spa-experiment}` | Namespace Kubernetes |
| `{host \| mf-a \| mf-b \| mf-c}` | Componente a desplegar |

**Configuración fija:** 2 réplicas, RollingUpdate, sin ingress, sin autoscaling, sin service mesh.

**Salida esperada:** `deployment.yaml`, `service.yaml`, comandos `kubectl apply/delete/get`.

---

### Cómo usar los prompts

1. Abrir el archivo del prompt correspondiente.
2. Reemplazar todos los parámetros entre llaves `{}` con los valores del escenario actual.
3. Insertar el contenido de `bloque_global.md` donde aparezca `{INCLUIR BLOQUE GLOBAL}`.
4. Insertar el contenido de `contrato_funcional.md` donde aparezca `{INCLUIR CONTRATO FUNCIONAL}`.
5. Enviar el prompt completo al asistente de IA.
6. Validar que la salida cumpla con la confirmación final indicada en cada prompt.
7. Continuar con el siguiente prompt en la secuencia.

> Los prompts incluyen reglas de validación obligatoria. Si el asistente reporta errores de compilación o incompatibilidad de versiones, el propio prompt define el procedimiento de corrección esperado.

---

## Resultados

Los datos recopilados durante el experimento se encuentran en:

```
resultados/resultados_experimento.xlsx
```

Incluye métricas de CI/CD (tiempos de instalación, build, Docker, despliegue), análisis de calidad SonarQube (code smells, duplicación, maintainability) y resultados de smoke tests por escenario y componente.

---

## Consideraciones experimentales

- Las mediciones se realizan en modo de compilación consistente (development o production) en todos los escenarios.
- No se utilizan optimizaciones específicas por framework.
- No se introducen librerías adicionales fuera del stack definido.
- La lógica funcional de los microfrontends no se modifica durante las fases de integración, contenerización ni despliegue.
- Cada escenario (Module Federation / single-spa) es autónomo y se ejecuta de forma independiente.
