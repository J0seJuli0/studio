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
  - **Server Actions (Next.js):** La comunicación entre el frontend y los flujos de Genkit se realiza de forma segura a través de Server Actions de Next.js, sin necesidad de construir una API REST tradicional.

## 4. Pasos para Ejecutar el Proyecto

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
