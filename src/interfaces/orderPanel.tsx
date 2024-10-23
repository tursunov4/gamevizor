import { adminWalletPay } from "./admin/walletInterface";
import { ProductInterface } from "./productInterface";
import UserInterface from "./userInterface";

export interface OrderPanelProp {
    id?: number,
    product?: ProductInterface,
    wallet?: adminWalletPay,
    created_on: string;
    cost: string;
    max_cost: null | number;
    status: string;
    info_for_complete: string;

    is_deluxe: boolean;

    user: UserInterface

    subscription_status: string,

    promocode?: {
        title: string
    }

    feedback? : {
        text: string;
        answer: string;
        created_on: string;
        updated_on: string
        rating:  number;
    }

    chat : {
        id: number,
        last_message: string;
        counter_no_read_message: number;
    }
    platform : {
        id: number;
        title: string;
    }
    
}

export enum StatusKeys {
    WAITING = 'Ожидание',
    COMPLETED = 'Выполнен',
    CANCELED = 'Отменено'
}

export enum BackgroundStatusKeys {
    WAITING = '#FFA319',
    COMPLETED = '#159338',
    CANCELED = '#FF1E61'
}