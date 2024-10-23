

export interface feedbackInterface {
    id: number;
    text: string;
    answer: string;
    created_on: string;
    updated_on: string
    rating: number;

    order: {
        logo: string | null;
        user: string;
        title: string;
        product_type: string
    }
}

export default feedbackInterface


export interface feedbackEmployeeInterface {
    id: number;
    text: string;
    answer: string;
    created_on: string;
    updated_on: string
    rating: number;

    is_public: boolean;

    user: {
        username: string;
        profile: {
            image: string;
        }
    }
}