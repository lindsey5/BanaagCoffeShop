export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role_id: string;
    role: string;
    createdAt: Date;
}

export interface CreateUserDTO {
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    role_id: string;
}