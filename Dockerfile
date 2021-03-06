# Dockerfile для запуска проекта
# 1. docker image build -t fer-go-300:1.0.0 .
# 2. docker container run -d --name fer-go-300-app -e FER_PORT=3001 -p 3001:3001 fer-go-300:1.0.0
#    docker image rm fer-go-300:1.0.0
#    docker container rm -f fer-go-300-app
FROM golang:1.17.7-alpine3.15
RUN apk add build-base
WORKDIR /usr/src/app
COPY go.mod go.sum* ./
RUN go mod download
EXPOSE 80
EXPOSE 8080
EXPOSE 3000
EXPOSE 3001
COPY . .
RUN go build main.go
CMD ["./main"]