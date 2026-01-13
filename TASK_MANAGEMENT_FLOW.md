# Task Management Flow Documentation

This document outlines the complete Task Management lifecycle, from task creation to End-of-Day (EOD) reporting and historical tracking within the Fair Tasker application.

## 1. Overview

The Task Management module is a comprehensive system designed for tracking daily work progress, managing project deadlines, and maintaining a historical audit trail of employee performance.

- **Frontend Route**: `/task/board` (Kanban), `/task/reports` (History Table)
- **Backend Prefix**: `/tasks`

---

## 2. The Task Lifecycle

### Phase 1: Creation & Assignment

- **Creator**: Admin or Project Manager.
- **Component**: `AddEditTaskDrawer`.
- **Fields**: Project selection, Task Name, Priority (Low, Medium, High, Urgent), Start/End Dates, and Tags.
- **Assignment**: Multiple employees can be assigned to a single task using the Multi-Select field.

### Phase 2: Daily Workflow (Kanban Board)

- **View**: A Trello-like interface with four columns:
  - **To Do**: Tasks pending action.
  - **In Progress**: Tasks currently being worked on.
  - **Completed**: Tasks finished by the team.
  - **Moved/Rollover**: Historical indicator for tasks that weren't finished and were pushed to a future date.
- **Interaction**: Users can drag and drop tasks between columns to update their status instantly in the database.

---

## 3. End-of-Day (EOD) Reporting

The EOD flow is the most critical part of the system, ensuring accountability and progress tracking.

### The EOD Process

1. **Trigger**: Employee clicks the **"EOD Report"** button on the Task Board.
2. **Drawer**: The `EodReportDrawer` opens, automatically listing all active tasks (excluding "Completed" or already "Moved" ones).
3. **Data Entry**: For each task, the employee provides:
   - **Status Update**: Current state (e.g., still "In Progress" or now "Completed").
   - **Progress %**: A slider or input (0-100%).
   - **EOD Summary**: A detailed text description of what was achieved that day.
   - **Move to Tomorrow (Rollover)**: A checkbox to signal that work will continue on the next business day.

### Backend Processing (`process_eod_report`)

When submitted, the backend performs several actions:

- **Historical Snapshot**: Every submission creates a permanent entry in the task's `eod_history` array, including a timestamp and sub-progress.
- **Status Sync**: Updates the parent task's `status` and `progress`.
- **Rollover Logic**: If "Move to Tomorrow" is checked:
  - The current task's status is set to **"Moved"**.
  - A **duplicate task** is created with the start/end date set to tomorrow.
  - This new task inherits the previous progress, attachments, and assignments, appearing in the "To Do" column the next morning.

---

## 4. Reporting & Auditing

For Managers and Admins to review work across the entire company.

- **Page**: `EOD Reports` (`/task/reports`).
- **Feature**: A flattened table view that extracts data from the nested `eod_history` of every task in the system.
- **Key Data Points**:
  - **Date & Time**: Exact moment of submission.
  - **Project & Task**: Human-readable names (resolved from IDs).
  - **Employee**: The name of the assignee who submitted the report.
  - **Status & Progress**: Visual chips and progress bars.
  - **Work Summary**: The specific text submitted by the employee.

---

## 5. Technical Implementation Details

### Data Models (Pydantic)

- `TaskBase`: Core task structure.
- `EODReportItem`: Structure for a single EOD entry within a bulk submission.
- `EODReportRequest`: List of `EODReportItem`.

### Database Schema (MongoDB)

- **Collection**: `tasks`
- **History Field**:
  ```json
  "eod_history": [
    {
      "date": "2023-10-27",
      "status": "In Progress",
      "progress": 65.0,
      "summary": "Finished the UI layout, started API integration.",
      "timestamp": "ISO-Date-Time"
    }
  ]
  ```

### Key API Endpoints

- `GET /tasks/`: Fetches board tasks.
- `POST /tasks/eod-report`: Processes daily submissions.
- `GET /tasks/eod-reports`: Fetches the flattened historical view.
