import { OrderPanelProp } from "./orderPanel"
import SupportInterface from "./supportInteface"
import UserInterface from "./userInterface"


export default interface ChatInterface {
    id: number;
    author: UserInterface;

    ticket: SupportInterface
    order: OrderPanelProp

    counter_no_read_message: number;
    counter_no_read_message_staff: number;
    last_message_data: string;

    created_on: string
    updated_on: string
}