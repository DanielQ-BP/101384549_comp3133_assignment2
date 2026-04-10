# 101413749_comp3133_assignment2

**Student ID:** 101413749  
**Course:** COMP 3133 — Full Stack Development  
**College:** George Brown College  
**Assignment:** 2 — Angular Frontend with GraphQL

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://your-frontend-url.vercel.app |
| Backend  | https://your-backend-url.railway.app |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17 (Standalone Components) |
| GraphQL Client | Apollo Angular 6 + @apollo/client 3 |
| UI Library | Angular Material 17 |
| Styling | SCSS + CSS Custom Properties |
| Routing | Angular Router (lazy-loaded + Guards) |
| Forms | Angular Reactive Forms |
| Auth | JWT via AuthService (Angular Signals) |
| Pipes | `SalaryFormatPipe`, `InitialsPipe`, `DatePipe` |
| Directives | `HighlightDirective` (custom row highlight) |
| Docker | Multi-stage build + nginx + docker-compose |
| Backend | Node.js + Express + Apollo Server (Assignment 1) |
| Database | MongoDB |

---

## Screens

| # | Screen | Route | Auth Required |
|---|--------|-------|---------------|
| 1 | Login | `/login` | No |
| 2 | Signup | `/signup` | No |
| 3 | Employee List | `/employees` | Yes |
| 4 | Add Employee | `/employees/add` | Yes |
| 5 | Edit Employee | `/employees/edit/:id` | Yes |
| 6 | View Employee | `/employees/:id` | Yes |

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/               # Login screen
│   │   ├── signup/              # Signup screen
│   │   ├── navbar/              # Shared navbar + logout
│   │   ├── employee-list/       # List + search + delete
│   │   ├── employee-add/        # Add employee + photo upload
│   │   ├── employee-edit/       # Edit employee
│   │   ├── employee-detail/     # View employee details
│   │   └── confirm-dialog/      # Delete confirmation dialog
│   ├── services/
│   │   ├── auth.service.ts      # JWT session (Angular Signals)
│   │   └── employee.service.ts  # All GraphQL CRUD operations
│   ├── guards/
│   │   ├── auth.guard.ts        # Protect authenticated routes
│   │   └── login.guard.ts       # Redirect logged-in users
│   ├── pipes/
│   │   ├── salary-format.pipe.ts  # Custom currency pipe
│   │   └── initials.pipe.ts       # Avatar initials pipe
│   ├── directives/
│   │   └── highlight.directive.ts # Table row hover highlight
│   ├── models/
│   │   └── employee.model.ts    # TypeScript interfaces
│   └── graphql/
│       └── queries.ts           # All GQL queries & mutations
```

---

## Features & Evaluation Coverage

| Criteria | Implementation |
|----------|---------------|
| Deploy backend | Docker Compose + Dockerfile in `/backend` |
| Deploy frontend | Docker Compose + Dockerfile + nginx |
| GitHub repo | Proper commits, README, collaborator added |
| Login/Signup/Logout | Reactive forms, JWT, GraphQL mutations |
| Employee List | Material table, pagination, sort, search |
| Add Employee | Full validation, photo upload, date picker |
| View/Update Employee | Pre-filled form, all validation messages |
| Search by dept/position | GraphQL `searchEmployeeByDesignationOrDepartment` |
| Delete Employee | Confirmation dialog, snackbar feedback |
| UI/UX | Angular Material 17, custom SCSS design system |
| Services/Pipes/Directives/Forms/Routing | All implemented |

---

## Validation Rules

| Field | Rule |
|-------|------|
| Username | Required, min 3 chars, alphanumeric + underscore only |
| Email | Required, valid email format |
| Password | Required, min 6 characters |
| Confirm Password | Must match password |
| First/Last Name | Required, min 2 characters |
| Gender | Required, select from list |
| Salary | Required, minimum $1,000 |
| Department | Required, select from list |
| Designation | Required, select from list |
| Date of Joining | Required, valid date |

---

## Running Locally

### Prerequisites
- Node.js 20+
- Angular CLI 17: `npm install -g @angular/cli`
- Backend running on port 4000

### Backend (Assignment 1)
```bash
cd employee-management-system
npm install
npm start
# → http://localhost:4000/graphql
```

### Frontend
```bash
cd 101413749_comp3133_assignment2
npm install
npx ng serve
# → http://localhost:4200
```

---

## Docker (Full Stack)

```
studentID_comp3133_assignment/
├── docker-compose.yml
├── frontend/    ← this project
└── backend/     ← employee-management-system
```

```bash
docker-compose up --build
# Frontend → http://localhost:4200
# Backend  → http://localhost:4000/graphql
```

---

## Screenshots

> Add screenshots to `/screenshots` folder and link them here for D2L submission.

| Screen | Preview |
|--------|---------|
| Login | `screenshots/login.png` |
| Signup | `screenshots/signup.png` |
| Employee List | `screenshots/employee-list.png` |
| Add Employee | `screenshots/add-employee.png` |
| Edit Employee | `screenshots/edit-employee.png` |
| View Employee | `screenshots/view-employee.png` |
| Search | `screenshots/search.png` |
| Delete Confirm | `screenshots/delete.png` |

---

## GitHub Repository

**Repo:** `101413749_comp3133_assignment2`  
**Collaborator:** `pritamworld`
