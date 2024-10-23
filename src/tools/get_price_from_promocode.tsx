import PromoCodeData from "../interfaces/promoCodeData";


function get_price_from_promocode(cost: number, promocode: PromoCodeData | null) {
    if (promocode) {
        if (promocode.type == "FIXED") {
            return { cost: Math.round(cost - (promocode.value ?? 0)), discount: Math.round(promocode.value ?? 0) }
        }

        if (promocode.type == "PERCENT") {
            const percent_cost = (cost * (promocode.value ?? 0)) / 100
            return { cost: Math.round(cost - percent_cost), discount: Math.round(percent_cost) }
        }
    }
    return { cost: cost };
}


export default get_price_from_promocode