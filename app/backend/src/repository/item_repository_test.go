package repository

import (
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"lockton-backend/models"
)

func TestGetAll(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "name", "description", "created_at", "updated_at"}).
		AddRow(1, "Item 1", "Desc 1", now, now).
		AddRow(2, "Item 2", "Desc 2", now, now)

	mock.ExpectQuery("SELECT id, name, description, created_at, updated_at FROM items").
		WillReturnRows(rows)

	repo := NewItemRepository(db)
	items, err := repo.GetAll()

	assert.NoError(t, err)
	assert.Len(t, items, 2)
	assert.Equal(t, "Item 1", items[0].Name)
	assert.Equal(t, "Item 2", items[1].Name)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetAll_Empty(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "name", "description", "created_at", "updated_at"})
	mock.ExpectQuery("SELECT id, name, description, created_at, updated_at FROM items").
		WillReturnRows(rows)

	repo := NewItemRepository(db)
	items, err := repo.GetAll()

	assert.NoError(t, err)
	assert.Empty(t, items)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetByID(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "name", "description", "created_at", "updated_at"}).
		AddRow(1, "Item 1", "Desc 1", now, now)

	mock.ExpectQuery("SELECT id, name, description, created_at, updated_at FROM items WHERE").
		WithArgs(int64(1)).
		WillReturnRows(rows)

	repo := NewItemRepository(db)
	item, err := repo.GetByID(1)

	assert.NoError(t, err)
	assert.Equal(t, int64(1), item.ID)
	assert.Equal(t, "Item 1", item.Name)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestCreate(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "created_at", "updated_at"}).
		AddRow(1, now, now)

	mock.ExpectQuery("INSERT INTO items").
		WithArgs("New Item", "New Desc").
		WillReturnRows(rows)

	repo := NewItemRepository(db)
	item, err := repo.Create(&models.Item{Name: "New Item", Description: "New Desc"})

	assert.NoError(t, err)
	assert.Equal(t, int64(1), item.ID)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestUpdate(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	now := time.Now()
	rows := sqlmock.NewRows([]string{"updated_at"}).AddRow(now)

	mock.ExpectQuery("UPDATE items SET").
		WithArgs("Updated", "Updated Desc", int64(1)).
		WillReturnRows(rows)

	repo := NewItemRepository(db)
	item, err := repo.Update(&models.Item{ID: 1, Name: "Updated", Description: "Updated Desc"})

	assert.NoError(t, err)
	assert.Equal(t, "Updated", item.Name)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestDelete(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	mock.ExpectExec("DELETE FROM items WHERE").
		WithArgs(int64(1)).
		WillReturnResult(sqlmock.NewResult(0, 1))

	repo := NewItemRepository(db)
	err = repo.Delete(1)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestDelete_NotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	mock.ExpectExec("DELETE FROM items WHERE").
		WithArgs(int64(999)).
		WillReturnResult(sqlmock.NewResult(0, 0))

	repo := NewItemRepository(db)
	err = repo.Delete(999)

	assert.Error(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}
