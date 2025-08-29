export interface ServiceResponse<T = any> {
    status: boolean;
    message: string;
    data?: T;
}
