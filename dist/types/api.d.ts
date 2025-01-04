export interface ApiResponse<T = any> {
    data?: T;
    error?: {
        code?: string;
        message: string;
    };
}
export interface Project {
    id: string;
    name: string;
    description?: string;
    author_id: string;
    created_at: string;
    updated_at: string;
}
export interface CreateProjectRequest {
    name: string;
    description?: string;
    author_id: string;
}
export interface ProjectApiResponse {
    success: Project[];
}
export interface GetAllProjectsQuery {
    author_id: string;
}
export interface Folder {
    id: string;
    name: string;
    description?: string;
    project_id: string;
    created_at: string;
}
export interface CreateFolderRequest {
    name: string;
    description?: string;
    project_id: string;
}
export interface FolderApiResponse {
    success: Folder[];
}
export interface GetAllFoldersQuery {
    project_id: string;
}
export interface Submission {
    id: string;
    name: string;
    url?: string;
    folder_id: string;
    created_at: string;
}
export interface GetAllSubmissionsQuery {
    folder_id: string;
}
export interface SubmissionApiResponse {
    success: Submission[];
}
export interface CustomUser {
    id: number;
    name: string;
    email: string;
}
export interface UserSlice {
    user: {
        data: CustomUser | null;
        loading: boolean;
        error: string | null;
    };
    setUser: (userData: CustomUser | null) => void;
    setUserLoading: (loading: boolean) => void;
    setUserError: (error: string | null) => void;
    clearUser: () => void;
}
export type StoreState = UserSlice;
export interface AskApiRequest {
    query: string;
    folder_id: string;
}
export interface AskApiResponse {
    response: string;
    context: string;
}
export interface UploadApiRequest {
    folder_id: string;
}
export interface AskApiResponse {
    response: string;
    context: string;
}
