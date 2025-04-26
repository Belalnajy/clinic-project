# Chatbot Permission Test Cases

## Test Cases for Manager Role

### Patient Data Tests

1. "Show me all patients in the clinic"

   - Expected: Full list of all patients with complete details
   - Should see: IDs, names, gender, blood type, active status

2. "Get medical records for patient ID-123"

   - Expected: Complete medical history
   - Should see: All diagnoses, treatments, medications

3. "Show me inactive patients"
   - Expected: List of all inactive patients
   - Should see: Full patient details

### Appointment Tests

1. "List all appointments for today"

   - Expected: All appointments across all doctors
   - Should see: Patient names, doctors, times, status

2. "Show me Dr. Smith's appointments"

   - Expected: All appointments for specific doctor
   - Should see: Complete appointment details

3. "Get cancelled appointments this week"
   - Expected: All cancelled appointments
   - Should see: Full appointment details with cancellation reasons

### Medication Tests

1. "Show all medications in the system"

   - Expected: Complete medication list
   - Should see: Names, categories, descriptions

2. "List medications prescribed this month"
   - Expected: All prescriptions
   - Should see: Medication details, prescribing doctors, patients

### Doctor Tests

1. "Show me all doctors and their specializations"

   - Expected: Complete doctor list
   - Should see: Names, specializations, license numbers, status

2. "Get inactive doctors"
   - Expected: List of inactive doctors
   - Should see: Full doctor details

## Test Cases for Doctor Role

### Patient Data Tests

1. "Show me my patients"

   - Expected: Only their assigned patients
   - Should NOT see: Other doctors' patients

2. "Get medical records for patient ID-123"

   - Expected: Records only if patient is assigned to them
   - Should see: Error message if not their patient

3. "List all patients in the clinic"
   - Expected: Access denied message
   - Should NOT see: Other doctors' patients

### Appointment Tests

1. "Show my appointments today"

   - Expected: Only their appointments
   - Should see: Their patient appointments only

2. "List all clinic appointments"
   - Expected: Access denied message
   - Should NOT see: Other doctors' appointments

### Medication Tests

1. "Show all medications"

   - Expected: Complete medication list
   - Should see: All medication information

2. "List available medications"
   - Expected: Full access to medication database
   - Should see: All medication details

### Doctor Tests

1. "Show all doctors"
   - Expected: Basic list of all doctors
   - Should see: Names and specializations only

## Test Cases for Secretary Role

### Patient Data Tests

1. "Show patient ID-123"

   - Expected: Basic patient information only
   - Should see: ID, name, active status
   - Should NOT see: Medical history, detailed records

2. "List all patients"
   - Expected: Basic list of patients
   - Should see: Basic info only

### Appointment Tests

1. "Show all appointments today"

   - Expected: Complete appointment list
   - Should see: All appointment details

2. "Get next week's schedule"
   - Expected: Full schedule
   - Should see: All appointments

### Medication Tests

1. "Show medications"
   - Expected: Access denied message
   - Should NOT see: Medication information

### Doctor Tests

1. "List all doctors"
   - Expected: Basic doctor information
   - Should see: Names, specializations, availability

## Error Cases to Test

1. Unauthorized Access:

   - Try accessing other doctors' patients
   - Attempt to view unauthorized medical records
   - Request financial data without permission

2. Invalid Queries:

   - Use incorrect patient IDs
   - Request non-existent appointments
   - Ask for invalid date ranges

3. Edge Cases:
   - Empty result sets
   - Very large data requests
   - Special characters in names/IDs

## Testing Instructions

1. Login with different role accounts:

   - Manager account
   - Doctor account
   - Secretary account

2. For each test case:

   - Copy the exact query
   - Paste into chatbot
   - Verify the response matches expected results
   - Check that unauthorized data is not shown

3. Document any:

   - Unexpected responses
   - Missing data
   - Incorrect permissions
   - Error messages

4. Report issues with:
   - Screenshot of the query
   - Expected vs actual result
   - User role used
   - Any error messages received
