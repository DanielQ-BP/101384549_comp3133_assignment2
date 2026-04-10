export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  salary: number;
  department: string;
  designation: string;
  date_of_joining: string;
  employee_photo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeInput {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  salary: number;
  department: string;
  designation: string;
  date_of_joining: string;
  employee_photo?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthPayload {
  token: string;
  message: string;
  user: User;
}
