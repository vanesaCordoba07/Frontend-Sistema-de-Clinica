
# 🏥 Frontend - Sistema de Gestión Médica

Este proyecto es el cliente web desarrollado en **Angular** para la administración de servicios de salud, citas médicas, historias clínicas y facturación. Se comunica con un backend construido en FastAPI, asegurando una integración fluida mediante contratos de datos estrictos.

## 📺 Video Demostrativo
Puedes ver el funcionamiento detallado del sistema en el siguiente enlace:
👉 https://canva.link/xdipwkct01i6vld
---
## 📺 Video Demostrativo: DESPLIEGUE EN FIREBASE Y EN RENDER CON FRONTEND Y BACKEND
👉 https://canva.link/uz3fvx03lx9odup
---

## 📁 Estructura del Proyecto
Basado en la arquitectura del directorio `src/app/`:

*   **`core/`**: Servicios globales, interceptores de seguridad y configuraciones del núcleo de la aplicación.
*   **`features/`**: Módulos de funcionalidad de negocio (Pacientes, Citas, Médicos, etc.).
*   **`models/`**: Definiciones de interfaces de TypeScript (`interfaces.ts`) alineadas con el backend.
*   **`shared/`**: Componentes y utilidades reutilizables en todo el sistema.

## 🏗️ Entidades de Datos (Models)
El sistema utiliza interfaces tipadas para garantizar la integridad de los datos en las operaciones CRUD:

### Gestión de Usuarios y Personal
*   **Usuarios**: Manejo de `UsuarioRead`, `UsuarioCreate` y `UsuarioUpdate` para control de acceso y roles.
*   **Médicos y Enfermeros**: Registro de personal de salud, especialidades, licencias y turnos (`MedicoRead`, `EnfermeroRead`).
*   **Especialidades**: Catálogo de áreas médicas disponibles.

### Operación Clínica y Administrativa
*   **Pacientes**: Datos demográficos y afiliación a EPS.
*   **Citas e Historias**: Flujo completo desde la reserva de la cita hasta el registro del diagnóstico y observaciones de enfermería (`CitaRead`, `HistorialRead`).
*   **Tratamientos y Servicios**: Detalle de medicación y catálogo de servicios con costos base.
*   **Facturación**: Gestión financiera de las citas, incluyendo métodos y estados de pago.

## 🚀 Tecnologías Principales
*   **Framework:** Angular (Standalone Components).
*   **Lenguaje:** TypeScript.
*   **Estilos:** SCSS.
*   **API:** FastAPI (Backend).

## 🛠️ Instalación y Desarrollo
1.  **Instalar dependencias:** `npm install`
2.  **Ejecutar localmente:** `ng serve`
3.  **Acceso:** `http://localhost:4200/`

---
*Nota: Este proyecto incluye trazabilidad de auditoría mediante campos de `id_usuario_creacion` e `id_usuario_edicion` en las entidades principales.*