export interface UserDTO{
  id: number;
  "username": string;
  "fullname": string;
  "email": string;
  password: string;
  role: string;

  isEditing?: boolean;
  isUpdating?: boolean;
}
