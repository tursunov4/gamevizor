import { ProductInterface } from "./productInterface";



export default interface infoAboutOrderInterface {
    product?: ProductInterface,
    wallet?: {
        title: string,
        country: string,
        tag: string;
    }
}