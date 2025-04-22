# Appointments API Documentation

## Base URL
All endpoints are prefixed with: `http://127.0.0.1:8000/api/`

## Authentication
All endpoints require authentication. Include the authentication token in the request header:
```
Authorization: Token <your_token>
```

## Endpoints

### 1. List/Create Appointments

#### List Appointments
- **URL**: `/appointments/`
- **Method**: `GET`
- **Description**: List all appointments
- **Query Parameters**:
  - `patient`: Filter by patient ID
  - `doctor`: Filter by doctor ID
  - `appointment_date`: Filter by date (YYYY-MM-DD)
  - `status`: Filter by status (scheduled/completed/canceled/in_queue)
  - `is_active`: Filter by active status (true/false)
- **Example Request**:
  ```bash
  GET /appointments/?patient=116&status=scheduled
  ```
- **Example Response**:
  ```json
  [
    {
      "appointment_id": "75f869bc-dbb2-44cb-9bf1-21726ce5c96d",
      "patient": {
        "id": 116,
        "first_name": "John",
        "last_name": "Doe",
        // ... other patient fields
      },
      "doctor": {
        "id": 1,
        "first_name": "Dr. Smith",
        "last_name": "MD",
        "specialization": "Cardiology",
        // ... other doctor fields
      },
      "appointment_date": "2024-03-20",
      "appointment_time": "14:30:00",
      "duration": 30,
      "status": "scheduled",
      "notes": "Initial consultation",
      "is_active": true,
      "created_by": {
        "id": 1,
        "email": "admin@example.com",
        "first_name": "Admin",
        "last_name": "User",
        "role": "manager"
      },
      "created_at": "2024-03-19T10:00:00Z",
      "updated_at": "2024-03-19T10:00:00Z"
    }
  ]
  ```

#### Create Appointment
- **URL**: `/appointments/`
- **Method**: `POST`
- **Description**: Create a new appointment
- **Request Body**:
  ```json
  {
    "patient_id": 116,
    "doctor_id": 1,
    "appointment_date": "2024-03-20",
    "appointment_time": "14:30:00",
    "duration": 30,
    "notes": "Initial consultation"
  }
  ```
- **Example Request**:
  ```bash
  POST /appointments/
  ```
- **Example Response**:
  ```json
  {
    "appointment_id": "75f869bc-dbb2-44cb-9bf1-21726ce5c96d",
    "patient": {
      // ... patient details
    },
    "doctor": {
      // ... doctor details
    },
    "appointment_date": "2024-03-20",
    "appointment_time": "14:30:00",
    "duration": 30,
    "status": "scheduled",
    "notes": "Initial consultation",
    "is_active": true,
    "created_by": {
      // ... creator details
    },
    "created_at": "2024-03-19T10:00:00Z",
    "updated_at": "2024-03-19T10:00:00Z"
  }
  ```

### 2. Appointment Detail

#### Get Appointment
- **URL**: `/appointments/{appointment_id}/`
- **Method**: `GET`
- **Description**: Get details of a specific appointment
- **Example Request**:
  ```bash
  GET /appointments/75f869bc-dbb2-44cb-9bf1-21726ce5c96d/
  ```
- **Example Response**: Same as create response

#### Update Appointment
- **URL**: `/appointments/{appointment_id}/`
- **Method**: `PUT/PATCH`
- **Description**: Update an existing appointment
- **Request Body**: Same as create, but all fields are optional
- **Example Request**:
  ```bash
  PATCH /appointments/75f869bc-dbb2-44cb-9bf1-21726ce5c96d/
  {
    "notes": "Updated consultation notes"
  }
  ```

#### Delete Appointment
- **URL**: `/appointments/{appointment_id}/`
- **Method**: `DELETE`
- **Description**: Soft delete an appointment (sets is_active=False)
- **Example Request**:
  ```bash
  DELETE /appointments/75f869bc-dbb2-44cb-9bf1-21726ce5c96d/
  ```

### 3. Appointment Actions

#### Cancel Appointment
- **URL**: `/appointments/{appointment_id}/cancel/`
- **Method**: `POST`
- **Description**: Mark an appointment as canceled
- **Example Request**:
  ```bash
  POST /appointments/75f869bc-dbb2-44cb-9bf1-21726ce5c96d/cancel/
  ```
- **Example Response**:
  ```json
  {
    "status": "appointment canceled"
  }
  ```

#### Complete Appointment
- **URL**: `/appointments/{appointment_id}/complete/`
- **Method**: `POST`
- **Description**: Mark an appointment as completed
- **Example Request**:
  ```bash
  POST /appointments/75f869bc-dbb2-44cb-9bf1-21726ce5c96d/complete/
  ```
- **Example Response**:
  ```json
  {
    "status": "appointment completed"
  }
  ```

## Permissions

### View Permissions
- All authenticated users can view appointments
- Doctors can only view their own appointments
- Managers and secretaries can view all appointments

### Create/Update/Delete Permissions
- Managers and secretaries can create/update/delete any appointment
- Doctors can only create/update/delete their own appointments
- Other users cannot create/update/delete appointments

## Error Responses

### 400 Bad Request
```json
{
    "error": "Your doctor profile is not set up. Please contact the administrator to complete your doctor profile setup."
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

### 409 Conflict
```json
{
    "appointment_time": "Doctor already has an appointment at this time"
}
``` 