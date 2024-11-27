# Base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar y validar dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluye desarrollo para permitir el build)
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto (usando TypeScript)
RUN npm run build

# Eliminar dependencias de desarrollo para reducir el tamaño de la imagen
RUN npm prune --production

# Exponer el puerto que usa la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
