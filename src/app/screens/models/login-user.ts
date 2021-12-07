export interface LoginUser {
  user_id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  zip_code: string;
  contact_no?: any;
  email: string;
  level: string;
  created_by: number;
  created_date: string;
  updated_date?: any;
  is_deleted: number;
  deleted_date?: any;
  sites?: any;
  site?: any;
}

export interface LoginUserInterface {
  status: number;
  message: string;
  obj: LoginUser;
}
