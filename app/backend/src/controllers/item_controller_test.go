package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"

	"lockton-backend/mocks"
	"lockton-backend/models"
	"lockton-backend/service"
)

func setupRouter(ctrl *ItemController) *chi.Mux {
	r := chi.NewRouter()
	r.Get("/api/v1/items", ctrl.GetAll)
	r.Post("/api/v1/items", ctrl.Create)
	r.Get("/api/v1/items/{id}", ctrl.GetByID)
	r.Put("/api/v1/items/{id}", ctrl.Update)
	r.Delete("/api/v1/items/{id}", ctrl.Delete)
	return r
}

func TestControllerGetAll(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	now := time.Now()
	items := []models.Item{
		{ID: 1, Name: "Item 1", Description: "Desc 1", CreatedAt: now, UpdatedAt: now},
	}
	mockSvc.On("GetAll").Return(items, nil)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/items", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var result []models.Item
	err := json.NewDecoder(w.Body).Decode(&result)
	assert.NoError(t, err)
	assert.Len(t, result, 1)
	mockSvc.AssertExpectations(t)
}

func TestControllerGetByID(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	now := time.Now()
	item := &models.Item{ID: 1, Name: "Item 1", Description: "Desc 1", CreatedAt: now, UpdatedAt: now}
	mockSvc.On("GetByID", int64(1)).Return(item, nil)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/items/1", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var result models.Item
	err := json.NewDecoder(w.Body).Decode(&result)
	assert.NoError(t, err)
	assert.Equal(t, "Item 1", result.Name)
	mockSvc.AssertExpectations(t)
}

func TestControllerGetByID_NotFound(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	mockSvc.On("GetByID", int64(999)).Return(nil, service.ErrItemNotFound)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/items/999", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	mockSvc.AssertExpectations(t)
}

func TestControllerGetByID_InvalidID(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/items/abc", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestControllerCreate(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	now := time.Now()
	createReq := models.CreateItemRequest{Name: "New Item", Description: "New Desc"}
	mockSvc.On("Create", createReq).Return(
		&models.Item{ID: 1, Name: "New Item", Description: "New Desc", CreatedAt: now, UpdatedAt: now}, nil,
	)

	body, _ := json.Marshal(createReq)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/items", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var result models.Item
	err := json.NewDecoder(w.Body).Decode(&result)
	assert.NoError(t, err)
	assert.Equal(t, "New Item", result.Name)
	mockSvc.AssertExpectations(t)
}

func TestControllerCreate_InvalidBody(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/items", bytes.NewReader([]byte("invalid")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestControllerCreate_ValidationError(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	createReq := models.CreateItemRequest{Name: "", Description: "Desc"}
	mockSvc.On("Create", createReq).Return(nil, service.ErrInvalidInput)

	body, _ := json.Marshal(createReq)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/items", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	mockSvc.AssertExpectations(t)
}

func TestControllerUpdate(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	now := time.Now()
	updateReq := models.UpdateItemRequest{Name: "Updated", Description: "Updated Desc"}
	mockSvc.On("Update", int64(1), updateReq).Return(
		&models.Item{ID: 1, Name: "Updated", Description: "Updated Desc", CreatedAt: now, UpdatedAt: now}, nil,
	)

	body, _ := json.Marshal(updateReq)
	req := httptest.NewRequest(http.MethodPut, "/api/v1/items/1", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockSvc.AssertExpectations(t)
}

func TestControllerDelete(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	mockSvc.On("Delete", int64(1)).Return(nil)

	req := httptest.NewRequest(http.MethodDelete, "/api/v1/items/1", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
	mockSvc.AssertExpectations(t)
}

func TestControllerDelete_NotFound(t *testing.T) {
	mockSvc := new(mocks.MockItemService)
	ctrl := NewItemController(mockSvc)
	router := setupRouter(ctrl)

	mockSvc.On("Delete", int64(999)).Return(service.ErrItemNotFound)

	req := httptest.NewRequest(http.MethodDelete, "/api/v1/items/999", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	mockSvc.AssertExpectations(t)
}
