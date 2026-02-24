package service

import (
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"lockton-backend/models"
	"lockton-backend/mocks"
)

func TestServiceGetAll(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	now := time.Now()
	expected := []models.Item{
		{ID: 1, Name: "Item 1", Description: "Desc 1", CreatedAt: now, UpdatedAt: now},
		{ID: 2, Name: "Item 2", Description: "Desc 2", CreatedAt: now, UpdatedAt: now},
	}
	mockRepo.On("GetAll").Return(expected, nil)

	items, err := svc.GetAll()

	assert.NoError(t, err)
	assert.Len(t, items, 2)
	mockRepo.AssertExpectations(t)
}

func TestServiceGetByID(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	now := time.Now()
	expected := &models.Item{ID: 1, Name: "Item 1", Description: "Desc 1", CreatedAt: now, UpdatedAt: now}
	mockRepo.On("GetByID", int64(1)).Return(expected, nil)

	item, err := svc.GetByID(1)

	assert.NoError(t, err)
	assert.Equal(t, "Item 1", item.Name)
	mockRepo.AssertExpectations(t)
}

func TestServiceGetByID_NotFound(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	mockRepo.On("GetByID", int64(999)).Return(nil, errors.New("not found"))

	item, err := svc.GetByID(999)

	assert.Nil(t, item)
	assert.ErrorIs(t, err, ErrItemNotFound)
	mockRepo.AssertExpectations(t)
}

func TestServiceCreate(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	now := time.Now()
	mockRepo.On("Create", mock.AnythingOfType("*models.Item")).Return(
		&models.Item{ID: 1, Name: "New", Description: "Desc", CreatedAt: now, UpdatedAt: now}, nil,
	)

	item, err := svc.Create(models.CreateItemRequest{Name: "New", Description: "Desc"})

	assert.NoError(t, err)
	assert.Equal(t, int64(1), item.ID)
	mockRepo.AssertExpectations(t)
}

func TestServiceCreate_EmptyName(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	item, err := svc.Create(models.CreateItemRequest{Name: "", Description: "Desc"})

	assert.Nil(t, item)
	assert.ErrorIs(t, err, ErrInvalidInput)
}

func TestServiceUpdate(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	now := time.Now()
	existing := &models.Item{ID: 1, Name: "Old", Description: "Old Desc", CreatedAt: now, UpdatedAt: now}
	mockRepo.On("GetByID", int64(1)).Return(existing, nil)
	mockRepo.On("Update", mock.AnythingOfType("*models.Item")).Return(
		&models.Item{ID: 1, Name: "Updated", Description: "New Desc", CreatedAt: now, UpdatedAt: now}, nil,
	)

	item, err := svc.Update(1, models.UpdateItemRequest{Name: "Updated", Description: "New Desc"})

	assert.NoError(t, err)
	assert.Equal(t, "Updated", item.Name)
	mockRepo.AssertExpectations(t)
}

func TestServiceUpdate_NotFound(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	mockRepo.On("GetByID", int64(999)).Return(nil, errors.New("not found"))

	item, err := svc.Update(999, models.UpdateItemRequest{Name: "Updated"})

	assert.Nil(t, item)
	assert.ErrorIs(t, err, ErrItemNotFound)
	mockRepo.AssertExpectations(t)
}

func TestServiceUpdate_EmptyName(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	item, err := svc.Update(1, models.UpdateItemRequest{Name: ""})

	assert.Nil(t, item)
	assert.ErrorIs(t, err, ErrInvalidInput)
}

func TestServiceDelete(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	mockRepo.On("Delete", int64(1)).Return(nil)

	err := svc.Delete(1)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestServiceDelete_NotFound(t *testing.T) {
	mockRepo := new(mocks.MockItemRepository)
	svc := NewItemService(mockRepo)

	mockRepo.On("Delete", int64(999)).Return(errors.New("not found"))

	err := svc.Delete(999)

	assert.ErrorIs(t, err, ErrItemNotFound)
	mockRepo.AssertExpectations(t)
}
