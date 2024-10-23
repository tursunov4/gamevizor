export interface NewFileProductInteface {
    file: File,
    position: number;
}



export interface FileProductInteface {
    id?: number;
    file: string,

    position: number;
    created_on?: string;
    updated_on?: string;
}

export interface GenreProductInterface {
    id: number;
    title: string;

    created_on?: string;
    updated_on?: string;
}

export interface PlatformProductInterface {
    id: number;
    title: string;

    created_on?: string;
    updated_on?: string;
}

export interface ProductInterface {
    id?: number;  
    title?: string;
    general_image?: string;
    background_image?: string;
    description?: string;
    cost?: number;
    product_type?: string;

    is_visible?: boolean;

    images_or_videos?: FileProductInteface[],

    discount?: {
        discount_cost: number;
        data_to_end: string;

        created_on?: string;
        updated_on?: string;
    }  

    genre?: GenreProductInterface[];
    platforms: PlatformProductInterface[];

    is_rus_voice?: boolean;
    is_rus_subtitle?: boolean;
    
    
    is_deluxe_or_premium?: boolean;
    deluxe_or_premium_cost?: number;
    deluxe_or_premium_discount?: {
        discount_cost: number;
        data_to_end: string;

        created_on?: string;
        updated_on?: string;
    }


    is_hit?: boolean;
    is_novelty?: boolean;

    subscription_type?: string;
    subscription_duration_mouth?: number;

    created_on?: string;
    updated_on?: string;
}