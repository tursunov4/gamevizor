
export interface EmployeeRoleInterface {
    value: number;
    label: string;
  }




interface EmployeeInterface {
    id: number;
    permissions: string[],

    about_me: string;

    telegram: string;

    role: number;


    user: {
        pk?: number;
        email: string,
        username: string,

        phone_number: string,
        nickname: string,

        profile: {
            date_of_birth: string,
            console_generation: string,

            two_factor_authentication: boolean,

            receive_notifications_on_email: boolean,
            receive_notifications_on_telegram: boolean,

            receive_notifications_on_new_message: boolean,
            receive_notifications_on_change_status_order: boolean,

            image?: string;
        }
    }
}


export default EmployeeInterface