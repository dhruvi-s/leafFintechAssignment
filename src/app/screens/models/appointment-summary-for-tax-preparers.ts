export interface AppointmentSummaryForTaxPreparers {
  total_appointments: number;
  tax_preparer_count: number;
  document_drop_off_count: number;
  basic_in_person_count: number;
  advance_in_person_count: number;
  return_visit_count: number;
  total_hours: string;
  total_hours_booked: string;
  booking_percentage: string;
  total_hours_available: string;
  tax_preparer_name: string;
}

export interface AppointmentSummaryForTaxPreparersResponse {
  status: number;
  message: string;
  obj: AppointmentSummaryForTaxPreparers[];
}
