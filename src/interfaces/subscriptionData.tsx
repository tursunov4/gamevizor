export interface subscriptionsPanelProp {
    id?: number,
    subscription: {
        id: number;
        title: string;
        image_url: string;
        

        description: string;
        cost: string;
        discount: string;
        subtitle: string;
    };
    created_on: string;
    cost: string;
    subscription_status: string;
    info_for_complete: string;

    feedback? : {
        text: string;
        answer: string;
        created_on: string;
        updated_on: string
        rating:  number;
    }
    
}

export enum StatusKeys {
    EXPIRES = 'Истекает',
    ACTIVE = 'Активна',
    COMPLETED = 'Завершено'
}

export enum BackgroundStatusKeys {
    EXPIRES = '#FFA319',
    ACTIVE = '#159338',
    CANCELED = '#FF1E61'
}


export interface subscriptionProp {
    id: number,
    title: string;
    duration: string;
    cost: number;

}