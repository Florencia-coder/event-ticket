# QRSystem

## Despliegue separado: Backend + Frontend

Este repositorio contiene:
- `backend/`: API Express + PostgreSQL
- `frontend/`: aplicación React con Vite

## Archivos de configuración creados

- `backend/.env.example`
- `frontend/.env.example`
- `backend/Procfile`
- `frontend/netlify.toml`
- `frontend/vercel.json`

---

## 1) Backend

### Variables de entorno

Copia `backend/.env.example` a `backend/.env` y completa valores reales.

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `PORT` (opcional, default 3001)

> Para Gmail con doble autenticación usa una contraseña de aplicación en `EMAIL_PASSWORD`.

### Localmente

```bash
cd backend
npm install
npm start
```

### Deploy recomendado / Railway o Render

- Crea un nuevo proyecto en Railway o Render.
- Conecta tu repositorio `QRSystem`.
- Usa la carpeta `backend/` como raíz del servicio.
- Comando de build: (no aplica, solo corre Node)
- Comando de start: `npm start`
- Puerto: `3001`
- Define las mismas variables de entorno que en `backend/.env.example`.
- Conecta una base de datos PostgreSQL en el mismo servicio.

### Deploy rápido / Heroku

1. En Heroku agrega el repositorio.
2. En `Settings > Config Vars` define las variables del backend.
3. Usa `web: npm start` desde `backend/Procfile`.
4. Configura la base de datos PostgreSQL desde el add-on.

---

## 2) Frontend

### Variables de entorno

Copia `frontend/.env.example` a `frontend/.env`.

- `VITE_API_BASE_URL` debe apuntar a la URL del backend desplegado.

### Localmente

```bash
cd frontend
npm install
npm run build
```

### Deploy en Netlify

1. Agrega el sitio en Netlify.
2. Conecta el repositorio y selecciona la carpeta `frontend/`.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Agrega variable de entorno:
   - `VITE_API_BASE_URL=https://tu-backend-url`

Netlify usa `frontend/netlify.toml` para esta configuración.

### Deploy en Vercel

1. Importa el proyecto en Vercel.
2. Establece la ruta de build a `frontend/`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Define variable:
   - `VITE_API_BASE_URL=https://tu-backend-url`

Vercel usa `frontend/vercel.json` para el build estático.

---

## 3) Flujo de deploy separado

1. Despliega backend en Railway/Render/Heroku/Fly.io.
2. Obtén la URL de la API (por ejemplo `https://mi-backend.up.railway.app`).
3. Actualiza `frontend/.env` o las variables de entorno del host estático con:

```env
VITE_API_BASE_URL=https://mi-backend-url
```

4. Construye y despliega el frontend.

---

## 4) Verificar después del deploy

- Backend debe responder en `https://mi-backend-url/`
- Frontend debe consumir la API con `VITE_API_BASE_URL`
- Prueba la compra de tickets y el envío de email OTP

---

## 5) Notas útiles

- `backend/Procfile` ayuda a Heroku y otros servicios que detectan procesos web.
- `frontend/netlify.toml` hace el deploy compatible con Netlify.
- `frontend/vercel.json` asegura que Vercel use `dist`.
