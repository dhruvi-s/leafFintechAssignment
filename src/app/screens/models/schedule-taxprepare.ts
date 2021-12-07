export interface ScheduleTaxpreparer {
    event_id: number;
    category_id: number;
    preparer_name: string;
    site_name: string;
    event_title: string;
    event_description: string;
    event_type: number;
    event_organizer_detail?: any;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    event_weeks?: any;
    event_max_people_count: number;
    event_color?: any;
    event_frequency: number;
    conference_link?: any;
    location?: any;
    unique_code?: any;
    image_list?: any;
    added_date: number;
    added_by: number;
    status: number;
    category_name?: any;
    event_name?: any;
    zip_code?: any;
    site_id: number;

}

export interface ScheduleTaxpreparerResponse {

    status: number;
    message: string;
    obj: ScheduleTaxpreparer[];
}
