export interface Employee {
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  manager_privileges: boolean,
  profile_picture: string,
  remaining_pto: number,
  used_pto: number,
  national_holidays: string
}

export interface Request {
  id: string,
  employee_id: string,
  status: string,
  type: string,
  start_date: string,
  end_date: string,
  approver: string,
  full_name?: string,
  color?: string
}