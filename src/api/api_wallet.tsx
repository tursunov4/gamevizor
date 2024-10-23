import axios from "axios";
import { response } from "express";



export const api_wallet_get_cost = async (number: number, country_tag: number) => {
    try {
        const response = await axios.get('/api/v1/wallet/get_cost/',
            {
                params: {
                    number: number,
                    country_tag: country_tag
                }
            });
        return { cost: parseInt(response.data.cost), status: 200 }
    } catch (error: any) {
        return { cost: number, status: 404 }
    }
}