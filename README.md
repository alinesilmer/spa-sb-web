# 📦 Instalación del proyecto con Vite, React 19 y React Router

Este proyecto utiliza **Vite** como herramienta de construcción, **React 19** como librería principal y **React Router DOM** para la gestión de rutas.

## 🚀 Requisitos previos

Asegúrate de tener instalado:

- - **Node.js** (versión 18.x o superior recomendada).
-
- - **npm** (se instala automáticamente con Node.js).
-

Puedes verificar las versiones ejecutando:

```
node -v
npm -v
```

## 📥 Instalación del proyecto

Clona este repositorio desde Git:

```
git clone https://github.com/tu-usuario/tu-proyecto.git
cd tu-proyecto
```

Luego instala las dependencias con npm:

```
npm install
```

Esto instalará automáticamente:

- - **Vite**
-
- - **React 19**
-
- - **React Router DOM**
-

## 🛠 Ejecución del proyecto

Para ejecutar el servidor de desarrollo:

```
npm run dev
```

La aplicación estará disponible por defecto en:

```
http://localhost:5173
```

## 📦 Compilar para producción

```
npm run build
```

Los archivos generados se ubicarán en la carpeta `dist/`.

## 🌐 Vista previa de producción

Puedes visualizar localmente la versión de producción ejecutando:

```
npm run preview
```

Por defecto, estará disponible en:

```
http://localhost:4173
```

# 📦 Creación del proyecto con Vite, React 19 y React Router 7.5

### 1. Crea la carpeta de tu proyecto

Escoge o crea la carpeta donde quieras guardar tu proyecto. Por ejemplo:

```
mkdir my-react-project
cd my-react-project
```

### 2. Crea un proyecto con Vite

Usa el comando oficial de npm create vite@latest. Vite te irá guiando para seleccionar las opciones. En general seleccionar:

- - **JavaScript**
    Luego
- - **React**

Al final, habrás generado la estructura básica de tu aplicación.

```
npm create vite@latest
```

### 3. Entra a la carpeta del proyecto y actualiza dependencias

Después de que Vite genere la carpeta, muévete dentro de ella:

```
cd my-react-project
```

#### 1) Instala las dependencias iniciales de Vite

Primero, instala todo lo que Vite generó (lo que venga en el package.json por defecto):

```
npm install
```

#### 1) Instala React Router mas reciente

```
npm install react-router-dom@latest
```

### 4. Ejecuta el servidor de desarrollo

Para arrancar la app y ver que todo funcione:

```
npm run dev
```
