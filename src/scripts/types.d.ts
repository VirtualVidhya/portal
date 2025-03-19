export interface Application {
  id: string;
  full_name: string;
  age: number;
  dob: string;
  gender: string;
  employment_status: string;
  occupation: string;

  photo_url: string;
  photo_key: string;
  photo_iv: string;
  aadhar_url: string;
  aadhar_key: string;
  aadhar_iv: string;

  contact_no: string;
  email: string;
  parent_contact_no: string;
  curr_address: string;
  per_address: string;

  education: string;
  experience: string;

  course: string;
  academic_qual: string;
  skills: string;
  previous_training: string;

  reference: string;

  status: string;
}
