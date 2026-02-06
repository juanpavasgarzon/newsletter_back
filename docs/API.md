# API Documentation

Base URL: `/{apiPrefix}` (por defecto `/api`, configurable con `API_PREFIX`).

## Autenticación

Las rutas protegidas requieren header:

```
Authorization: Bearer <token>
```

El token se obtiene con `POST /api/auth/login` enviando el secreto de admin.

---

## Auth

### POST /auth/login

Obtiene un JWT para las rutas protegidas.

**Público.** No requiere autenticación.

**Body (JSON):**

| Campo  | Tipo   | Requerido | Descripción      |
| ------ | ------ | --------- | ---------------- |
| secret | string | sí        | Secreto de admin |

**Respuesta 200:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2026-02-12T16:00:00.000Z"
}
```

---

## Articles

Prefijo: `/articles`. Todas las rutas del recurso pasan por `JwtAuthGuard`; las marcadas como **Público** no requieren token.

### GET /articles

Lista artículos con paginación por cursor.

**Público.**

**Query:**

| Parámetro | Tipo   | Requerido | Descripción                                  |
| --------- | ------ | --------- | -------------------------------------------- |
| lang      | string | sí        | `es` \| `en`                                 |
| cursor    | string | no        | Cursor para la siguiente página              |
| limit     | number | no        | Cantidad por página (1–100). Por defecto: 10 |
| q         | string | no        | Búsqueda en title, excerpt, content, tags    |

**Respuesta 200:**

```json
{
  "items": [
    {
      "id": "uuid",
      "groupId": "uuid",
      "slug": "mi-articulo",
      "author": "Autor",
      "publishedAt": "2026-02-01T12:00:00.000Z",
      "updatedAt": "2026-02-01T12:00:00.000Z",
      "tags": ["tag1"],
      "lang": "es",
      "title": "Título",
      "excerpt": "Resumen",
      "content": "Contenido"
    }
  ],
  "nextCursor": "base64..."
}
```

### GET /articles/groups

Lista grupos de artículos con los idiomas disponibles (`support`), título, resumen y fecha de publicación promedio. Incluye búsqueda y paginación por cursor.

**Requiere autenticación.**

**Query:**

| Parámetro | Tipo   | Requerido | Descripción                                  |
| --------- | ------ | --------- | -------------------------------------------- |
| cursor    | string | no        | Cursor para la siguiente página              |
| limit     | number | no        | Cantidad por página (1–100). Por defecto: 10 |
| q         | string | no        | Búsqueda en title, excerpt, content, tags    |

**Respuesta 200:**

```json
{
  "items": [
    {
      "groupId": "uuid",
      "support": ["en", "es"],
      "title": "Título (del artículo más reciente del grupo)",
      "excerpt": "Resumen",
      "publishedAt": "2026-02-01T12:00:00.000Z"
    }
  ],
  "nextCursor": "base64..."
}
```

Cada item tiene:

- **groupId**: UUID del grupo.
- **support**: Lista de idiomas disponibles en ese grupo (`en`, `es` o ambos).
- **title** / **excerpt**: Del artículo más reciente del grupo.
- **publishedAt**: Fecha promedio de publicación de todos los artículos del grupo (ISO 8601).

### GET /articles/by-group

Lista artículos con **un resultado por `groupId`** en el idioma indicado (paginación por cursor). Devuelve un artículo por cada grupo en el `lang` solicitado (ej.: `lang=es` → solo artículos en español, uno por grupo).

**Público.**

**Query:**

| Parámetro | Tipo   | Requerido | Descripción                                  |
| --------- | ------ | --------- | -------------------------------------------- |
| lang      | string | sí        | `es` \| `en`                                 |
| cursor    | string | no        | Cursor para la siguiente página              |
| limit     | number | no        | Cantidad por página (1–100). Por defecto: 10 |

**Respuesta 200:**

```json
{
  "items": [
    {
      "id": "uuid",
      "groupId": "uuid",
      "slug": "mi-articulo",
      "author": "Autor",
      "publishedAt": "2026-02-01T12:00:00.000Z",
      "updatedAt": "2026-02-01T12:00:00.000Z",
      "tags": ["tag1"],
      "lang": "es",
      "title": "Título",
      "excerpt": "Resumen",
      "content": "Contenido"
    }
  ],
  "nextCursor": "base64..."
}
```

### GET /articles/by-group/:groupId

Obtiene **un único artículo** por `groupId` e idioma. La combinación `(groupId, lang)` es única. Es el endpoint recomendado para mostrar un artículo en la URL: permite cambiar de idioma manteniendo el mismo `groupId` (ej. enlaces en emails usan esta forma).

**Público.**

**Params:** `groupId` (UUID del grupo).

**Query:**

| Parámetro | Tipo   | Requerido | Descripción  |
| --------- | ------ | --------- | ------------ |
| lang      | string | sí        | `es` \| `en` |

**Respuesta 200:** Un solo objeto `ArticleResponse`. Si no existe artículo para ese grupo e idioma: 404.

### GET /articles/:id

Obtiene un artículo por ID interno. Opcional; para URLs públicas y cambio de idioma se recomienda usar `GET /articles/by-group/:groupId?lang=...`.

**Público.**

**Params:** `id` (UUID del artículo).

**Respuesta 200:** Objeto `ArticleResponse`.

### POST /articles

Crea un artículo. Tras crearlo se notifica por email a los suscriptores.

**Requiere autenticación.**

**Body (JSON):**

| Campo   | Tipo     | Requerido | Descripción                                                                                                         |
| ------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| lang    | string   | sí        | `es` \| `en`                                                                                                        |
| groupId | string   | no        | UUID del grupo. Si se envía, debe existir (algún artículo con ese grupo). No se permite duplicar `(groupId, lang)`. |
| slug    | string   | no        | Slug único por idioma (máx. 500). Si no se envía se genera desde `title`                                            |
| author  | string   | sí        | Autor                                                                                                               |
| tags    | string[] | no        | Etiquetas                                                                                                           |
| title   | string   | sí        | Título                                                                                                              |
| excerpt | string   | sí        | Resumen                                                                                                             |
| content | string   | sí        | Contenido                                                                                                           |

**Respuesta 201:** Objeto `ArticleResponse` del artículo creado.

### PATCH /articles/:id

Actualiza un artículo.

**Requiere autenticación.**

**Params:** `id` (UUID del artículo).

**Body (JSON):** todos los campos opcionales.

| Campo     | Tipo     | Descripción |
| --------- | -------- | ----------- |
| slug      | string   | Máx. 500    |
| author    | string   |             |
| tags      | string[] |             |
| title     | string   |             |
| excerpt   | string   |             |
| content   | string   |             |
| updatedAt | string   | Fecha ISO   |

**Respuesta 200:** Objeto `ArticleResponse` actualizado.

### DELETE /articles/:id

Elimina un artículo por ID.

**Requiere autenticación.**

**Params:** `id` (UUID).

**Respuesta:** 204 No Content.

### DELETE /articles/group/:groupId

Elimina todos los artículos del grupo (es y en).

**Requiere autenticación.**

**Params:** `groupId` (UUID).

**Respuesta:** 204 No Content.

---

## Subscribe

Prefijo: `/subscribe`. El controlador usa `JwtAuthGuard`; solo la suscripción es pública.

### POST /subscribe

Suscribe un email a la newsletter y envía email de bienvenida.

**Público.**

**Body (JSON):**

| Campo | Tipo   | Requerido | Descripción                 |
| ----- | ------ | --------- | --------------------------- |
| email | string | sí        | Email válido                |
| lang  | string | no        | `es` \| `en`. Default: `es` |

**Respuesta 201:**

```json
{
  "ok": true,
  "message": "Te has suscrito correctamente"
}
```

Si el email ya está suscrito: **409 Conflict**.

### GET /subscribe

Lista suscriptores con paginación por cursor.

**Requiere autenticación.**

**Query:**

| Parámetro | Tipo   | Requerido | Descripción                                  |
| --------- | ------ | --------- | -------------------------------------------- |
| cursor    | string | no        | Cursor para la siguiente página              |
| limit     | number | no        | Cantidad por página (1–100). Por defecto: 20 |

**Respuesta 200:**

```json
{
  "items": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "lang": "es",
      "createdAt": "2026-02-01T12:00:00.000Z"
    }
  ],
  "nextCursor": "base64..."
}
```

### GET /subscribe/count

Devuelve el número de suscriptores de la newsletter.

**Requiere autenticación.**

**Respuesta 200:**

```json
{
  "count": 42
}
```

### GET /subscribe/emails

Lista los emails de todos los suscriptores (solo admin).

**Requiere autenticación.**

**Respuesta 200:**

```json
{
  "emails": ["email1@example.com", "email2@example.com"]
}
```

---

## Config

Prefijo: `/config`. Todas las rutas son públicas. Los JSON de configuración se leen desde el directorio definido en `CONFIG_DIR`.

### GET /config/basic-info

Información básica del sitio (nombre, rol, redes, ciudad, país, año, contador de suscriptores).

**Query:** `lang` (opcional): `es` \| `en`. Si no se envía o no existe, se usa `es`.

**Respuesta 200:**

```json
{
  "name": "Nombre",
  "role": "Rol",
  "startYear": 2020,
  "github": "https://github.com/...",
  "linkedin": "https://linkedin.com/...",
  "country": "País",
  "city": "Ciudad",
  "subscriberCount": 42
}
```

### GET /config/logo

Devuelve la URL del logo (configuración única, sin idioma).

**Respuesta 200:**

```json
{
  "logoUrl": "https://..."
}
```

### GET /config/about

Secciones “about” (título, subtítulo, bloques).

**Query:** `lang` (opcional): `es` \| `en`.

**Respuesta 200:**

```json
{
  "title": "Título",
  "subtitle": "Subtítulo",
  "sections": [
    {
      "title": "Sección",
      "content": "Contenido"
    }
  ]
}
```

---

## Errores

Las respuestas de error siguen este formato:

```json
{
  "message": "Descripción del error",
  "statusCode": 400,
  "timestamp": "2026-02-05T16:00:00.000Z"
}
```

Códigos habituales: `400` Bad Request (validación), `401` Unauthorized (token inválido o ausente), `404` Not Found, `409` Conflict (ej. email ya suscrito).
