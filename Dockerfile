# Base de Node.js
FROM node:18-alpine

# Establecer una variable de entorno para evitar generar logs excesivos durante npm install
ENV NODE_ENV=production

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar y validar dependencias
COPY package*.json ./

# Instalar solo dependencias de producción para reducir el tamaño final de la imagen
RUN npm ci --only=production

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto (si usa TypeScript o alguna herramienta de build)
RUN npm run build

# Exponer el puerto que usa la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
