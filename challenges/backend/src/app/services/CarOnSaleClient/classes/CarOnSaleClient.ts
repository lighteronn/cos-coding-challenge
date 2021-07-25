import { ICarOnSaleClient } from '../interface/ICarOnSaleClient'
import axios, { AxiosInstance } from 'axios'
import { injectable } from 'inversify'
import 'reflect-metadata'
import { IRunningAuctions } from '../interface/IAuctionData'
import { IAuthService } from '../interface/IAuthService'

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
    private readonly instance: AxiosInstance
    public constructor() {
        this.instance = axios.create({
            timeout: 1500,
            baseURL: 'https://api-core-dev.caronsale.de/api',
        })
    }
    public async authService(userMailId: string, password: string): Promise<IAuthService> {
        const result = await this.instance
            .put(`/v1/authentication/${userMailId}`, { password })
            .catch(err => {
                throw err
            })

        return result.data
    }
    public async getRunningAuctions(token: string, userId: string): Promise<IRunningAuctions> {
        const result = await this.instance
            .get<IRunningAuctions>('/v2/auction/buyer/', {
                headers: {
                    authtoken: token,
                    userid: userId,
                },
            })
            .catch(err => {
                throw err
            })

        const { items, total } = result.data
        return { items, total }
    }
}
