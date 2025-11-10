# Prueba Técnica - Find Movies

## Entregable 1: Tabla de Problemas Identificados

| ID      | Descripción del Problema                                                | Ubicación en el Código                                | Categoría                         | Impacto / Riesgo de Negocio                                                                 | Solución Propuesta (Resumen)                                                                                   | Severidad |
|---------|------------------------------------------------------------------------|-------------------------------------------------------|----------------------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|-----------|
| DT-001  | Clave de API expuesta directamente en el frontend.                     | src/app/core/services/the-movies.service.ts          | Seguridad                        | Riesgo de filtración y uso indebido del API Key.                                           | Gestionar la clave a través de variables de entorno y un servicio de configuración del lado del servidor        | 🔴 Crítica |
| DT-002  | Problema de rendimiento tipo N+1 queries al cargar datos de películas. | the-movies.service.ts, HomeComponent                 | Rendimiento                       | Exceso de llamadas a la API, latencia alta y uso innecesario de red, afecta la experiencia del usuario. | Implementar batch requests o caching, reducir llamadas redundantes.                                           | 🔴 Crítica |
| DT-003  | Gestión de estado ausente o dispersa (uso de localStorage y variables locales). | src/app/pages/home/home.component.ts                 | Mantenibilidad / Arquitectura     | Dificulta la depuración y escalabilidad, el estado no es reactivo ni compartido.           | Introducir un store centralizado para el manejo del estado global.                                              | 🟠 Alta |
| DT-004  | Ausencia de manejo estructurado de errores en servicios y componentes. | Varios servicios y componentes (the-movies.service.ts, HomeComponent) | Confiabilidad / UX                | Errores no capturados adecuadamente, usuario no recibe respuesta clara.                     | Crear un interceptor HTTP y un servicio global de manejo de errores.                                            | 🟠 Alta |
| DT-005  | Falta de validaciones y tipado fuerte en respuestas de API.            | the-movies.service.ts                                | Calidad de Código                 | Riesgo de errores en tiempo de ejecución y baja robustez.                                   | Definir interfaces TypeScript para las respuestas de API                                                       | 🟡 Media |
| DT-006  | Falta de herramientas de calidad de código (ESLint, Prettier).         | Raíz del proyecto                                    | Productividad / Gobernanza        | Código inconsistente y sin control de estilo; reduce legibilidad y aumenta deuda.           | Configurar ESLint + Prettier.                                                                                | 🟡 Media |
| DT-007  | Lógica de negocio mezclada en componentes de presentación.            | HomeComponent, DetailsMovieComponent                 | Arquitectura / Mantenibilidad     | Dificulta el testing y el reuso, acoplamiento alto entre UI y lógica.                       | Extraer lógica a servicios y stores, aplicar principios SOLID y separación de responsabilidades.              | 🟠 Alta |
| DT-008  | Falta de pruebas unitarias e integración.                               | General                                              | Calidad / Riesgo Operativo        | Poca confianza en los cambios.                                                              | Añadir pruebas unitarias                                                                                       | 🟡 Media |
| DT-009  | No hay configuración para variables de entorno seguras.                 | angular.json, environments/*                         | Seguridad / Configuración         | Configuración sensible embebida en el código, exposición en builds.                         | Crear archivos .env para cada entorno; usar process.env o Angular Environment Variables con inyección desde el pipeline. | 🟠 Alta |

---

## Entregable 2: Documento PDF

El documento con diagramas y documentación adicional se encuentra disponible [aquí](https://drive.google.com/file/d/1VzlZlBF55VdBu1AbDteVQgJcrPotPBTa/view?usp=sharing).

---

## Entregable 3: Pasos para Inicializar el Proyecto

1. **Instalar dependencias**  
```bash
npm install
```

2. **Iniciar el BFF (Backend for Frontend)**  
```bash
npm run start:bff
```

3. **Iniciar el proyecto Angular (frontend)**  
```bash
npm start
```

4. **Correr los tests**  
```bash
npm test
```

5. **Correr ESLint y Prettier**  
```bash
npm run lint
npm run lint:fix
npm run format

```