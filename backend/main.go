package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/register", RegisterHandler)
	http.HandleFunc("/login", LoginHandler)
	http.HandleFunc("/logout", LogoutHandler)

	http.Handle("/protected", AuthMiddleware(http.HandlerFunc(protectedEndpoint)))

	log.Println("Server running at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func protectedEndpoint(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user")
	w.Write([]byte("Hello, " + user.(string)))
}
