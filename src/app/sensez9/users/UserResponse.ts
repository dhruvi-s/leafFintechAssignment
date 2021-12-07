export interface UsersResponse {
  status: number;
  message: string;
  obj: DataUsers[];
}

export interface DataUsers {
  user_id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  zip_code: string;
  contact_no: string;
  email: string;
  level: string;
  created_by: number;
  updated_date: string;
  is_deleted: number;
  created_date: string;
  deleted_date: string;
  sites: {
    created_date: string;
    site_id: number;
    site_name: string;
    user_id: number;
    user_site_mapping_id: number;
  };
}
