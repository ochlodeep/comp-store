FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm i
EXPOSE 3000
CMD [ "node", "./src/app.js" ]