package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq"

	"lockton-backend/config"
	"lockton-backend/controllers"
	"lockton-backend/repository"
	"lockton-backend/routes"
	"lockton-backend/service"
)

func main() {
	cfg := config.Load()

	db, err := sql.Open("postgres", cfg.DSN())
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}
	log.Println("connected to database")

	itemRepo := repository.NewItemRepository(db)
	itemSvc := service.NewItemService(itemRepo)
	itemCtrl := controllers.NewItemController(itemSvc)
	healthCtrl := controllers.NewHealthController()

	router := routes.NewRouter(itemCtrl, healthCtrl)

	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("server starting on %s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
