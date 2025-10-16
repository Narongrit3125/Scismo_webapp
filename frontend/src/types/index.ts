export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'EDITOR' | 'MEMBER' | 'STAFF';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  title: string;
  content: string;
  type: 'NEWS' | 'ACTIVITY' | 'ANNOUNCEMENT';
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  slug: string;
  viewCount: number;
  image?: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  authorId: string;
  projectId?: string;
  category: string;
  type: 'WORKSHOP' | 'SEMINAR' | 'COMPETITION' | 'VOLUNTEER' | 'SOCIAL' | 'TRAINING' | 'MEETING' | 'CEREMONY' | 'FUNDRAISING' | 'EXHIBITION';
  startDate: string;
  endDate?: string;
  location?: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'PLANNING' | 'OPEN_REGISTRATION' | 'FULL' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isPublic: boolean;
  requirements?: string;
  budget?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  image?: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  project?: Project;
}

export interface Project {
  id: string;
  code: string; // รหัสโครงการ
  title: string;
  description: string;
  shortDescription?: string;
  authorId: string;
  year: number;
  status: 'PLANNING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate: string;
  endDate: string;
  totalBudget?: number;
  usedBudget: number;
  objectives?: string;
  targetGroup?: string;
  expectedResults?: string;
  sponsor?: string;
  coordinator?: string;
  isActive: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  activities: Activity[];
  reports: ProjectReport[];
}

export interface ProjectReport {
  id: string;
  projectId: string;
  title: string;
  content: string;
  reportType: 'PROGRESS' | 'FINANCIAL' | 'FINAL' | 'EVALUATION';
  reportDate: string;
  submittedBy: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  project: Project;
}

export interface Document {
  id: number;
  file_name: string;
  file_path: string;
  uploaded_at: string;
}

export interface Position {
  id: number;
  position_name: string;
}

export interface Member {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  major?: string;
  year?: number;
  position?: number;
  position_name?: string;
  email?: string;
  phone?: string;
  image?: string;
  created_at: string;
}