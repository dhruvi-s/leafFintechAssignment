export interface Site {
  site_id: number;
  site_name: string;
  zip_code: string;
  address?: any;
  created_date: string;
  updated_date?: any;
  is_deleted: number;
  deleted_date?: any;
}
export interface SiteResponse {
  status: number;
  message: string;
  obj: Site[];
}
