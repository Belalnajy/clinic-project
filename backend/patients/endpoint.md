# Patient API Documentation

## Base URL
All endpoints are prefixed with: `http://127.0.0.1:8000/api/`

## Authentication
All endpoints require authentication. Include the authentication token in the request header:
```
Authorization: Token <your_token>
```

## Pagination
List endpoints support pagination with the following parameters:
- `page`: The page number to retrieve (default: 1)
- `page_size`: Number of items per page (default: 10, max: 50)

## Endpoints

### 1. Patient Management

#### List Patients
- **URL**: `/patients/`
- **Method**: `GET`
- **Description**: List all patients with pagination support
- **Query Parameters**:
  - `is_active`: Filter by active status (true/false)
  - `search`: Search patients by first name or last name (case-insensitive)
  - `page`: Page number (default: 1)
  - `page_size`: Number of items per page (default: 10, max: 50)
- **Example Requests**:
  ```bash
  # Get all active patients
  GET /patients/
  
  # Search for patients by name
  GET /patients/?search=john
  
  # Get inactive patients
  GET /patients/?is_active=false
  
  # Search with pagination
  GET /patients/?search=smith&page=1&page_size=20
  ```
- **Example Response**:
  ```json
  {
    "count": 100,
    "next": "http://127.0.0.1:8000/api/patients/?page=2&page_size=20",
    "previous": null,
    "results": [
      {
        "patient_id": "uuid",
        "first_name": "John",
        "last_name": "Doe",
        "birth_date": "1990-01-01",
        "gender": "M",
        "email": "john.doe@example.com",
        "phone_number": "+1234567890",
        "address": "123 Main St",
        "city": "New York",
        "blood_type": "A+",
        "height": 180.00,
        "weight": 75.00,
        "insurance_provider": "Blue Cross",
        "insurance_number": "INS123456",
        "insurance_expiration_date": "2024-12-31",
        "is_active": true,
        "created_at": "2024-03-19T10:00:00Z",
        "updated_at": "2024-03-19T10:00:00Z",
        "created_by": {
          "id": 1,
          "email": "admin@example.com",
          "first_name": "Admin",
          "last_name": "User",
          "role": "manager"
        }
      }
    ]
  }
  ```

// ... rest of the existing documentation ... 