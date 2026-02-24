package service

import (
	"errors"
	"lockton-backend/models"
	"lockton-backend/repository"
)

var (
	ErrItemNotFound = errors.New("item not found")
	ErrInvalidInput = errors.New("invalid input: name is required")
)

type ItemService interface {
	GetAll() ([]models.Item, error)
	GetByID(id int64) (*models.Item, error)
	Create(req models.CreateItemRequest) (*models.Item, error)
	Update(id int64, req models.UpdateItemRequest) (*models.Item, error)
	Delete(id int64) error
}

type itemService struct {
	repo repository.ItemRepository
}

func NewItemService(repo repository.ItemRepository) ItemService {
	return &itemService{repo: repo}
}

func (s *itemService) GetAll() ([]models.Item, error) {
	return s.repo.GetAll()
}

func (s *itemService) GetByID(id int64) (*models.Item, error) {
	item, err := s.repo.GetByID(id)
	if err != nil {
		return nil, ErrItemNotFound
	}
	return item, nil
}

func (s *itemService) Create(req models.CreateItemRequest) (*models.Item, error) {
	if req.Name == "" {
		return nil, ErrInvalidInput
	}
	item := &models.Item{
		Name:        req.Name,
		Description: req.Description,
	}
	return s.repo.Create(item)
}

func (s *itemService) Update(id int64, req models.UpdateItemRequest) (*models.Item, error) {
	if req.Name == "" {
		return nil, ErrInvalidInput
	}
	existing, err := s.repo.GetByID(id)
	if err != nil {
		return nil, ErrItemNotFound
	}
	existing.Name = req.Name
	existing.Description = req.Description
	return s.repo.Update(existing)
}

func (s *itemService) Delete(id int64) error {
	err := s.repo.Delete(id)
	if err != nil {
		return ErrItemNotFound
	}
	return nil
}
