sample_json = """
{
  "tables": [
    {
      "id": 1,
      "name": "users",
      "fields": [
        { "id": 1, "name": "id", "type": "INTEGER", "isPrimary": true, "isRequired": true, "isForeignKey": false },
        { "id": 2, "name": "email", "type": "VARCHAR(255)", "isPrimary": false, "isRequired": true, "isForeignKey": false },
        { "id": 3, "name": "password", "type": "VARCHAR(255)", "isPrimary": false, "isRequired": true, "isForeignKey": false },
        { "id": 4, "name": "created_at", "type": "TIMESTAMP", "isPrimary": false, "isRequired": true, "isForeignKey": false }
      ]
    },
    {
      "id": 2,
      "name": "posts",
      "fields": [
        { "id": 5, "name": "id", "type": "INTEGER", "isPrimary": true, "isRequired": true, "isForeignKey": false },
        { "id": 6, "name": "user_id", "type": "INTEGER", "isPrimary": false, "isRequired": true, "isForeignKey": true },
        { "id": 7, "name": "title", "type": "VARCHAR(255)", "isPrimary": false, "isRequired": true, "isForeignKey": false },
        { "id": 8, "name": "content", "type": "TEXT", "isPrimary": false, "isRequired": true, "isForeignKey": false }
      ]
    },
    {
      "id": 3,
      "name": "comments",
      "fields": [
        { "id": 9, "name": "id", "type": "INTEGER", "isPrimary": true, "isRequired": true, "isForeignKey": false },
        { "id": 10, "name": "post_id", "type": "INTEGER", "isPrimary": false, "isRequired": true, "isForeignKey": true },
        { "id": 11, "name": "user_id", "type": "INTEGER", "isPrimary": false, "isRequired": true, "isForeignKey": true },
        { "id": 12, "name": "body", "type": "TEXT", "isPrimary": false, "isRequired": true, "isForeignKey": false }
      ]
    },
    {
      "id": 4,
      "name": "categories",
      "fields": [
        { "id": 13, "name": "id", "type": "INTEGER", "isPrimary": true, "isRequired": true, "isForeignKey": false },
        { "id": 14, "name": "name", "type": "VARCHAR(100)", "isPrimary": false, "isRequired": true, "isForeignKey": false }
      ]
    },
    {
      "id": 5,
      "name": "products",
      "fields": [
        { "id": 15, "name": "id", "type": "INTEGER", "isPrimary": true, "isRequired": true, "isForeignKey": false },
        { "id": 16, "name": "category_id", "type": "INTEGER", "isPrimary": false, "isRequired": true, "isForeignKey": true },
        { "id": 17, "name": "name", "type": "VARCHAR(255)", "isPrimary": false, "isRequired": true, "isForeignKey": false },
        { "id": 18, "name": "price", "type": "DECIMAL(10,2)", "isPrimary": false, "isRequired": true, "isForeignKey": false }
      ]
    },
    {
      "id": 6,
      "name": "orders",
      "fields": [
        { "id": 19, "name": "id", "type": "INTEGER", "isPrimary": true, "isRequired": true, "isForeignKey": false },
        { "id": 20, "name": "user_id", "type": "INTEGER", "isPrimary": false, "isRequired": true, "isForeignKey": true },
        { "id": 21, "name": "order_date", "type": "TIMESTAMP", "isPrimary": false, "isRequired": true, "isForeignKey": false },
        { "id": 22, "name": "status", "type": "VARCHAR(50)", "isPrimary": false, "isRequired": true, "isForeignKey": false }
      ]
    },
    {
      "id": 7,
      "name": "order_items",
      "fields": [
        { "id": 23, "name": "id", "type": "INTEGER", "isPrimary": true, "isRequired": true, "isForeignKey": false },
        { "id": 24, "name": "order_id", "type": "INTEGER", "isPrimary": false, "isRequired": true, "isForeignKey": true },
        { "id": 25, "name": "product_id", "type": "INTEGER", "isPrimary": false, "isRequired": true, "isForeignKey": true },
        { "id": 26, "name": "quantity", "type": "INTEGER", "isPrimary": false, "isRequired": true, "isForeignKey": false }
      ]
    }
  ],
  "relationships": [
    { "id": 1, "fromTable": 2, "fromField": 6, "toTable": 1, "toField": 1 },
    { "id": 2, "fromTable": 3, "fromField": 10, "toTable": 2, "toField": 5 },
    { "id": 3, "fromTable": 3, "fromField": 11, "toTable": 1, "toField": 1 },
    { "id": 4, "fromTable": 5, "fromField": 16, "toTable": 4, "toField": 13 },
    { "id": 5, "fromTable": 6, "fromField": 20, "toTable": 1, "toField": 1 },
    { "id": 6, "fromTable": 7, "fromField": 24, "toTable": 6, "toField": 19 },
    { "id": 7, "fromTable": 7, "fromField": 25, "toTable": 5, "toField": 15 }
  ]
}
"""
