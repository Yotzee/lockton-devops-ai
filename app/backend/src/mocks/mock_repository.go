package mocks

import (
	"lockton-backend/models"

	"github.com/stretchr/testify/mock"
)

type MockItemRepository struct {
	mock.Mock
}

func (m *MockItemRepository) GetAll() ([]models.Item, error) {
	args := m.Called()
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]models.Item), args.Error(1)
}

func (m *MockItemRepository) GetByID(id int64) (*models.Item, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Item), args.Error(1)
}

func (m *MockItemRepository) Create(item *models.Item) (*models.Item, error) {
	args := m.Called(item)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Item), args.Error(1)
}

func (m *MockItemRepository) Update(item *models.Item) (*models.Item, error) {
	args := m.Called(item)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Item), args.Error(1)
}

func (m *MockItemRepository) Delete(id int64) error {
	args := m.Called(id)
	return args.Error(0)
}
