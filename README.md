# OPTIMIZACIÓN DE LA GESTIÓN DE RUTAS DE ENTREGA, MEDIANTE LA EVALUACIÓN DINÁMICA DE TIEMPO Y TRÁFICO

## Integrantes (Grupo 6)

- **Aguirre Calderón, Cristhian** (25%)
- **Flores Padilla, Edison** (25%)
- **Meza Espinoza, Jeffersson** (25%)
- **Sanchez Cruzado, Jose Julio** (25%)

---

## 1. Descripción del Proyecto

Este proyecto aborda la problemática de la optimización de rutas de entrega en un entorno dinámico. La solución, llamada "Ruta Óptima", es una aplicación web interactiva que utiliza inteligencia artificial para calcular la secuencia de paradas más eficiente, minimizando el tiempo total de viaje al considerar variables en tiempo real como la congestión vehicular.

El objetivo principal es superar las limitaciones de los métodos de planificación estáticos, proporcionando una herramienta que se adapta a las condiciones cambiantes del tráfico y ofrece decisiones de ruteo más inteligentes y rentables.

## 2. Funcionalidades Principales

- **Punto de Partida por Geolocalización:** La aplicación utiliza la API de geolocalización del navegador para establecer la ubicación actual del usuario como el punto de inicio de la ruta.
- **Planificación Visual e Interactiva:** Los usuarios pueden añadir destinos (paradas de entrega) simplemente haciendo clic en un mapa interactivo de Google Maps. Cada parada es visualmente representada por un marcador y añadida a una lista editable.
- **Optimización Inteligente con IA:** El núcleo de la aplicación es un flujo de IA (implementado con Genkit y el modelo Gemini de Google) que recibe la lista de destinos, el punto de partida y las condiciones de tráfico seleccionadas para calcular la ruta más eficiente.
- **Selección Dinámica de Algoritmo:** La IA no utiliza una única estrategia. A través de una herramienta (`tool`), analiza el contexto (número de paradas, nivel de tráfico) y decide si aplicar un algoritmo **voraz** (para casos simples) o uno **heurístico** (para casos más complejos), optimizando tanto el resultado como el tiempo de cálculo.
- **Visualización Clara de la Ruta:** Una vez calculada, la ruta óptima se dibuja en el mapa mediante una línea poligonal, permitiendo al usuario visualizar el recorrido completo de manera clara.
- **Justificación en Lenguaje Natural:** Para proporcionar transparencia, la IA genera una explicación en español que justifica por qué eligió esa ruta y qué estrategia algorítmica utilizó.
- **Simulación de Cambio de Tráfico:** La aplicación permite simular cambios en las condiciones del tráfico, recalculando la ruta en tiempo real para demostrar su capacidad de adaptación dinámica.

## 3. ¿Cómo Funciona? (Arquitectura Técnica)

La aplicación está construida sobre un stack moderno de tecnologías web y de inteligencia artificial:

- **Frontend:**
  - **Next.js & React:** Para la construcción de la interfaz de usuario interactiva y de una sola página (SPA).
  - **ShadCN UI & Tailwind CSS:** Para un diseño de componentes moderno, responsivo y personalizable.
  - **@vis.gl/react-google-maps:** Para la integración y visualización del mapa interactivo y sus elementos (marcadores, polilíneas).

- **Backend y Lógica de IA:**
  - **Genkit (Google AI SDK):** Es el framework que orquesta toda la lógica de IA. Define los flujos (`flows`), las herramientas (`tools`) y los `prompts` que interactúan con el modelo de lenguaje.
  - **Google Gemini:** Es el modelo de IA que recibe las instrucciones (prompts) y los datos, y se encarga del razonamiento para decidir la estrategia algorítmica y generar la secuencia de ruta optimizada y su justificación.
  - **Enfoque Algorítmico Híbrido:** La IA actúa como una "directora de orquesta" que decide qué algoritmo usar:
    - **Algoritmo Voraz (Greedy):** Estrategia rápida que elige el vecino más cercano en cada paso. La IA lo selecciona para escenarios simples (poco tráfico, pocas paradas).
    - **Algoritmo Heurístico:** Enfoque más estratégico y complejo que busca una solución de mayor calidad. La IA lo prefiere para escenarios difíciles (tráfico pesado, muchas paradas).
  - **Server Actions (Next.js):** La comunicación entre el frontend y los flujos de Genkit se realiza de forma segura a través de Server Actions de Next.js, sin necesidad de construir una API REST tradicional.

## 4. La Solución Algorítmica

El problema de encontrar la ruta más corta que visita una serie de destinos es una variante del **Problema del Vendedor Viajero (TSP)**. Dado que resolver el TSP de manera exacta es computacionalmente muy costoso (NP-duro), se utilizan aproximaciones. Nuestra solución utiliza una IA para elegir entre dos de las estrategias más comunes.

