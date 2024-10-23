import { FunctionComponent, Key, useEffect, useState } from "react"
import styles from "../../styles/pages/admin/AdminClientPage.module.css"
import axios from "axios";
import BaseCenterContainer from "../../components/baseCenterContainer";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useAuth } from "../../stores/JWTTokenStore";
import AdminMenu from "../../components/menus/adminMenu";
import Input from "../../components/inputs/input";
import SearchIcon from "/public/icons/bases/search.svg?react"
import FlagButton from "../../components/inputs/flagButton";
import { useUser } from "../../stores/userStore";
import AdminOffersPanel from "../../components/panels/adminOffersPanel";
import PromoCodeData from "../../interfaces/promoCodeData";
import UserInterface from "../../interfaces/userInterface";
import useWindowSize from "../../components/state/useWindowSize";
import { Link } from "react-router-dom";
import { ProductInterface } from "../../interfaces/productInterface";
import { adminWalletCountryInterface } from "../../interfaces/admin/walletInterface";


interface ReactSelectEmail {
    value: number | null;
    label: string;
}


const AdminOffersPage: FunctionComponent = () => {
    const { employee } = useUser();
    const { accessToken } = useAuth();

    const [promocodes, setPromocodes] = useState<PromoCodeData[]>([]);

    const [search, setSearch] = useState("");

    const [newProduct, setNewProduct] = useState<PromoCodeData | null>(null);

    const [filterAllFeedback, setFilterAllFeedback] = useState(true);
    const [filterPublicFeedback, setFilterPublicFeedback] = useState(false);
    const [filterHideFeedback, setFilterHideFeedback] = useState(false);

    const [orderingAllFeedback, setOrderingAllFeedback] = useState(false);
    const [orderingPublicFeedback, setOrderingPublicFeedback] = useState(false);
    const [orderingHideFeedback, setOrderingHideFeedback] = useState(false);

    const HandleSearch = () => {
        fetchFeedback(true)
    }

    const [listProduct, setListProduct] = useState<{value: number, label: string, type: string}[]>([])
    const [listCountryWallet, setListCountryWallet] = useState<{value: number, label: string}[]>([])

    useEffect(() => {
        if (!accessToken) return

        const getListProduct = async () => {
            try {
                const response = await axios.get("/api/v1/products?page_size=10000&ordering=-pk",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }); // Ваш API-endpoint
                setListProduct([{value: null, label: "ВСЕ", type: "PRODUCT"}, {value: null, label: "ВСЕ", type: "SUBSCRIPTION"}, ...response.data.results.map((item: ProductInterface) => ({value: item.id, label: item.title, type: item.product_type}))]);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }

        const getListCountryWallet = async () => {
            try {
                const response = await axios.get("/api/v1/wallet/country_wallet/")
                setListCountryWallet([{value: null, label: "ВСЕ"}, ...response.data.map((item: ProductInterface) => ({value: item.id, label: item.title}))]);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }

        getListProduct()
        getListCountryWallet()

    }, [accessToken])

    const fetchFeedback = async (is_search = false) => {
        if (!accessToken) return;

        let url = '/api/v1/admin/promocodes/?'; // Base URL

        // Add filters to the URL if they are true
        if (filterAllFeedback) {
            url += `&ordering=${orderingAllFeedback ? (orderingAllFeedback ? '-pk' : 'pk') : 'pk'}`;
        }

        if (filterPublicFeedback) {
            url += '&is_public=1';
            url += `&ordering=${orderingPublicFeedback ? (orderingPublicFeedback ? '-pk' : 'pk') : 'pk'}`;
        }
        if (filterHideFeedback) {
            url += '&is_public=0';
            url += `&ordering=${orderingHideFeedback ? (orderingHideFeedback ? '-pk' : 'pk') : '-pk'}`;
        }

        if (is_search) {
            url += "&search=" + search
        }


        try {
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            setPromocodes(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [accessToken, filterAllFeedback, filterPublicFeedback, filterHideFeedback, orderingAllFeedback, orderingPublicFeedback, orderingHideFeedback]);

    const HandleSelectAllFeedback = (value: boolean) => {
        setFilterAllFeedback(value)
        setFilterPublicFeedback(false);
        setFilterHideFeedback(false);
    }

    const HandleSelectPublicFeedback = (value: boolean) => {
        setFilterAllFeedback(false)
        setFilterPublicFeedback(value);
        setFilterHideFeedback(false);
    }

    const HandleSelectHideFeedback = (value: boolean) => {
        setFilterAllFeedback(false)
        setFilterPublicFeedback(false);
        setFilterHideFeedback(value);
    }

    const DeleteFeedback = async () => {
        fetchFeedback()
    }
    const [reactSelectEmail, setreactSelectEmail] = useState<ReactSelectEmail[]>([])

    const [isShowCreateWindow, setIsShowCreateWindow] = useState(false)

    useEffect(() => {
        const fetchStaffs = async () => {
            if (!accessToken) return;

            try {
                const response = await axios.get('/api/v1/admin/users/',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }); // Ваш API-endpoint


                const emailOptions: ReactSelectEmail[] = response.data.map((user: UserInterface) => ({
                    value: user.pk,
                    label: user.email
                }));

                setreactSelectEmail([{ value: null, label: "ВСЕ" }, ...emailOptions]);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchStaffs();
    }, [accessToken]);


    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])


    if (width >= maxWidth) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer style={{ zoom: 0.9 }}>
                    <Header />
                    <div className={styles.background}>
                        <div className={styles.ellipce_1} />
                        <div className={styles.ellipce_2} />
                        <div className={styles.ellipce_3} />

                        <img src="/images/backgrounds/elements/cross_4.png" className={styles.icon_background}
                            style={{ left: "80%", top: "15%" }} />
                        <img src="/images/backgrounds/elements/triangle_4.png" className={styles.icon_background}
                            style={{ left: "65%", top: "10%" }} />
                        <img src="/images/backgrounds/elements/triangle_3.png" className={styles.icon_background}
                            style={{ left: "45%", top: "0%" }} />
                        <img src="/images/backgrounds/elements/circle_2.png" className={styles.icon_background}
                            style={{ left: "2%", top: "60%" }} />
                        <img src="/images/backgrounds/elements/triangle_2.png" className={styles.icon_background}
                            style={{ left: "8.5%", top: "75%" }} />
                        <img src="/images/backgrounds/elements/square_3.png" className={styles.icon_background}
                            style={{ left: "32.5%", top: "50%", opacity: 0.4 }} />
                        <img src="/images/backgrounds/elements/circle_3.png" className={styles.icon_background}
                            style={{ left: "51%", top: "75%" }} />

                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Предложения</span></div>
                        <div className={styles.main_panel}>
                            <AdminMenu selected={9} />
                            <div className={styles.general}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className={styles.title}>Предложения</div>
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <Input style={{ width: "271px", height: "29px" }} maxlenght={30} placeholder="Поиск" onEventEnterPressed={HandleSearch} value={search} onChange={setSearch} />
                                            <div onClick={HandleSearch} style={{ position: "absolute", left: "260px", top: "32%" }}><SearchIcon /></div>
                                        </div>
                                        <div className={styles.button} onClick={() => setNewProduct({})}>Создать промокод</div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "20px", marginTop: "25px" }}>
                                    <div style={{ fontSize: "0.9rem" }}>Фильтр: </div>
                                    <FlagButton className={styles.flag_button} text="Все промокоды" initialState={filterAllFeedback} onChangeActive={HandleSelectAllFeedback} onChangeDirectionSorting={setOrderingAllFeedback} />
                                    <FlagButton className={styles.flag_button} text="Активные" initialState={filterPublicFeedback} onChangeActive={HandleSelectPublicFeedback} onChangeDirectionSorting={setOrderingPublicFeedback} />
                                    <FlagButton className={styles.flag_button} text="Скрытые" initialState={filterHideFeedback} onChangeActive={HandleSelectHideFeedback} onChangeDirectionSorting={setOrderingHideFeedback} />
                                </div>

                                <div style={{ display: "flex", maxWidth: "950px", justifyContent: "space-between", color: "rgba(255, 255, 255, 0.6)", marginTop: "50px", fontSize: "0.6rem" }}>
                                    <div style={{ display: "flex", gap: "60px" }}>
                                        <div>Название</div>
                                        <div>Выгода</div>
                                        <div>Для продукта</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "100px" }}>
                                        <div>Исп.</div>
                                        <div>Пользователь</div>
                                        <div style={{ marginRight: "20px" }}>Дата</div>
                                        <div>Действия</div>
                                    </div>
                                </div>

                                <div className={styles.line} />

                                <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto" }}>
                                    {newProduct !== null && <AdminOffersPanel listCountryWallet={listCountryWallet} listProduct={listProduct} usersOptions={reactSelectEmail} promocode={newProduct} funcDelete={() => { setNewProduct(null); DeleteFeedback() }} employee={employee} is_edit={true} />}
                                    {promocodes.map((promocode: PromoCodeData, index: Key | null | undefined) => (
                                        <AdminOffersPanel listCountryWallet={listCountryWallet} listProduct={listProduct} key={promocode.id} promocode={promocode} employee={employee} usersOptions={reactSelectEmail} funcDelete={DeleteFeedback} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{
                    marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9,
                }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
                </div>
            </div>

        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer style={{ zoom: 0.9 }}>
                    <Header />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", gap: "30px" }}>
                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Предложения</span></div>
                        <div className={styles.general}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className={styles.title}>Предложения</div>
                                <div className={styles.button} style={{ width: "300px", textWrap: "nowrap" }} onClick={() => setIsShowCreateWindow(true)}>Создать промокод</div>
                            </div>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <Input style={{ width: "340px", height: "29px" }} maxlenght={30} placeholder="Поиск" onEventEnterPressed={HandleSearch} value={search} onChange={setSearch} />
                                <div onClick={HandleSearch} style={{ position: "absolute", left: "330px", top: "32%" }}><SearchIcon /></div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>Фильтр:</div>
                                <FlagButton className={styles.flag_button} text="Все промокоды" initialState={filterAllFeedback} onChangeActive={HandleSelectAllFeedback} onChangeDirectionSorting={setOrderingAllFeedback} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto" }}>
                                {newProduct !== null && <AdminOffersPanel listCountryWallet={listCountryWallet} listProduct={listProduct} usersOptions={reactSelectEmail} promocode={newProduct} funcDelete={() => { setNewProduct(null); DeleteFeedback() }} employee={employee} is_edit={true} />}
                                {promocodes.map((promocode: PromoCodeData, index: Key | null | undefined) => (
                                    <AdminOffersPanel listCountryWallet={listCountryWallet} listProduct={listProduct} key={promocode.id} promocode={promocode} employee={employee} usersOptions={reactSelectEmail} funcDelete={DeleteFeedback} />
                                ))}
                            </div>
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

export default AdminOffersPage;