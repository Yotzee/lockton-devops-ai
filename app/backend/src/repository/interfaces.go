package repository

import "lockton-backend/models"

type ItemRepository interface {
	GetAll() ([]models.Item, error)
	GetByID(id int64) (*models.Item, error)
	Create(item *models.Item) (*models.Item, error)
	Update(item *models.Item) (*models.Item, error)
	Delete(id int64) error
}
