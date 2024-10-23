import { useState, FC } from 'react';
import Input from '../inputs/input';
import axios from 'axios';
import { useAuth } from '../../stores/JWTTokenStore';
import PromoCodeData from '../../interfaces/promoCodeData';


interface PromocodeInputProps {
    setPromocode?: (value: PromoCodeData) => void;
    type?: string;
    id?: number;

    width?: number;
}

const PromocodeInput: FC<PromocodeInputProps> = ({ setPromocode, type, id, width=337 }) => {
    const [inputValue, setInputValue] = useState('');
    const [isUsePromocode, setIsUsePromocode] = useState(false)

    const {accessToken} = useAuth();

    const handleEnterPromoCode = () => {
        if (inputValue === "") return
        // Если токен есть, запрос на получение данных пользователя
        axios.get('/api/v1/get_promo_code/', {
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`
            } : {},
            params: {
                title: inputValue,
                type: type,
                id: id,
            }
        })
            .then(response => {
                if (setPromocode) setPromocode(response.data);

                setIsUsePromocode(true)
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });

    };

    if (isUsePromocode) {
        return (
            <div style={{ display: "flex", position: "relative", justifyContent: "center", }}>
                <Input placeholder="Есть промокод?" style={{ width: width }}
                    maxlenght={50} isDisabled={true} />
                <div style={{ position: "absolute", left: "80%", top: "10px", color: "#D4D4D4", opacity: "0.3", transform: `translateX(-80%)`, textWrap: "nowrap" }}>Промокод применен</div>
            </div>
        )
    } else {
        return (
            <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                <Input placeholder="Есть промокод?" style={{ width: width }} onChange={(event) => setInputValue(event)}
                    maxlenght={50} onEventEnterPressed={handleEnterPromoCode} />
                <div style={{ width: "32px", height: "39px", position: "absolute", left: "95%", cursor: "pointer", zIndex: 1, display: "flex", transform: "translateX(-95%)" }} onClick={handleEnterPromoCode} >
                    <img src={"/icons/bases/arrows/arrow_left.svg"} style={{ cursor: "pointer", scale: "1.5", margin: "auto" }} />
                </div>
            </div>
        )
    }
};

export default PromocodeInput;