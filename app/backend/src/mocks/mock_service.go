package mocks

import (
	"lockton-backend/models"

	"github.com/stretchr/testify/mock"
)

type MockItemService struct {
	mock.Mock
}

func (m *MockItemService) GetAll() ([]models.Item, error) {
	args := m.Called()
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]models.Item), args.Error(1)
}

func (m *MockItemService) GetByID(id int64) (*models.Item, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Item), args.Error(1)
}

func (m *MockItemService) Create(req models.CreateItemRequest) (*models.Item, error) {
	args := m.Called(req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Item), args.Error(1)
}

func (m *MockItemService) Update(id int64, req models.UpdateItemRequest) (*models.Item, error) {
	args := m.Called(id, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Item), args.Error(1)
}

func (m *MockItemService) Delete(id int64) error {
	args := m.Called(id)
	return args.Error(0)
}
