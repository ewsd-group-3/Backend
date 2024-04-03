import { Category } from '@prisma/client';

export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

export interface AuthStaff {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CategoryPercentage {
  category: Category;
  percentage: number;
}

export interface DepartmentPercentage {
  department: Department;
  percentage: number;
}

export interface TopActiveUsers {
  staff: Staff;
  ideasCount: number;
  commentsCount: number;
  votesCount: number;
  viewsCount: number;
  total: number;
}
