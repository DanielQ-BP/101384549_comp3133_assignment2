import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map, catchError, throwError } from 'rxjs';
import {
  GET_ALL_EMPLOYEES,
  GET_EMPLOYEE_BY_ID,
  SEARCH_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
} from '../graphql/queries';
import { Employee, EmployeeInput } from '../models/employee.model';

interface MessageResponse {
  message: string;
  success: boolean;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo
      .query<{ getAllEmployees: Employee[] }>({ query: GET_ALL_EMPLOYEES })
      .pipe(
        map((r) => r.data.getAllEmployees),
        catchError((e) => throwError(() => this.extractError(e)))
      );
  }

  // Backend uses eid
  getEmployeeById(eid: string): Observable<Employee> {
    return this.apollo
      .query<{ getEmployeeById: Employee }>({
        query: GET_EMPLOYEE_BY_ID,
        variables: { eid },
      })
      .pipe(
        map((r) => r.data.getEmployeeById),
        catchError((e) => throwError(() => this.extractError(e)))
      );
  }

  // Backend query: searchEmployeeByDesignationOrDepartment
  searchEmployees(department?: string, designation?: string): Observable<Employee[]> {
    return this.apollo
      .query<{ searchEmployeeByDesignationOrDepartment: Employee[] }>({
        query: SEARCH_EMPLOYEES,
        variables: { designation, department },
      })
      .pipe(
        map((r) => r.data.searchEmployeeByDesignationOrDepartment),
        catchError((e) => throwError(() => this.extractError(e)))
      );
  }

  addEmployee(input: EmployeeInput): Observable<Employee> {
    return this.apollo
      .mutate<{ addEmployee: Employee }>({
        mutation: ADD_EMPLOYEE,
        variables: { ...input },
      })
      .pipe(
        map((r) => r.data!.addEmployee),
        catchError((e) => throwError(() => this.extractError(e)))
      );
  }

  // Backend uses eid
  updateEmployee(eid: string, input: Partial<EmployeeInput>): Observable<Employee> {
    return this.apollo
      .mutate<{ updateEmployee: Employee }>({
        mutation: UPDATE_EMPLOYEE,
        variables: { eid, ...input },
      })
      .pipe(
        map((r) => r.data!.updateEmployee),
        catchError((e) => throwError(() => this.extractError(e)))
      );
  }

  // Backend uses eid and returns MessageResponse
  deleteEmployee(eid: string): Observable<MessageResponse> {
    return this.apollo
      .mutate<{ deleteEmployee: MessageResponse }>({
        mutation: DELETE_EMPLOYEE,
        variables: { eid },
      })
      .pipe(
        map((r) => r.data!.deleteEmployee),
        catchError((e) => throwError(() => this.extractError(e)))
      );
  }

  private extractError(err: any): Error {
    const msg =
      err?.graphQLErrors?.[0]?.message ||
      err?.networkError?.message ||
      err?.message ||
      'An error occurred';
    return new Error(msg);
  }
}
