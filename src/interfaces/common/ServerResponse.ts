export default interface ServerResponse<T = any> {
    success: boolean;
    error?: string;
    data?: T;
}