export interface CoverLetterState {
  user_id: string;
  current_step: string;
  job_keywords?: string;
  experience?: string;
  motivation?: string;
  cover_letter?: string;
  is_completed: boolean;
}
export interface CoverLetterResponse {
  message: string;
  state: CoverLetterState;
  cover_letter?: string;
  pdf_path?: string;
}
