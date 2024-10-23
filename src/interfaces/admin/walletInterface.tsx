

export interface adminWalletCountryInterface {
    id: number;

    title: string, 
    tag: string,

    created_on: string,
    updated_on: string,
}


export interface adminWalletInterface {
    id?: number;

    select_county?: adminWalletCountryInterface | number,

    start_range?: number | null,

    start_sign_of_the_expression?: string,

    end_sign_of_the_expression?: string,

    end_range?: number | null,

    coefficient?: number | string,

    created_on?: string,
    updated_on?: string,

}

export interface adminWalletPay {
    id: number;

    number: number;
    cost: number;

    select_country: adminWalletCountryInterface;

    created_on?: string,
    updated_on?: string,
}