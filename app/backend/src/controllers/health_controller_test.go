package controllers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHealth(t *testing.T) {
	ctrl := NewHealthController()

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	w := httptest.NewRecorder()
	ctrl.Health(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var result map[string]string
	err := json.NewDecoder(w.Body).Decode(&result)
	assert.NoError(t, err)
	assert.Equal(t, "ok", result["status"])
}
