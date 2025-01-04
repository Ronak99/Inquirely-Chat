import type { Project, CreateProjectRequest, ProjectApiResponse, GetAllProjectsQuery, CreateFolderRequest, FolderApiResponse, GetAllFoldersQuery, GetAllSubmissionsQuery, SubmissionApiResponse, AskApiRequest, AskApiResponse } from "../types/api";
export declare const projectsApi: {
    create: (data: CreateProjectRequest) => Promise<ProjectApiResponse>;
    getAll: (query?: GetAllProjectsQuery) => Promise<ProjectApiResponse>;
    getById: (id: string) => Promise<ProjectApiResponse>;
    update: (id: string, data: Partial<CreateProjectRequest>) => Promise<Project>;
    delete: (id: string) => Promise<void>;
};
export declare const foldersApi: {
    create: (data: CreateFolderRequest) => Promise<FolderApiResponse>;
    getAll: (query?: GetAllFoldersQuery) => Promise<FolderApiResponse>;
    getById: (id: string) => Promise<FolderApiResponse>;
};
export declare const submissionsApi: {
    getAll: (query?: GetAllSubmissionsQuery) => Promise<SubmissionApiResponse>;
    getById: (id: string) => Promise<SubmissionApiResponse>;
};
export declare const askApi: {
    ask: (data: AskApiRequest) => Promise<AskApiResponse>;
};
export declare const uploadApi: {
    ask: (data: AskApiRequest) => Promise<AskApiResponse>;
};
export declare const testApi: {
    getAll: () => Promise<Project[]>;
};
