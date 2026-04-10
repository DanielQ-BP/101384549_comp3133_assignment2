import { gql } from '@apollo/client/core';

// ==================== AUTH ====================

// Backend login is a Query (not mutation), uses input: { usernameOrEmail, password }
export const LOGIN_MUTATION = gql`
  query Login($usernameOrEmail: String!, $password: String!) {
    login(input: { usernameOrEmail: $usernameOrEmail, password: $password }) {
      token
      message
      user {
        _id
        username
        email
      }
    }
  }
`;

// Backend signup is a Mutation, uses input: { username, email, password }
export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(input: { username: $username, email: $email, password: $password }) {
      token
      message
      user {
        _id
        username
        email
      }
    }
  }
`;

// ==================== EMPLOYEES ====================

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      gender
      salary
      department
      designation
      date_of_joining
      employee_photo
      created_at
    }
  }
`;

// Backend uses eid not id
export const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployeeById($eid: ID!) {
    getEmployeeById(eid: $eid) {
      _id
      first_name
      last_name
      email
      gender
      salary
      department
      designation
      date_of_joining
      employee_photo
      created_at
      updated_at
    }
  }
`;

// Backend query name: searchEmployeeByDesignationOrDepartment
export const SEARCH_EMPLOYEES = gql`
  query SearchEmployees($designation: String, $department: String) {
    searchEmployeeByDesignationOrDepartment(
      designation: $designation
      department: $department
    ) {
      _id
      first_name
      last_name
      email
      gender
      salary
      department
      designation
      date_of_joining
      employee_photo
    }
  }
`;

// Backend uses input wrapper
export const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String!
    $salary: Float!
    $department: String!
    $designation: String!
    $date_of_joining: String!
    $employee_photo: String
  ) {
    addEmployee(
      input: {
        first_name: $first_name
        last_name: $last_name
        email: $email
        gender: $gender
        salary: $salary
        department: $department
        designation: $designation
        date_of_joining: $date_of_joining
        employee_photo: $employee_photo
      }
    ) {
      _id
      first_name
      last_name
      email
      gender
      salary
      department
      designation
      date_of_joining
      employee_photo
    }
  }
`;

// Backend uses eid and input wrapper
export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $eid: ID!
    $first_name: String
    $last_name: String
    $email: String
    $gender: String
    $salary: Float
    $department: String
    $designation: String
    $date_of_joining: String
    $employee_photo: String
  ) {
    updateEmployee(
      eid: $eid
      input: {
        first_name: $first_name
        last_name: $last_name
        email: $email
        gender: $gender
        salary: $salary
        department: $department
        designation: $designation
        date_of_joining: $date_of_joining
        employee_photo: $employee_photo
      }
    ) {
      _id
      first_name
      last_name
      email
      gender
      salary
      department
      designation
      date_of_joining
      employee_photo
    }
  }
`;

// Backend deleteEmployee returns MessageResponse { message, success }
export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($eid: ID!) {
    deleteEmployee(eid: $eid) {
      message
      success
    }
  }
`;
