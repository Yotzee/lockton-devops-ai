package repository

import (
	"database/sql"
	"lockton-backend/models"
)

type itemRepository struct {
	db *sql.DB
}

func NewItemRepository(db *sql.DB) ItemRepository {
	return &itemRepository{db: db}
}

func (r *itemRepository) GetAll() ([]models.Item, error) {
	rows, err := r.db.Query("SELECT id, name, description, created_at, updated_at FROM items ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Item
	for rows.Next() {
		var item models.Item
		if err := rows.Scan(&item.ID, &item.Name, &item.Description, &item.CreatedAt, &item.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r *itemRepository) GetByID(id int64) (*models.Item, error) {
	var item models.Item
	err := r.db.QueryRow(
		"SELECT id, name, description, created_at, updated_at FROM items WHERE id = $1", id,
	).Scan(&item.ID, &item.Name, &item.Description, &item.CreatedAt, &item.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *itemRepository) Create(item *models.Item) (*models.Item, error) {
	err := r.db.QueryRow(
		"INSERT INTO items (name, description, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id, created_at, updated_at",
		item.Name, item.Description,
	).Scan(&item.ID, &item.CreatedAt, &item.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return item, nil
}

func (r *itemRepository) Update(item *models.Item) (*models.Item, error) {
	err := r.db.QueryRow(
		"UPDATE items SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING updated_at",
		item.Name, item.Description, item.ID,
	).Scan(&item.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return item, nil
}

func (r *itemRepository) Delete(id int64) error {
	result, err := r.db.Exec("DELETE FROM items WHERE id = $1", id)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}
