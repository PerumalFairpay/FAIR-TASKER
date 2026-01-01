# Attendance System - Technical Workflow & Architecture

## 1. Overview

The Attendance System is a comprehensive module designed to track employee work hours, status (Present/Absent), and support different device types (Web, Biometric, Mobile). It features role-based access control, allowing Admins to monitor all records while Employees can only manage their own attendance.

---

## 2. Architecture & Tech Stack

### Backend (FastAPI)

- **Database**: MongoDB (Collection: `attendance`)
- **Framework**: FastAPI
- **Authentication**: JWT Token based (Cookie)
- **Libraries**:
  - `motor`: Async MongoDB driver
  - `pydantic`: Data validation
  - `datetime`: Time calculations

### Frontend (Next.js)

- **State Management**: Redux + Redux-Saga
- **UI Framework**: HeroUI + TailwindCSS
- **Date Handling**: `date-fns` for rendering, standard `Date` objects for logic.
- **Icons**: `lucide-react`

---

## 3. Data Flow & Logic

### A. Clock In Flow

1. **User Action**: Employee clicks "Clock In".
2. **Frontend**:
   - `clockInRequest` action is dispatched.
   - Payload includes: `date`, `clock_in` timestamp, `device_type`, `location`.
3. **Backend (`POST /attendance/clock-in`)**:
   - Middleware verifies JWT token & extracts `employee_id`.
   - Checks if a record already exists for the current `date` and `employee_id`.
   - **Validation**: If record exists, returns 400 (Prevent double punch).
   - **Creation**: Inserts new document with `status="Present"`.
4. **Response**: Returns success message and created record.
5. **Frontend Update**: Redux store updates, UI shows "Clock Out" button.

### B. Clock Out Flow

1. **User Action**: Employee clicks "Clock Out".
2. **Frontend**:
   - `clockOutRequest` action is dispatched.
   - Payload includes: `clock_out` timestamp.
3. **Backend (`PUT /attendance/clock-out`)**:
   - Finds today's record for `employee_id`.
   - Updates `clock_out` field.
   - **Calculation**: Computes `total_work_hours` = `clock_out` - `clock_in`.
   - Updates record in MongoDB.
4. **Response**: Returns updated record with total hours.
5. **Frontend Update**: UI changes to "Done for Today", Table updates with Work Hours.

### C. Viewing History (Role-Based)

The frontend (`list_dir/app/attendance/page.tsx`) intelligently switches data sources based on role:

| Role         | API Endpoint                 | Redux Action                    | Data Scope             | UI Controls            |
| ------------ | ---------------------------- | ------------------------------- | ---------------------- | ---------------------- |
| **Employee** | `GET /attendance/my-history` | `getMyAttendanceHistoryRequest` | Only own records       | Can Clock In/Out       |
| **Admin**    | `GET /attendance/`           | `getAllAttendanceRequest`       | All employees' records | Read-only (Table View) |

---

## 4. Work Hours Calculation Logic

**Formula**:

```python
total_work_hours = (clock_out_time - clock_in_time).total_seconds() / 3600
```

- The backend handles this calculation dynamically during the Clock Out event.
- Break times can be subtracted if the `break_start` and `break_end` features are used (currently foundational).

---

## 5. Security & Validation

- **Authentication**: All endpoints are protected by `verify_token`.
- **Authorization**: Admin routes (like viewing all attendance) are implicitly protected by the nature of the data returned; future improvements can enforce strict role checks on the backend for the `get_all` endpoint.
- **Data Integrity**: MongoDB ObjectIDs are validated; duplicate daily entries are prevented at the logic level.

## 6. Frontend State Management (Redux)

- **Store Path**: `store/attendance/`
- **Actions**:
  - `CLOCK_IN_xxx`
  - `CLOCK_OUT_xxx`
  - `GET_MY_ATTENDANCE_HISTORY_xxx`
  - `GET_ALL_ATTENDANCE_xxx`
- **Sagas**: Handle async API calls and side effects (toast notifications).

## 7. Future Enhancements

- **Biometric Integration**: The backend supports `device_type="Biometric"`. A physical device API can push to the `/clock-in` endpoint.
- **Geolocation**: The `location` field is currently static/placeholder. Can be integrated with the browser's Geolocation API.
- **Reports**: Export features (CSV/PDF) for Admin.