### 4.1. Algoritmo Voraz (Heurística del Vecino más Cercano)

#### ¿Por qué esta técnica es adecuada?
Es una técnica excelente para obtener una solución **rápida y razonablemente buena**, especialmente cuando el número de destinos es bajo o las condiciones de tráfico son uniformes. Su baja complejidad computacional permite dar respuestas casi instantáneas, lo cual es ideal para una aplicación interactiva. La IA lo selecciona en escenarios simples donde la velocidad de respuesta es más valiosa que la perfección absoluta de la ruta.

#### Explicación conceptual
El algoritmo voraz o del "vecino más cercano" es una estrategia simple e intuitiva. Desde un punto de partida, el algoritmo identifica el destino no visitado más cercano (en términos de costo, que puede ser distancia o tiempo de viaje) y se desplaza hacia él. Este nuevo destino se convierte en el punto de partida para el siguiente paso, y el proceso se repite hasta que todos los destinos han sido visitados. Solo toma en cuenta la mejor opción inmediata, sin considerar cómo esa decisión podría afectar el costo total del recorrido futuro.

#### Ejecución paso a paso del algoritmo
1.  **Inicio:** Comenzar en el `Punto de Partida`.
2.  **Búsqueda:** Identificar el destino no visitado más cercano al punto actual. El "costo" para determinar la cercanía es una combinación de distancia y tiempo estimado según el tráfico.
3.  **Viaje:** Añadir ese destino a la ruta y marcarlo como visitado.
4.  **Actualización:** Establecer el destino recién visitado como el nuevo punto actual.
5.  **Repetición:** Si aún quedan destinos sin visitar, volver al Paso 2.
6.  **Fin:** Cuando todos los destinos han sido visitados, la secuencia de la ruta está completa.

#### Ilustración del proceso
Imaginemos 3 destinos (D1, D2, D3) y un Punto de Partida (P). El tráfico es ligero.

- **Paso 1:** Desde P, se calculan los costos para llegar a D1, D2 y D3.
  - P -> D1: 10 min
  - P -> D2: 15 min
  - **P -> D3: 8 min (el más bajo)**
- **Decisión 1:** La ruta comienza yendo a **D3**. Ruta actual: `P -> D3`.
- **Paso 2:** Desde D3, se calculan los costos a los destinos restantes (D1, D2).
  - **D3 -> D1: 5 min (el más bajo)**
  - D3 -> D2: 12 min
- **Decisión 2:** El siguiente destino es **D1**. Ruta actual: `P -> D3 -> D1`.
- **Paso 3:** Desde D1, solo queda D2.
- **Decisión 3:** La ruta final es **`P -> D3 -> D1 -> D2`**.

| Desde | Hacia | Costo (Tiempo) | Decisión |
| :--- | :--- | :--- | :--- |
| **P** | D1, D2, D3 | 8 min (a D3) | **Ir a D3** |
| **D3** | D1, D2 | 5 min (a D1) | **Ir a D1** |
| **D1** | D2 | (única opción) | **Ir a D2** |

### 4.2. Algoritmo Heurístico

#### ¿Por qué esta técnica es adecuada?
Cuando el problema se vuelve complejo (muchos destinos o tráfico pesado), el algoritmo voraz puede llevar a soluciones ineficientes. Por ejemplo, ir al destino más cercano podría alejarte demasiado de un grupo de destinos lejanos. Un enfoque heurístico es más adecuado porque considera una "visión más global" del problema. La IA lo selecciona para estos casos difíciles porque, aunque es computacionalmente más intenso, la probabilidad de encontrar una ruta significativamente mejor aumenta.

#### Explicación conceptual
A diferencia del algoritmo voraz, una heurística no se limita a la mejor opción inmediata. Puede implicar técnicas como:
- **Inserción más barata:** Empezar con una sub-ruta (ej. `P -> D1 -> P`) y luego, para cada destino restante, encontrar la posición en la ruta donde "insertarlo" cause el menor aumento de costo.
- **Optimización 2-Opt:** Empezar con una ruta completa (ej. la generada por el algoritmo voraz) y luego intercambiar sistemáticamente pares de aristas para ver si se puede reducir el costo total. Por ejemplo, si tienes `A -> B -> C -> D`, se prueba si `A -> C -> B -> D` es más corto.

La IA utiliza una combinación de estas lógicas para explorar soluciones que, aunque no garantizan la perfección, son estadísticamente superiores a las de un algoritmo voraz simple en escenarios complejos.

