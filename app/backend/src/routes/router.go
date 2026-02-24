package routes

import (
	"lockton-backend/controllers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func NewRouter(itemCtrl *controllers.ItemController, healthCtrl *controllers.HealthController) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.SetHeader("Content-Type", "application/json"))

	r.Get("/health", healthCtrl.Health)

	r.Route("/api/v1/items", func(r chi.Router) {
		r.Get("/", itemCtrl.GetAll)
		r.Post("/", itemCtrl.Create)
		r.Get("/{id}", itemCtrl.GetByID)
		r.Put("/{id}", itemCtrl.Update)
		r.Delete("/{id}", itemCtrl.Delete)
	})

	return r
}
