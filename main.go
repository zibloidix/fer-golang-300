package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {

	port := getPort()
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/fer", soapService)

	fmt.Printf("Try to start server on port: %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

func soapService(w http.ResponseWriter, r *http.Request) {
	printlog(r)
	if r.Method == "POST" {
		action := r.Header.Get("soapaction")
		fileName := "./xml/" + action + "/" + "Response_Ok.xml"

		sendFile(fileName, w)
	} else {
		w.WriteHeader(http.StatusInternalServerError)
		sendData("Server Error!", w)
	}
}

func getPort() string {
	port, exists := os.LookupEnv("FER_PORT")
	if exists {
		return ":" + port
	}
	return ":3000"
}

func sendFile(file string, w http.ResponseWriter) {
	f, err := os.Open(file)
	if err != nil {
		log.Fatal(err)
	}
	io.Copy(w, f)
}

func sendData(data string, w http.ResponseWriter) {
	fmt.Fprintf(w, "%q", data)
}

func printlog(r *http.Request) {
	t := time.Now().Format(time.ANSIC)
	m := r.Method
	h := r.Host
	p := r.URL.Path
	fmt.Fprintf(os.Stdout, "[%s]\t%s\t%s\t%s\n", t, m, h, p)
}
