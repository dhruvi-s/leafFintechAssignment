export interface SiteResponse {
    status: number;
    message: string;
    obj: DataSite[];
  }
  
  export interface DataSite {
    site_id: number;
    address:string;
    site_name: string;
    zip_code: string;
    updated_date: string;
    is_deleted: number;
    created_date: string;
    deleted_date: string;
  }
  