FROM node:alpine

WORKDIR /Saravanan/paytm/custom

COPY . .

RUN npm install

CMD ["npm", "run", "start"]