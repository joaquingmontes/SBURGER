# StackBurger App

> Aplicación móvil de pedidos para delivery & takeaway — React Native  
> Proyecto Integrador · Desarrollo de Aplicaciones Móviles · 2026

---

## 📋 Descripción

**StackBurger** es una aplicación móvil que permite a los clientes explorar el menú de una hamburguesería, personalizar sus pedidos y confirmarlos sin necesidad de hacer fila en el local. Desarrollada con React Native para Android.

El proyecto se construye de forma incremental en **3 entregas**:

| Entrega | Alcance | Estado |
|---------|---------|--------|
| **E1 — MVP Básico** | Catálogo, carrito y confirmación de pedido | ✅ Entregado |
| E2 — Escalado funcional | Autenticación, historial y múltiples categorías | 🔜 Próximamente |
| E3 — Producto final | Multi-sucursal, rol administrador/cocina | 🔜 Próximamente |

---

## 🚀 Funcionalidades (E1)

- 📖 **Catálogo de productos** — listado visual con foto, nombre, descripción y precio
- ⚙️ **Personalización** — cantidad de medallones, extras y aclaraciones especiales
- 🛒 **Carrito** — agregar, modificar y eliminar ítems con total actualizado en tiempo real
- 📝 **Formulario de pedido** — datos del cliente con validación de campos obligatorios
- ✅ **Confirmación** — pantalla de éxito que simula el registro del pedido en el servidor

---

## 🛠️ Tecnologías

| Herramienta | Versión | Uso |
|-------------|---------|-----|
| React Native | 0.73+ | Framework principal |
| Node.js | 18+ | Entorno de ejecución |
| npm / yarn | — | Gestión de dependencias |
| Android SDK | API 24+ (Android 7.0) | Plataforma objetivo |

> **Gestión de estado:** Context API + useReducer  
> **Navegación:** React Navigation (Stack Navigator)

---

## ⚙️ Requisitos previos

Antes de clonar y correr el proyecto, asegurate de tener instalado:

- [Node.js 18+](https://nodejs.org/)
- [Android Studio](https://developer.android.com/studio) con SDK API 24+
- [JDK 17](https://adoptium.net/)
- Variables de entorno `ANDROID_HOME` y `JAVA_HOME` configuradas

Podés verificar tu entorno con:

```bash
npx react-native doctor
```

---

## 📦 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/stackburger-app.git
cd stackburger-app

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor Metro
npm start
```

---

## ▶️ Correr la app

### En emulador Android

```bash
# Con el emulador abierto desde Android Studio:
npm run android
```

### En dispositivo físico

1. Activar **Opciones de desarrollador** en el dispositivo
2. Habilitar **Depuración USB**
3. Conectar el dispositivo por cable USB
4. Ejecutar:

```bash
npm run android
```

---

## 📁 Estructura del proyecto

```
```

---

## 🌿 Ramas

| Rama | Descripción |
|------|-------------|
| `main` | Código estable |
| `entrega-1` | Tag de la Entrega 1 |
| `entrega-2` | *(próximamente)* |
| `entrega-3` | *(próximamente)* |

---

## 🔐 Variables de entorno

El proyecto no usa credenciales hardcodeadas. Copiá el archivo de ejemplo y completá los valores necesarios:

```bash
cp .env.example .env
```

> ⚠️ **Nunca subas el archivo `.env` al repositorio.**

---

## 👥 Integrantes

| Nombre | GitHub |
|--------|--------|
| _Joaquin Montes_ | [@joaquingmontes](https://github.com/joaquingmontes) |
| _Yamil Tundis_ | [@yamiltundis](https://github.com/yamiltundis) |
| _Leonel Piquet_ | [@LeonelPiquet](https://github.com/LeonelPiquet) |
| _Julian Figueira_ | [@JulianFigueira](https://github.com/JulianFigueira) |
| _Jeronimo Molina_ | [@usuario](https://github.com/usuario) |

---

## 🤖 Uso de IA

Este proyecto utiliza **Claude (Anthropic)** como asistente de desarrollo. Las conversaciones completas están documentadas en la carpeta `/ia/entrega-1/` según los requisitos de la cátedra.

---

## 📄 Documentación

| Archivo | Descripción |
|---------|-------------|
| `docs/alcance_e1.pdf` | Documento de alcance — RF, RNF, Reglas de negocio, User Stories |
| `docs/figma_e1.pdf` | Exportación de wireframes y mockups |
| `ia/entrega-1/` | Conversaciones con IA + índice de temas |

---

**Materia:** Desarrollo de Aplicaciones Móviles · 2026  
