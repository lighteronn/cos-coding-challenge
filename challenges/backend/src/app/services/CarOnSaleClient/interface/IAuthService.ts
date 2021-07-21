export interface IAuthService {
    getUserToken():Promise<string>
}