import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/order.module.css"
import Input from "./inputs/input";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import PromoCodeData from "../interfaces/promoCodeData";
import { useUser } from "../stores/userStore";
import { useAuth } from "../stores/JWTTokenStore";
import { ProductInterface } from "../interfaces/productInterface";


const PriceDisplay: React.FC<({ PromoCode: PromoCodeData | null; OrderData: ProductInterface | null })> = ({ PromoCode, OrderData }) => {
    if (PromoCode && OrderData) {
        if (PromoCode.type === "FIXED") {
            return Number(PromoCode.value); // Assuming PromoCode.value is already a number
        } else if (PromoCode.type === "PERCENT") {
            // Make sure OrderData.cost is a number
            const cost = Number(OrderData.cost);
            if (!isNaN(cost)) { // Check if the conversion was successful
                return Math.round(Number(cost * (Number(PromoCode.value) / 100)));
            } else {
                // Handle cases where OrderData.cost is not a valid number
                // You might want to display an error message or use a default value
                return 0;
            }
        }
    }
    return 0;
};

interface OrderComponentProps {
    redirect?: boolean;
    is_mobile?: boolean;
}



const OrderComponent: FunctionComponent<OrderComponentProps> = ({ redirect, is_mobile }) => {
    const navigate = useNavigate();

    const location = useLocation();
    const currentPath = location.pathname;

    const [isAcceptRule, SetIsAcceptRule] = useState(false);

    const [infoAboutOrder, SetInfoAboutOrder] = useState<ProductInterface | null>(null);
    const [PromoCode, setPromoCode] = useState<PromoCodeData | null>(null);

    const [isDone, setIsDone] = useState(false);

    const [inputPromoCode, setInputPromoCode] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    if (searchParams.get("is_deluxe") === "true") {
        var cost = infoAboutOrder?.deluxe_or_premium_cost || 0; // значение по умолчанию 0, если cost  undefined
    } else {
        var cost = infoAboutOrder?.cost || 0; // значение по умолчанию 0, если cost  undefined
    }
    const promoPrice = PriceDisplay({ PromoCode, OrderData: infoAboutOrder }) as number;
    const finalPrice = cost - promoPrice;

    const { user } = useUser();
    const [Username, SetUsername] = useState('');
    const [Email, SetEmail] = useState('');
    const [Phone, setPhone] = useState('');

    const { id } = useParams();

    const { accessToken } = useAuth();

    useEffect(() => {
        const config = {
            params: {
                id: id,
                type: currentPath.includes("product") ? "PRODUCT" : currentPath.includes("subscription") ? "SUBSCRIPTION" : null
            },
        };
        axios.get('/api/v1/get_info_for_order/', config)
            .then(response => {
                SetInfoAboutOrder(response.data);
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);

            });
    }, [accessToken]);


    const handleEnterPromoCode = () => {

        // Если токен есть, запрос на получение данных пользователя
        axios.get('/api/v1/get_promo_code/', {
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`
            } : {},
            params: {
                title: inputPromoCode,
                id: infoAboutOrder?.id,
                type: currentPath.includes("product") ? "PRODUCT" : currentPath.includes("subscription") ? "SUBSCRIPTION" : null
            }
        })
            .then(response => {
                setPromoCode(response.data);
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });

    }

    const handleCreateOrder = () => {

    }

    const handleRedirectOrder = () => {
        var ordersCreateUrl = `/order/create?type=${infoAboutOrder?.product_type}&id=${id}&is_deluxe=${searchParams.get("is_deluxe") ?? false}` + "&platform_id=" + (searchParams.get("platform_id") ?? infoAboutOrder?.platforms[0]?.id ?? "");

        if (PromoCode) {
            ordersCreateUrl += `&promocode=${PromoCode.title}`;
        }

        navigate(ordersCreateUrl); // Use navigate to change the URL
    }


    return <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className={styles.container_pay} style={{ maxWidth: is_mobile ? "325px" : "-" }}>
            <div style={{
                display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xl)", fontFamily: "Unbounded_Medium"
            }}>
                <span>Итого:</span>
                <span>{Math.max(0, finalPrice - (searchParams.get("is_deluxe") === "true" ? infoAboutOrder?.deluxe_or_premium_discount?.discount_cost ?? 0 : infoAboutOrder?.discount?.discount_cost ?? 0))} ₽</span>
            </div>

            <div className={styles.line} />

            <div style={{
                display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)",
                fontWeight: 300, color: "var(--color-lightgray-100)"
            }}>
                <span style={{ fontFamily: "Unbounded_Light_Base" }}>Товаров на сумму:</span>
                <span>{cost} ₽</span>
            </div>

            <div style={{
                display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)",
                fontWeight: 300, color: "var(--color-lightgray-100)"
            }}>
                <span style={{ fontFamily: "Unbounded_Light_Base" }}>Ваша скидка:</span>
                <span style={PromoCode ? { color: "#04E061" } : {}}>{promoPrice + (searchParams.get("is_deluxe") === "true" ? infoAboutOrder?.deluxe_or_premium_discount?.discount_cost ?? 0 : infoAboutOrder?.discount?.discount_cost ?? 0)} ₽</span>
            </div>



            {PromoCode ?
                <div style={{ display: "flex", position: "relative", justifyContent: "center", }}>
                    <Input placeholder="Есть промокод?" style={{ width: "337px" }}
                        maxlenght={50} isDisabled={true} />
                    <div style={{ position: "absolute", left: "170px", top: "10px", color: "#D4D4D4", opacity: "0.3" }}>Промокод применен</div>
                </div>
                : <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                    <Input placeholder="Есть промокод?" style={{ width: "337px" }} onChange={(event) => setInputPromoCode(event)}
                        maxlenght={50} onEventEnterPressed={handleEnterPromoCode} />
                    <div style={{ width: "32px", height: "39px", position: "absolute", left: "92.5%", cursor: "pointer", zIndex: 1, display: "flex" }} onClick={handleEnterPromoCode} >
                        <img src={"/icons/bases/arrows/arrow_left.svg"} style={{ cursor: "pointer", scale: "1.5", margin: "auto" }} />
                    </div>
                </div>}


            <button style={{ fontFamily: "Unbounded_Medium", fontSize: "12px" }} className={redirect ? styles.button : isAcceptRule ? styles.button : styles.button_disable} onClick={redirect ? handleRedirectOrder : handleCreateOrder}><span>ОФОРМИТЬ ЗАКАЗ</span></button>

            <div style={{
                fontSize: "var(--font-size-3xs)", fontWeight: "300",
                color: "var(--color-lightgray-100)", fontFamily: "Unbounded_Light_Base"
            }}>
                Нажимая на кнопку “Оформить заказ” - вы соглашаетесь
                с политикой конфиденциальности в отношении обработки персональных данных и политикой оферты
            </div>
        </div>
    </div>
}

export default OrderComponent