# RECETAS APP - CATÁLOGO Y GESTIÓN GASTRONÓMICA

Aplicación web full stack desarrollada para explorar, compartir y gestionar recetas tradicionales de la gastronomía ecuatoriana y del mundo. Permite visualizar detalles de preparación, tiempos, dificultad e ingredientes, además de interactuar mediante comentarios dinámicos.

## Demo en vivo

https://recetas-app-plum.vercel.app/ 

## Video de la Defensa

https://ister-my.sharepoint.com/:f:/g/personal/kelly_leyton_ister_edu_ec/IgCqzDP5oNQwTpHMsJQIkFP6AcQnrlN2UWf6Zlwd5utBszA?e=rjTQ5E 

## Capturas de pantalla

<img width="942" height="909" alt="image" src="https://github.com/user-attachments/assets/b11f4e2a-90d1-4d5a-bcfc-ed0eaed4387d" />

<img width="1885" height="3286" alt="image" src="https://github.com/user-attachments/assets/ee696768-b18c-4e1f-8a55-0ebef54cf714" /> 

<img width="1885" height="1349" alt="image" src="https://github.com/user-attachments/assets/166d83d1-2af6-4f8a-b8b0-ef9c16e6ee5c" />

## Stack tecnológico

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Vercel (deploy)
  
## Roles de usuario

- **Lector**: Navega por el catálogo público, utiliza filtros de búsqueda, consume recetas de la API externa, guarda favoritos y deja comentarios.
- **Chef**: Publica nuevas recetas mediante Server Actions, edita sus propias publicaciones y gestiona contenido desde su panel privado.

## Modelo de datos

- `auth.users`: Tabla interna de autenticación de Supabase.
- `profiles`: Extiende la información del usuario vinculando su rol (`lector` o `chef`).
- `recipes`: Almacena la información de las recetas y se relaciona mediante llave foránea (FK) con el usuario creador (relación uno-a-muchos).
- `comments`: Relaciona las valoraciones y comentarios de los usuarios con cada receta.

  ### Instalación local

```bash
git clone [https://github.com/leytonpayaroso-web/recetas-app.git](https://github.com/leytonpayaroso-web/recetas-app.git)
cd recetas-app
npm install
cp .env.example .env.local  # completar con tus claves de Supabase
npm run dev
```

### Credenciales de prueba

- Rol Chef: leytonpayaroso@gmail.com / Kelly2006
- Rol Lector: brimendoza14@gmail.com / Bri2011

## Funcionalidades

- Aplicación desplegada y funcional en Vercel.
- Sistema de roles implementado (2 roles).
- Autenticación real y protección de rutas con Middleware.
- Base de datos relacional en Supabase con tablas conectadas por FK y RLS.
- CRUD completo gestionado con Server Actions.
- Componentes interactivos de búsqueda con useState.
- Consumo de API externa (TheMealDB) con fetch y async/await.
- Historial de commits en GitHub y documentación completa

## Estructura

```text
recetas-app/
├── app/
│   ├── chef/
│   │   ├── editar/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── gestionar/
│   │   │   └── page.tsx
│   │   └── publicar/
│   │       └── page.tsx
│   ├── componentes/
│   ├── context/
│   ├── favoritos/
│   │   └── page.tsx
│   ├── login/
│   ├── recetas/
│   │   └── [id]/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── supabase.ts
├── middleware.ts
└── package.json
```