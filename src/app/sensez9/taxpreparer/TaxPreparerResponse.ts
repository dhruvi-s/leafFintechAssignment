export interface TaxResponse {
    status: number;
    message: string;
    obj: DataTax[];
  }
  
  export interface DataTax {
    preparer_id: number;
    preparer_name: string;
    preparer_contactno?: string;
    preparer_email?: string;
    preparer_zipcode?: string;
    status?: number;
    added_by?: Number;
    updated_date?: string;
    is_deleted?: number;
    created_date?: string;
    deleted_date?: string;
    site_id?:number;
    supportedTaxTypes?: {
      international: number;
      military: number;
      spanish: number;
    };
    sites?: {
      created_date?: string;
      site_id?: number;
      site_name?: string;
      tax_preparer_site_mapping_id: number;
      preparer_id: number;
    };
    taxType?: {
        tax_type_id: number,
        preparer_id: number,
        document_drop_off: number,
        document_drop_off_time: string,
        basic_in_person: number ,
        basic_in_person_time:string,
        advance_in_person: number,
        advance_in_person_time: string,
        return_visit: number,
        return_visit_time: string,
        created_date:string
    },
  }
  