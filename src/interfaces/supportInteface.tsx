import UserInterface from "./userInterface";

export default interface SupportInterface {
    id?: number;

    author?: UserInterface;

    title?: string;
    theme?: string;
    status?: string;

    question?: string;
    answer?: string;


    created_on?: string;
    updated_on?: string;

    chat? : {
        id?: number;
        last_message: string
    }
}

export enum SupportStatusKeys {
    OPEN = 'Открыт',
    CLOSED = 'Завершен',
}

export enum SupportBackgroundStatusKeys {
    OPEN = '#FFA319',
    CLOSED = '#159338',
}
