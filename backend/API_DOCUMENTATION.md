# Cake Ordering and Management System API Documentation

This document provides detailed information about the API endpoints available in the Cake Ordering and Management System, including sample request and response bodies.

## Table of Contents

- [Authentication](#authentication)
- [Customers](#customers)
- [Orders](#orders)
- [Ingredients](#ingredients)
- [Suppliers](#suppliers)
- [Delivery Personnel](#delivery-personnel)
- [Deliveries](#deliveries)
- [Transactions](#transactions)

## Authentication

This MVP version does not include authentication. All endpoints are publicly accessible.

## Customers

### Get All Customers

```
GET /api/customers
```

**Response**

```json
[
  {
    "_id": "60d21b4667d0d8992e610c85",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "address": [
      {
        "street": "123 Main St",
        "city": "New York",
        "postalCode": "10001"
      }
    ],
    "preferences": {
      "favoriteFlavors": ["chocolate", "vanilla"],
      "icingType": "buttercream",
      "dietaryRequirements": ["nut-free"]
    },
    "loyaltyPoints": 50,
    "orderHistory": ["60d21b4667d0d8992e610c86"],
    "createdAt": "2023-06-22T10:00:00.000Z",
    "updatedAt": "2023-06-22T10:00:00.000Z"
  }
]
```

### Get Customer by ID

```
GET /api/customers/:id
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "address": [
    {
      "street": "123 Main St",
      "city": "New York",
      "postalCode": "10001"
    }
  ],
  "preferences": {
    "favoriteFlavors": ["chocolate", "vanilla"],
    "icingType": "buttercream",
    "dietaryRequirements": ["nut-free"]
  },
  "loyaltyPoints": 50,
  "orderHistory": ["60d21b4667d0d8992e610c86"],
  "createdAt": "2023-06-22T10:00:00.000Z",
  "updatedAt": "2023-06-22T10:00:00.000Z"
}
```

### Create Customer

```
POST /api/customers
```

**Request**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "passwordHash": "$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K",
  "phoneNumber": "9876543210",
  "address": [
    {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "postalCode": "90001"
    }
  ],
  "preferences": {
    "favoriteFlavors": ["red velvet", "lemon"],
    "icingType": "cream cheese",
    "dietaryRequirements": ["gluten-free"]
  }
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c87",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "passwordHash": "$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K",
  "phoneNumber": "9876543210",
  "address": [
    {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "postalCode": "90001"
    }
  ],
  "preferences": {
    "favoriteFlavors": ["red velvet", "lemon"],
    "icingType": "cream cheese",
    "dietaryRequirements": ["gluten-free"]
  },
  "loyaltyPoints": 0,
  "orderHistory": [],
  "createdAt": "2023-06-22T11:00:00.000Z",
  "updatedAt": "2023-06-22T11:00:00.000Z"
}
```

### Update Customer

```
PUT /api/customers/:id
```

**Request**

```json
{
  "phoneNumber": "5551234567",
  "address": [
    {
      "street": "789 Pine St",
      "city": "Chicago",
      "postalCode": "60007"
    }
  ]
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "5551234567",
  "address": [
    {
      "street": "789 Pine St",
      "city": "Chicago",
      "postalCode": "60007"
    }
  ],
  "preferences": {
    "favoriteFlavors": ["chocolate", "vanilla"],
    "icingType": "buttercream",
    "dietaryRequirements": ["nut-free"]
  },
  "loyaltyPoints": 50,
  "orderHistory": ["60d21b4667d0d8992e610c86"],
  "createdAt": "2023-06-22T10:00:00.000Z",
  "updatedAt": "2023-06-22T12:00:00.000Z"
}
```

### Delete Customer

```
DELETE /api/customers/:id
```

**Response**

```json
{
  "message": "Customer deleted successfully"
}
```

## Orders

### Get All Orders

```
GET /api/orders
```

**Response**

```json
[
  {
    "_id": "60d21b4667d0d8992e610c86",
    "customerId": {
      "_id": "60d21b4667d0d8992e610c85",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "cakeType": "chocolate",
    "flavor": "dark chocolate",
    "size": "medium",
    "theme": "birthday",
    "eventDate": "2023-07-15T00:00:00.000Z",
    "orderStatus": "Confirmed",
    "deliveryMethod": "Delivery",
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "New York",
      "postalCode": "10001"
    },
    "totalPrice": 45.99,
    "invoiceId": {
      "_id": "60d21b4667d0d8992e610c88",
      "paymentStatus": "Completed"
    },
    "createdAt": "2023-06-22T10:30:00.000Z",
    "updatedAt": "2023-06-22T10:30:00.000Z"
  }
]
```

### Get Order by ID

```
GET /api/orders/:id
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "customerId": {
    "_id": "60d21b4667d0d8992e610c85",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  },
  "cakeType": "chocolate",
  "flavor": "dark chocolate",
  "size": "medium",
  "theme": "birthday",
  "eventDate": "2023-07-15T00:00:00.000Z",
  "orderStatus": "Confirmed",
  "deliveryMethod": "Delivery",
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "postalCode": "10001"
  },
  "totalPrice": 45.99,
  "invoiceId": {
    "_id": "60d21b4667d0d8992e610c88",
    "paymentStatus": "Completed"
  },
  "createdAt": "2023-06-22T10:30:00.000Z",
  "updatedAt": "2023-06-22T10:30:00.000Z"
}
```

### Create Order

```
POST /api/orders
```

**Request**

```json
{
  "customerId": "60d21b4667d0d8992e610c85",
  "cakeType": "vanilla",
  "flavor": "vanilla bean",
  "size": "large",
  "theme": "wedding",
  "eventDate": "2023-08-20T00:00:00.000Z",
  "customImageUrl": "https://example.com/cake-design.jpg",
  "orderStatus": "Pending",
  "deliveryMethod": "Pickup",
  "totalPrice": 75.99
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c89",
  "customerId": "60d21b4667d0d8992e610c85",
  "cakeType": "vanilla",
  "flavor": "vanilla bean",
  "size": "large",
  "theme": "wedding",
  "eventDate": "2023-08-20T00:00:00.000Z",
  "customImageUrl": "https://example.com/cake-design.jpg",
  "orderStatus": "Pending",
  "deliveryMethod": "Pickup",
  "totalPrice": 75.99,
  "createdAt": "2023-06-22T13:00:00.000Z",
  "updatedAt": "2023-06-22T13:00:00.000Z"
}
```

### Update Order

```
PUT /api/orders/:id
```

**Request**

```json
{
  "orderStatus": "In Progress",
  "deliveryMethod": "Delivery",
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "postalCode": "10001"
  }
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c89",
  "customerId": "60d21b4667d0d8992e610c85",
  "cakeType": "vanilla",
  "flavor": "vanilla bean",
  "size": "large",
  "theme": "wedding",
  "eventDate": "2023-08-20T00:00:00.000Z",
  "customImageUrl": "https://example.com/cake-design.jpg",
  "orderStatus": "In Progress",
  "deliveryMethod": "Delivery",
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "postalCode": "10001"
  },
  "totalPrice": 75.99,
  "createdAt": "2023-06-22T13:00:00.000Z",
  "updatedAt": "2023-06-22T14:00:00.000Z"
}
```

### Delete Order

```
DELETE /api/orders/:id
```

**Response**

```json
{
  "message": "Order deleted successfully"
}
```

## Ingredients

### Get All Ingredients

```
GET /api/ingredients
```

**Response**

```json
[
  {
    "_id": "60d21b4667d0d8992e610c90",
    "ingredientName": "Flour",
    "quantityAvailable": 50,
    "unit": "kg",
    "reorderLevel": 10,
    "supplierId": {
      "_id": "60d21b4667d0d8992e610c91",
      "supplierName": "Baking Supplies Inc",
      "contactPerson": "Mike Johnson"
    },
    "expiryDate": "2023-12-31T00:00:00.000Z",
    "createdAt": "2023-06-22T09:00:00.000Z",
    "updatedAt": "2023-06-22T09:00:00.000Z"
  }
]
```

### Get Ingredient by ID

```
GET /api/ingredients/:id
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c90",
  "ingredientName": "Flour",
  "quantityAvailable": 50,
  "unit": "kg",
  "reorderLevel": 10,
  "supplierId": {
    "_id": "60d21b4667d0d8992e610c91",
    "supplierName": "Baking Supplies Inc",
    "contactPerson": "Mike Johnson"
  },
  "expiryDate": "2023-12-31T00:00:00.000Z",
  "createdAt": "2023-06-22T09:00:00.000Z",
  "updatedAt": "2023-06-22T09:00:00.000Z"
}
```

### Create Ingredient

```
POST /api/ingredients
```

**Request**

```json
{
  "ingredientName": "Sugar",
  "quantityAvailable": 30,
  "unit": "kg",
  "reorderLevel": 5,
  "supplierId": "60d21b4667d0d8992e610c91",
  "expiryDate": "2023-12-31T00:00:00.000Z"
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c92",
  "ingredientName": "Sugar",
  "quantityAvailable": 30,
  "unit": "kg",
  "reorderLevel": 5,
  "supplierId": "60d21b4667d0d8992e610c91",
  "expiryDate": "2023-12-31T00:00:00.000Z",
  "createdAt": "2023-06-22T15:00:00.000Z",
  "updatedAt": "2023-06-22T15:00:00.000Z"
}
```

### Update Ingredient

```
PUT /api/ingredients/:id
```

**Request**

```json
{
  "quantityAvailable": 25,
  "reorderLevel": 8
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c92",
  "ingredientName": "Sugar",
  "quantityAvailable": 25,
  "unit": "kg",
  "reorderLevel": 8,
  "supplierId": "60d21b4667d0d8992e610c91",
  "expiryDate": "2023-12-31T00:00:00.000Z",
  "createdAt": "2023-06-22T15:00:00.000Z",
  "updatedAt": "2023-06-22T16:00:00.000Z"
}
```

### Delete Ingredient

```
DELETE /api/ingredients/:id
```

**Response**

```json
{
  "message": "Ingredient deleted successfully"
}
```

## Suppliers

### Get All Suppliers

```
GET /api/suppliers
```

**Response**

```json
[
  {
    "_id": "60d21b4667d0d8992e610c91",
    "supplierName": "Baking Supplies Inc",
    "contactPerson": "Mike Johnson",
    "phone": "5551234567",
    "email": "mike@bakingsupplies.com",
    "address": {
      "street": "456 Supplier St",
      "city": "Chicago",
      "postalCode": "60007"
    },
    "createdAt": "2023-06-22T08:00:00.000Z",
    "updatedAt": "2023-06-22T08:00:00.000Z"
  }
]
```

### Get Supplier by ID

```
GET /api/suppliers/:id
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c91",
  "supplierName": "Baking Supplies Inc",
  "contactPerson": "Mike Johnson",
  "phone": "5551234567",
  "email": "mike@bakingsupplies.com",
  "address": {
    "street": "456 Supplier St",
    "city": "Chicago",
    "postalCode": "60007"
  },
  "createdAt": "2023-06-22T08:00:00.000Z",
  "updatedAt": "2023-06-22T08:00:00.000Z"
}
```

### Create Supplier

```
POST /api/suppliers
```

**Request**

```json
{
  "supplierName": "Sweet Ingredients Co",
  "contactPerson": "Sarah Williams",
  "phone": "5559876543",
  "email": "sarah@sweetingredients.com",
  "address": {
    "street": "789 Vendor Ave",
    "city": "Boston",
    "postalCode": "02108"
  }
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c93",
  "supplierName": "Sweet Ingredients Co",
  "contactPerson": "Sarah Williams",
  "phone": "5559876543",
  "email": "sarah@sweetingredients.com",
  "address": {
    "street": "789 Vendor Ave",
    "city": "Boston",
    "postalCode": "02108"
  },
  "createdAt": "2023-06-22T17:00:00.000Z",
  "updatedAt": "2023-06-22T17:00:00.000Z"
}
```

### Update Supplier

```
PUT /api/suppliers/:id
```

**Request**

```json
{
  "phone": "5551112222",
  "email": "sarah.williams@sweetingredients.com"
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c93",
  "supplierName": "Sweet Ingredients Co",
  "contactPerson": "Sarah Williams",
  "phone": "5551112222",
  "email": "sarah.williams@sweetingredients.com",
  "address": {
    "street": "789 Vendor Ave",
    "city": "Boston",
    "postalCode": "02108"
  },
  "createdAt": "2023-06-22T17:00:00.000Z",
  "updatedAt": "2023-06-22T18:00:00.000Z"
}
```

### Delete Supplier

```
DELETE /api/suppliers/:id
```

**Response**

```json
{
  "message": "Supplier deleted successfully"
}
```

## Delivery Personnel

### Get All Delivery Personnel

```
GET /api/delivery-personnel
```

**Response**

```json
[
  {
    "_id": "60d21b4667d0d8992e610c94",
    "fullName": "David Brown",
    "phoneNumber": "5553334444",
    "availabilityStatus": "Available",
    "createdAt": "2023-06-22T07:00:00.000Z",
    "updatedAt": "2023-06-22T07:00:00.000Z"
  }
]
```

### Get Delivery Personnel by ID

```
GET /api/delivery-personnel/:id
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c94",
  "fullName": "David Brown",
  "phoneNumber": "5553334444",
  "availabilityStatus": "Available",
  "createdAt": "2023-06-22T07:00:00.000Z",
  "updatedAt": "2023-06-22T07:00:00.000Z"
}
```

### Create Delivery Personnel

```
POST /api/delivery-personnel
```

**Request**

```json
{
  "fullName": "Emily Davis",
  "phoneNumber": "5555556666",
  "availabilityStatus": "Available"
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c95",
  "fullName": "Emily Davis",
  "phoneNumber": "5555556666",
  "availabilityStatus": "Available",
  "createdAt": "2023-06-22T19:00:00.000Z",
  "updatedAt": "2023-06-22T19:00:00.000Z"
}
```

### Update Delivery Personnel

```
PUT /api/delivery-personnel/:id
```

**Request**

```json
{
  "availabilityStatus": "On Delivery"
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c95",
  "fullName": "Emily Davis",
  "phoneNumber": "5555556666",
  "availabilityStatus": "On Delivery",
  "createdAt": "2023-06-22T19:00:00.000Z",
  "updatedAt": "2023-06-22T20:00:00.000Z"
}
```

### Delete Delivery Personnel

```
DELETE /api/delivery-personnel/:id
```

**Response**

```json
{
  "message": "Delivery personnel deleted successfully"
}
```

## Deliveries

### Get All Deliveries

```
GET /api/deliveries
```

**Response**

```json
[
  {
    "_id": "60d21b4667d0d8992e610c96",
    "orderId": {
      "_id": "60d21b4667d0d8992e610c86",
      "cakeType": "chocolate",
      "orderStatus": "Out for Delivery"
    },
    "deliveryPersonId": {
      "_id": "60d21b4667d0d8992e610c94",
      "fullName": "David Brown",
      "phoneNumber": "5553334444"
    },
    "status": "Out for Delivery",
    "deliveryDate": "2023-07-15T14:00:00.000Z",
    "notes": "Customer requested delivery before 2 PM",
    "createdAt": "2023-06-22T11:30:00.000Z",
    "updatedAt": "2023-06-22T11:30:00.000Z"
  }
]
```

### Get Delivery by ID

```
GET /api/deliveries/:id
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c96",
  "orderId": {
    "_id": "60d21b4667d0d8992e610c86",
    "cakeType": "chocolate",
    "orderStatus": "Out for Delivery"
  },
  "deliveryPersonId": {
    "_id": "60d21b4667d0d8992e610c94",
    "fullName": "David Brown",
    "phoneNumber": "5553334444"
  },
  "status": "Out for Delivery",
  "deliveryDate": "2023-07-15T14:00:00.000Z",
  "notes": "Customer requested delivery before 2 PM",
  "createdAt": "2023-06-22T11:30:00.000Z",
  "updatedAt": "2023-06-22T11:30:00.000Z"
}
```

### Create Delivery

```
POST /api/deliveries
```

**Request**

```json
{
  "orderId": "60d21b4667d0d8992e610c89",
  "deliveryPersonId": "60d21b4667d0d8992e610c95",
  "status": "Assigned",
  "deliveryDate": "2023-08-20T15:00:00.000Z",
  "notes": "Wedding cake delivery, handle with extra care"
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c97",
  "orderId": "60d21b4667d0d8992e610c89",
  "deliveryPersonId": "60d21b4667d0d8992e610c95",
  "status": "Assigned",
  "deliveryDate": "2023-08-20T15:00:00.000Z",
  "notes": "Wedding cake delivery, handle with extra care",
  "createdAt": "2023-06-22T21:00:00.000Z",
  "updatedAt": "2023-06-22T21:00:00.000Z"
}
```

### Update Delivery

```
PUT /api/deliveries/:id
```

**Request**

```json
{
  "status": "Delivered",
  "notes": "Delivered successfully, customer very satisfied"
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c97",
  "orderId": "60d21b4667d0d8992e610c89",
  "deliveryPersonId": "60d21b4667d0d8992e610c95",
  "status": "Delivered",
  "deliveryDate": "2023-08-20T15:00:00.000Z",
  "notes": "Delivered successfully, customer very satisfied",
  "createdAt": "2023-06-22T21:00:00.000Z",
  "updatedAt": "2023-06-22T22:00:00.000Z"
}
```

### Delete Delivery

```
DELETE /api/deliveries/:id
```

**Response**

```json
{
  "message": "Delivery deleted successfully"
}
```

## Transactions

### Get All Transactions

```
GET /api/transactions
```

**Response**

```json
[
  {
    "_id": "60d21b4667d0d8992e610c88",
    "orderId": {
      "_id": "60d21b4667d0d8992e610c86",
      "cakeType": "chocolate",
      "totalPrice": 45.99
    },
    "customerId": {
      "_id": "60d21b4667d0d8992e610c85",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "paymentMethod": "Visa",
    "amount": 45.99,
    "currency": "USD",
    "paymentStatus": "Completed",
    "receiptUrl": "https://example.com/receipts/r123456.pdf",
    "createdAt": "2023-06-22T10:35:00.000Z",
    "updatedAt": "2023-06-22T10:35:00.000Z"
  }
]
```

### Get Transaction by ID

```
GET /api/transactions/:id
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c88",
  "orderId": {
    "_id": "60d21b4667d0d8992e610c86",
    "cakeType": "chocolate",
    "totalPrice": 45.99
  },
  "customerId": {
    "_id": "60d21b4667d0d8992e610c85",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  },
  "paymentMethod": "Visa",
  "amount": 45.99,
  "currency": "USD",
  "paymentStatus": "Completed",
  "receiptUrl": "https://example.com/receipts/r123456.pdf",
  "createdAt": "2023-06-22T10:35:00.000Z",
  "updatedAt": "2023-06-22T10:35:00.000Z"
}
```

### Create Transaction

```
POST /api/transactions
```

**Request**

```json
{
  "orderId": "60d21b4667d0d8992e610c89",
  "customerId": "60d21b4667d0d8992e610c85",
  "paymentMethod": "MasterCard",
  "amount": 75.99,
  "currency": "USD",
  "paymentStatus": "Pending"
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c98",
  "orderId": "60d21b4667d0d8992e610c89",
  "customerId": "60d21b4667d0d8992e610c85",
  "paymentMethod": "MasterCard",
  "amount": 75.99,
  "currency": "USD",
  "paymentStatus": "Pending",
  "createdAt": "2023-06-22T23:00:00.000Z",
  "updatedAt": "2023-06-22T23:00:00.000Z"
}
```

### Update Transaction

```
PUT /api/transactions/:id
```

**Request**

```json
{
  "paymentStatus": "Completed",
  "receiptUrl": "https://example.com/receipts/r789012.pdf"
}
```

**Response**

```json
{
  "_id": "60d21b4667d0d8992e610c98",
  "orderId": "60d21b4667d0d8992e610c89",
  "customerId": "60d21b4667d0d8992e610c85",
  "paymentMethod": "MasterCard",
  "amount": 75.99,
  "currency": "USD",
  "paymentStatus": "Completed",
  "receiptUrl": "https://example.com/receipts/r789012.pdf",
  "createdAt": "2023-06-22T23:00:00.000Z",
  "updatedAt": "2023-06-23T00:00:00.000Z"
}
```

### Delete Transaction

```
DELETE /api/transactions/:id
```

**Response**

```json
{
  "message": "Transaction deleted successfully"
}
```