#### Ejecución paso a paso del algoritmo (ejemplo con 2-Opt)
1.  **Ruta Inicial:** Generar una ruta inicial, por ejemplo, con el algoritmo voraz o simplemente en el orden en que se añadieron los destinos. (Ej: `P -> D1 -> D2 -> D3 -> D4`).
2.  **Iteración:** Seleccionar dos aristas de la ruta que no compartan un nodo. Por ejemplo, `(D1, D2)` y `(D3, D4)`.
3.  **Evaluación:** Comparar el costo de las aristas actuales con el costo de las aristas "cruzadas".
    - Costo actual: `costo(D1, D2) + costo(D3, D4)`
    - Costo de intercambio: `costo(D1, D3) + costo(D2, D4)`
4.  **Decisión:** Si el costo de intercambio es menor, se realiza el intercambio, "descruzando" la ruta. La nueva ruta sería `P -> D1 -> D3 -> D2 -> D4`.
5.  **Repetición:** Repetir los pasos 2 a 4 con todas las combinaciones posibles de aristas hasta que no se puedan encontrar más mejoras.
6.  **Fin:** La ruta resultante es la solución heurística optimizada.

#### Ilustración del proceso
Imaginemos una ruta inicial que se cruza a sí misma: `P -> D1 -> D3 -> D2 -> D4`.



- **Paso 1 (Identificar cruce):** El algoritmo detecta que las aristas `(D1, D3)` y `(D2, D4)` se cruzan.
- **Paso 2 (Evaluar intercambio):**
  - Compara `costo(D1, D3) + costo(D2, D4)`
  - con `costo(D1, D2) + costo(D3, D4)`.
- **Paso 3 (Decidir):** Si el segundo costo es menor, se aplica el cambio.
- **Resultado:** La ruta se actualiza a `P -> D1 -> D2 -> D3 -> D4`, eliminando el cruce y reduciendo la distancia total. Este proceso se repite hasta que no queden más cruces que eliminar.

## 5. Pasos para Ejecutar el Proyecto

Para ejecutar este proyecto en un entorno de desarrollo local, se deben seguir los siguientes pasos:

### Prerrequisitos

- **Node.js** (versión 18 o superior).
- **npm** o un gestor de paquetes compatible.
- **Claves de API:**
  1.  **Google Maps Platform:** Se necesita una clave de API con los servicios `Maps JavaScript API` y `Directions API` habilitados.
  2.  **Google AI (Gemini):** Se necesita una clave de API para el modelo Gemini, que se puede obtener gratuitamente desde [Google AI Studio](https://aistudio.google.com/app/apikey).

### Instalación y Configuración

1.  **Clonar el Repositorio (o Descargar el ZIP):**
    Obtén el código fuente del proyecto.

2.  **Instalar Dependencias:**
    Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo llamado `.env.local` en la raíz del proyecto. Este archivo contendrá las claves de API. Añade el siguiente contenido, reemplazando los valores de ejemplo con tus claves reales:

    ```env
    # Clave de API de Google Maps
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSy...TU_CLAVE_DE_MAPS"

    # Clave de API de Gemini (Google AI)
    GEMINI_API_KEY="AIzaSy...TU_CLAVE_DE_GEMINI"
    ```

### Ejecución

1.  **Iniciar la Aplicación:**
    Con las dependencias instaladas y las variables de entorno configuradas, ejecuta el siguiente comando para iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```

2.  **Acceder a la Aplicación:**
    Abre tu navegador web y visita [http://localhost:3000](http://localhost:3000). La aplicación "Ruta Óptima" estará funcionando y lista para usarse.

## 6. Estructura del Proyecto

La estructura del proyecto sigue las convenciones de una aplicación moderna con Next.js y está organizada de la siguiente manera para separar responsabilidades:

```
/
├── src/
│   ├── app/                # Núcleo de la aplicación: páginas, layout principal (Next.js App Router).
│   ├── components/         # Componentes de React reutilizables.
│   │   ├── ui/             # Componentes base de la UI (botones, cards, etc.), generados por ShadCN.
│   │   ├── main-layout.tsx # Componente principal que estructura la interfaz.
│   │   ├── map-view.tsx    # Componente que renderiza el mapa de Google y sus elementos.
│   │   └── ...             # Otros componentes como RoutePlanner, RouteDetails, etc.
│   ├── ai/                 # Lógica de Inteligencia Artificial con Genkit.
│   │   └── flows/          # Define los flujos, prompts y herramientas para interactuar con la IA.
│   ├── lib/                # Funciones auxiliares, contexto global y definiciones de tipos.
│   │   ├── actions.ts      # Server Actions para comunicar el frontend con los flujos de IA.
│   │   └── context/        # Contexto de React para gestionar el estado global de la ruta.
│   └── hooks/              # Hooks de React personalizados (ej. use-toast).
├── .env.local              # Archivo para las variables de entorno (API Keys). No se sube al repositorio.
├── next.config.ts          # Archivo de configuración de Next.js.
└── package.json            # Dependencias del proyecto y scripts (dev, build, etc.).
```
