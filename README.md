# RazWeb - Portal de Noticias sobre Inteligencia Artificial & Tecnología

Guía para agentes de IA y reglas del proyecto: ver [AGENTS.md](AGENTS.md) y [.cursor/rules/](.cursor/rules/).

RazWeb es una plataforma web moderna, escalable y con arquitectura limpia (SOLID) desarrollada para la agregación, curaduría y visualización de noticias de vanguardia sobre Inteligencia Artificial y Computación Cuántica/Tecnología.

---

## Características Principales

- **Ingesta Multi-Fuente Automatizada**:
  - **Noticieros Tecnológicos Reconocidos**: Feeds RSS oficiales de TechCrunch AI, The Verge, Wired y MIT Technology Review.
  - **Papers Académicos de Investigación**: Extracción en tiempo real de arXiv API (categorías `cs.AI`, `cs.LG`, `cs.CL`).
  - **Cuentas Corporativas en X (Twitter)**: Adaptador especializado para OpenAI, Anthropic, Google DeepMind, Meta AI y Mistral AI.
- **Diseño & Experiencia de Usuario**:
  - Paleta con **Verde Agua (Teal)** como color de acento principal (atenuado en modo Claro para evitar fatiga visual; contrastado y moderno en modo Oscuro).
  - Selector dinámico de **Modo Claro / Modo Oscuro** con persistencia local.
  - **Fecha y Hora actual en vivo** sincronizada al segundo con formato legible.
  - **Card Grid** interactivo con badges distintivos por tipo de fuente y enlaces directos a las fuentes originales.
  - **Scroll Infinito** suave mediante `IntersectionObserver`.
  - Búsqueda en vivo y filtrado dinámico por categorías temáticas y tipo de fuente.
- **Autenticación y Favoritos**:
  - Sistema de autenticación con JWT seguro y almacenamiento en cookies HTTP-only.
  - Contraseñas cifradas con `bcryptjs` (salt rounds = 12).
  - Marcadores de noticias favoritas con sección dedicada para gestión de artículos guardados.
  - Panel de control de usuario logueado con estadísticas de lectura.
- **Seguridad**:
  - Sanitización estricta contra ataques XSS en contenidos externos mediante `sanitize-html`.
  - Rate Limiting en endpoints de autenticación para mitigar ataques de fuerza bruta y DDoS.
  - Cabeceras de seguridad HTTP configuradas (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `HSTS`, `Permissions-Policy`).
  - Validación de esquemas con `Zod` en todas las entradas de API.
- **Arquitectura SOLID**:
  - Capas desacopladas: Dominio (`NewsItemEntity`, `SourceType`), Aplicación (`NewsIngestionService`), e Infraestructura (`RssNewsProvider`, `ArxivPapersProvider`, `SocialXProvider`, `PrismaNewsRepository`).
  - Inversión de dependencias (DIP) y Principio Abierto/Cerrado (OCP) para añadir nuevos proveedores de noticias sin alterar el core.

---

## Inicialización Local en Windows (`C:\RAZ\razweb`)

Para correr RazWeb en tu máquina Windows en la carpeta solicitada `C:\RAZ\razweb`:

### Opción 1: Clonar desde el repositorio
1. Abre tu terminal de Windows (PowerShell o CMD) y crea el directorio:
   ```cmd
   mkdir C:\RAZ
   cd C:\RAZ
   ```
2. Clona el repositorio e ingresa a la carpeta:
   ```cmd
   git clone <URL_DE_TU_REPOSITORIO_GITHUB>/razweb.git
   cd razweb
   ```
3. Instala las dependencias:
   ```cmd
   npm install
   ```
4. Configura el archivo de entorno `.env` (incluido por defecto con SQLite):
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="razweb-super-secret-production-key-2026-teal-ai"
   ```
5. Sincroniza la base de datos SQLite y genera el cliente Prisma:
   ```cmd
   npx prisma db push
   npx prisma generate
   ```
6. Inicia el servidor de desarrollo:
   ```cmd
   npm run dev
   ```
7. Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en tiempo real.
- `npm run build`: Compila la aplicación para producción.
- `npm start`: Inicia el servidor de producción.
- `npm test`: Ejecuta la suite de pruebas unitarias y de integración con Vitest.
- `npm run lint`: Ejecuta el linter de ESLint.

---

## Estructura del Proyecto

```
razweb/
├── prisma/
│   └── schema.prisma           # Modelos User, NewsItem, Favorite
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # Login, Register, Me (JWT + Cookies)
│   │   │   ├── news/           # Feed paginado e ingesta de noticias
│   │   │   └── favorites/      # CRUD de noticias favoritas del usuario
│   │   ├── globals.css         # Tokens de tema Teal (Light / Dark)
│   │   ├── layout.tsx          # Providers de Tema y Autenticación
│   │   └── page.tsx            # Página principal
│   ├── domain/
│   │   ├── entities/           # Tipos de Dominio
│   │   └── interfaces/         # Contratos INewsProvider & INewsRepository
│   ├── infrastructure/
│   │   ├── providers/          # RSS, arXiv y X (Twitter) Providers
│   │   └── repositories/       # Repositorio Prisma SQLite
│   ├── lib/
│   │   ├── auth.ts             # Lógica JWT con jose y bcrypt
│   │   ├── prisma.ts           # Cliente singleton de Prisma
│   │   ├── rate-limit.ts       # Rate limiting en memoria
│   │   └── sanitize.ts         # Sanitización XSS
│   └── components/
│       ├── auth/               # Modales de Login/Registro y Dashboard
│       ├── layout/             # Header con Fecha/Hora en vivo
│       ├── news/               # Card Grid, NewsCard, FavoritesView
│       └── theme/              # ThemeProvider Claro/Oscuro
└── tests/                      # Pruebas con Vitest
```
