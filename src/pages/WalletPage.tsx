import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useWindowSize from "../components/state/useWindowSize";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";

import Cross4Icon from "/images/backgrounds/elements/cross_4.png"
import Triangle4Icon from "/images/backgrounds/elements/triangle_4.png"
import Triangle3Icon from "/images/backgrounds/elements/triangle_3.png"
import Triangle2Icon from "/images/backgrounds/elements/triangle_2.png"
import Square3Icon from "/images/backgrounds/elements/square_3.png"
import Circle3Icon from "/images/backgrounds/elements/circle_3.png"
import Circle2Icon from "/images/backgrounds/elements/circle_2.png"

import styles from "../styles/pages/catalogPage.module.css"
import Input from "../components/inputs/input";
import MyReactSelect from "../components/inputs/MyReactSelect";
import { adminWalletCountryInterface } from "../interfaces/admin/walletInterface";
import axios from "axios";
import PromoCodeData from "../interfaces/promoCodeData";
import PromocodeInput from "../components/order/promocodeInput";
import get_price_from_promocode from "../tools/get_price_from_promocode";



function WalletPage() {
    const [width, _] = useWindowSize()
    const [maxWidth, setMaxWidth] = useState(1600)

    const navigate = useNavigate()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseInt(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [navigate]);

    const [cost, setCost] = useState(0)

    const [valueForWallet, setValueForWallet] = useState(100)

    const [optionValue, setOptionsValue] = useState<{ value: number; label: string; }[]>([])
    const [selectValue, setSelectValue] = useState<{ value: number; label: string; } | undefined>(undefined)

    const [contryWallet, setCountryWallet] = useState<adminWalletCountryInterface[]>([])

    const [isActiveButton, setIsActiveButton] = useState(false);
    const GetCost = async (number: number) => {
        if (number <= 0) return
        if (!selectValue?.value) return
        try {
            const response = await axios.get('/api/v1/wallet/get_cost/',
                {
                    params: {
                        number: number,
                        country_tag: selectValue?.value
                    }
                });
            if (response.status == 200) {
                setCost(response.data.cost)
                if (Number(response.data.cost) > 0) {
                    setIsActiveButton(true)
                } else {
                    setIsActiveButton(false)
                }
            }
            else {
                setIsActiveButton(false)
            }
        } catch (error: any) {
            console.log(error)
            setIsActiveButton(false)
        }
    }
    useEffect(() => {
        if (cost === 0) GetCost(valueForWallet)
    }, [selectValue])

    useEffect(() => {
        const fetchCountyWallet = async () => {
            try {
                const response = await axios.get('/api/v1/wallet/country_wallet/');
                if (response.status == 200) {
                    setCountryWallet(response.data)
                }
            } catch (error: any) {
                console.log(error)
            }
        }

        fetchCountyWallet()
    }, [])

    useEffect(() => {
        setOptionsValue(contryWallet.map((country) => ({
            value: country.id,
            label: country.title,
        })))

        setSelectValue({ value: contryWallet[0]?.id, label: contryWallet[0]?.title })
    }, [contryWallet])

    const handleNavigate = () => {
        if (!isActiveButton) return

        navigate(`../order/create?type=WALLET&value=${valueForWallet}&country=${selectValue?.value}` + (PromoCode ? `&promocode=${PromoCode?.title}` : ""))
    }

    useEffect(() => {
        GetCost(valueForWallet);
    }, [valueForWallet])

    const [PromoCode, setPromoCode] = useState<PromoCodeData | null>(null);

    if (width >= maxWidth) {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <BaseCenterContainer style={{ zoom: 0.9, flexGrow: 1, flexDirection: "column", display: "flex" }}>
                    <Header />

                    <div className={styles.background} style={{ flexGrow: 1 }}>
                        <div className={styles.ellipce_1} />
                        <div className={styles.ellipce_2} />

                        <img src={Cross4Icon} className={styles.icon_background}
                            style={{ left: "80%", top: "15%" }} />
                        <img src={Triangle4Icon} className={styles.icon_background}
                            style={{ left: "65%", top: "10%" }} />
                        <img src={Triangle3Icon} className={styles.icon_background}
                            style={{ left: "45%", top: "0%" }} />
                        <img src={Circle2Icon} className={styles.icon_background}
                            style={{ left: "2%", top: "60%" }} />
                        <img src={Triangle2Icon} className={styles.icon_background}
                            style={{ left: "8.5%", top: "75%" }} />
                        <img src={Square3Icon} className={styles.icon_background}
                            style={{ left: "32.5%", top: "50%", opacity: 0.4 }} />
                        <img src={Circle3Icon} className={styles.icon_background}
                            style={{ left: "51%", top: "75%" }} />


                        <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <span style={{ color: " var(--color-white)" }}>Пополнение кошелька</span></div>

                        <div className={styles.general} style={{ flexGrow: "1", marginTop: "50px", gap: "0px" }}>
                            <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                                <div style={{
                                    fontFamily: "Unbounded_Bold", fontSize: "2rem",
                                    display: "flex", flexDirection: "column"
                                }}>Пополни свой <div style={{ color: "#c2c2c2" }}>аккаунт PS</div></div>
                                <div className={styles.line} style={{ maxWidth: "70%" }}>

                                </div>
                            </div>
                            <div style={{ flexGrow: "1", flexDirection: "row", marginTop: "50px", gap: "100px", display: "flex" }}>
                                <div style={{ display: 'flex', flexDirection: "column", maxWidth: "295px", gap: "5px" }}>
                                    <h2>Инструкция</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: "15px" }}>
                                        <div>1. Напишите сумму пополнения</div>
                                        <div>2. Выбери валюту на пополнение</div>
                                        <div>3. Введите промокод (опционально)</div>
                                        <div>4. Нажмите кнопку "Оформить заказ"</div>

                                        <div>5. После оплаты, вам напишет наш сотрудник в чате,
                                            для уточнения и пополнения кошелька </div>
                                    </div>
                                </div>
                                <div className={styles.wallet_menu}>
                                    <div style={{ fontFamily: "Unbounded_Bold", fontSize: "17px", alignSelf: "center", marginBottom: "15px" }}>Пополнение кошелька</div>

                                    <Input placeholder="1000" type="number" label="Введите сумму" value={valueForWallet} onChange={(value) => { setValueForWallet(parseInt(value)) }} />

                                    <MyReactSelect options={optionValue} value={selectValue} />


                                    <PromocodeInput width={380} type="WALLET" id={selectValue?.value} setPromocode={setPromoCode} />

                                    {PromoCode ? <div style={{ alignSelf: "flex-end", color: "" }}>Ваша скидка: <span style={{ color: "rgb(4, 224, 97)" }}>{PromoCode.value} {PromoCode.type == "PERCENT" ? "%" : "₽"}</span></div> : null}
                                    <div style={{ alignSelf: "flex-end", display: "flex", gap: "10px" }}>К оплате : {get_price_from_promocode(cost, PromoCode).cost} ₽ {PromoCode ? <div style={{ color: "#D4D4D4", textDecoration: "line-through" }}>{get_price_from_promocode(cost, PromoCode)?.discount} ₽</div> : null}</div>
                                    <div className={styles.button} onClick={(handleNavigate)} style={{ fontFamily: "Unbounded_Medium", backgroundColor: isActiveButton ? "var(--color-deeppink)" : "#c2c2c2" }}>Оформить заказ</div>
                                </div>
                            </div>
                        </div>


                    </div>
                </BaseCenterContainer>

                <div style={{ width: "auto", height: "150px", zoom: 0.9, background: "#120F25", zIndex: 1 }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <BaseCenterContainer style={{ display: "flex", flexDirection: "column" }}>
                    <Header />

                    <div style={{ margin: "0 auto", fontFamily: "Unbounded", fontSize: "12px" }}>
                        <div className={styles.base_path} style={{ fontSize: "12px" }}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <span style={{ color: " var(--color-white)" }}>Пополнение кошелька</span></div>

                        <div className={styles.wallet_menu} style={{ width: "200px", marginTop: "15px" }}>
                            <div style={{ fontFamily: "Unbounded_Bold", fontSize: "17px", alignSelf: "center", marginBottom: "15px", color: "white" }}>Пополнение кошелька</div>

                            <Input placeholder="1000" type="number" label="Введите сумму" value={valueForWallet} onChange={(value) => { setValueForWallet(parseInt(value)) }} />

                            <MyReactSelect options={optionValue} value={selectValue} />


                            <PromocodeInput width={180} type="WALLET" id={selectValue?.value} setPromocode={setPromoCode} />

                            {PromoCode ? <div style={{ alignSelf: "flex-end", color: "white" }}>Ваша скидка: <span style={{ color: "rgb(4, 224, 97)" }}>{PromoCode.value} {PromoCode.type == "PERCENT" ? "%" : "₽"}</span></div> : null}
                            <div style={{ alignSelf: "flex-end", display: "flex", gap: "10px", color: 'white' }}>К оплате : {get_price_from_promocode(cost, PromoCode).cost} ₽ {PromoCode ? <div style={{ color: "#D4D4D4", textDecoration: "line-through" }}>{get_price_from_promocode(cost, PromoCode)?.discount} ₽</div> : null}</div>
                            <div className={styles.button} onClick={(handleNavigate)} style={{ fontSize: "14px", fontFamily: "Unbounded_Medium", backgroundColor: isActiveButton ? "var(--color-deeppink)" : "#c2c2c2" }}>Оформить заказ</div>
                        </div>
                    </div>

                </BaseCenterContainer>
                <div style={{ marginTop: "auto" }}>
                    <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                </div>
            </div>
        )
    }
}


export default WalletPage