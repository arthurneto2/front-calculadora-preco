# Etapa 1: build do projeto
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: Servir arquivos com NGINX
FROM nginx:alpine

# Remove configuração padrão do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados pela build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração customizada (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
