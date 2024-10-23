interface PromoCodeData {
    id?: number;
    title?: string;
    type?: string;
    value?: number;
    is_active?: boolean;
    description?: string;
    expiry_date?: string;

    for_user?: number | null;
    for_product?: "ALL" | "PRODUCT" | "SUBSCRIPTION" | "WALLET";

    number_of_uses?: number;
    number_of_uses_now?: number;

    select_product?: number | null;
    select_wallet?: number | null;
}

export default PromoCodeData