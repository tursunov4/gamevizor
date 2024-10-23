import { FunctionComponent, useEffect, useState } from "react"
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
import { ProductInterface } from "../../interfaces/productInterface";
import AdminProductPanel from "../../components/panels/adminProductPanel";
import useWindowSize from "../../components/state/useWindowSize";
import { Link } from "react-router-dom";



const AdminProductPage: FunctionComponent = () => {
    const { employee } = useUser();
    const { accessToken } = useAuth();

    const [products, setProducts] = useState<ProductInterface[]>([]);

    const [newProduct, setNewProduct] = useState<ProductInterface | null>(null);

    const [search, setSearch] = useState("");

    const [filterAllProduct, setFilterAllProduct] = useState(true);
    const [filterSubscription, setFilterSubscription] = useState(false);
    const [filterGames, setFilterGames] = useState(false);
    const [filterСost, setFilterCost] = useState(false);
    const [filterDiscount, setfilterDiscount] = useState(false);

    const [orderingAllProduct, setOrderingAllProduct] = useState(false);
    const [orderingSubscription, setOrderingSubscription] = useState(false);
    const [orderingGames, setOrderingGames] = useState(false);
    const [orderingCost, setOrderingCost] = useState(false);
    const [orderingDiscount, setOrderingDiscount] = useState(false);

    const [platforms, setPlatforms] = useState([]);

    const HandleSearch = () => {
        fetchProduct(true)
    }

    const fetchProduct = async (is_search = false) => {
        if (!accessToken) return;

        let url = '/api/v1/products/?page_size=10000'; // Base URL

        // Add filters to the URL if they are true

        if (is_search) {
            url += "&search=" + search
        } else {
            if (filterAllProduct) {
                url += `&ordering=${orderingAllProduct ? 'pk' : '-pk'}`;
            }

            if (filterSubscription) {
                url += '&type=SUBSCRIPTION';
                url += `&ordering=${orderingSubscription ? 'pk' : '-pk'}`;
            }
            if (filterGames) {
                url += '&type=PRODUCT';
                url += `&ordering=${orderingGames ? 'pk' : '-pk'}`;
            }

            if (filterСost) {
                url += `&ordering=${orderingCost ? 'cost' : '-cost'}`;
            }
            if (filterDiscount) {
                url += `&ordering=${orderingDiscount ? 'discount__discount_cost' : '-discount__discount_cost'}`;
            }
        }


        try {
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            setProducts(response.data.results);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [accessToken, filterAllProduct, filterSubscription, filterGames, orderingAllProduct, orderingSubscription,
        orderingGames, filterСost, orderingCost, filterDiscount, orderingDiscount]);

    const HandleSelectAllProduct = (value: boolean) => {
        setFilterAllProduct(value)
        setFilterSubscription(false);
        setFilterGames(false);
    }

    const HandleSelectPublicSubscription = (value: boolean) => {
        setFilterAllProduct(false)
        setFilterSubscription(value);
        setFilterGames(false);
    }

    const HandleSelectHideGames = (value: boolean) => {
        setFilterAllProduct(false)
        setFilterSubscription(false);
        setFilterGames(value);
    }

    const DeleteProduct = async () => {
        fetchProduct()
    }

    const createProduct = () => {
        fetchProduct();
        setNewProduct({ product_type: "ALL", platforms: [] })
    }

    useEffect(() => {
        console.log(newProduct)
    }, [newProduct])

    const getPlatforms = async () => {
        if (!accessToken) return
        try {
            const response = await axios.get('/api/v1/platforms/',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            setPlatforms(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    useEffect(() => {
        getPlatforms();
    }, [accessToken])

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

                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Товары</span></div>
                        <div className={styles.main_panel}>
                            <AdminMenu selected={1} />
                            <div className={styles.general}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className={styles.title}>Товары</div>
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <Input style={{ width: "271px", height: "29px" }} maxlenght={30} placeholder="Поиск" onEventEnterPressed={HandleSearch} value={search} onChange={setSearch} />
                                            <div onClick={HandleSearch} style={{ position: "absolute", left: "260px", top: "32%" }}><SearchIcon /></div>
                                        </div>
                                        <div className={styles.button} onClick={createProduct} style={{ fontFamily: "Unbounded_Medium", fontSize: "10px", width: "136px", padding: "13px" }}>Добавить товар</div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", marginTop: "25px", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <div style={{ fontSize: "0.9rem" }}>Фильтр: </div>
                                        <FlagButton className={styles.flag_button} text="Все товары" initialState={filterAllProduct} onChangeActive={HandleSelectAllProduct} onChangeDirectionSorting={setOrderingAllProduct} />
                                        <FlagButton className={styles.flag_button} text="Подписки" initialState={filterSubscription} onChangeActive={HandleSelectPublicSubscription} onChangeDirectionSorting={setOrderingSubscription} />
                                        <FlagButton className={styles.flag_button} text="Игры" initialState={filterGames} onChangeActive={HandleSelectHideGames} onChangeDirectionSorting={setOrderingGames} />
                                    </div>

                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <div style={{ fontSize: "0.9rem" }}>Сортировать по: </div>
                                        <FlagButton className={styles.flag_button} text="Цене" initialState={filterСost} onChangeActive={(value) => { setfilterDiscount(false); setFilterCost(value) }} onChangeDirectionSorting={setOrderingCost} />
                                        {/*<FlagButton className={styles.flag_button} text="Новизне" initialState={filterNovelty} onChangeActive={HandleSelectPublicFeedback} onChangeDirectionSorting={setOrderingSubscription} />*/}
                                        <FlagButton className={styles.flag_button} text="Скидке" initialState={filterDiscount} onChangeActive={(value) => { setfilterDiscount(value); setFilterCost(false) }} onChangeDirectionSorting={setOrderingDiscount} />
                                    </div>
                                </div>

                                <div style={{ display: "flex", maxWidth: "880px", justifyContent: "space-between", color: "rgba(255, 255, 255, 0.6)", marginTop: "50px", fontSize: "0.6rem" }}>
                                    <div style={{ display: "flex", gap: "100px" }}>
                                        <div>Товар</div>
                                        <div>Название</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "80px" }}>
                                        <div>Цена</div>
                                        <div>Действия</div>
                                    </div>
                                </div>

                                <div className={styles.line} />

                                <div className={styles.container_orders} style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto" }}>
                                    {newProduct !== null && <AdminProductPanel product={newProduct} platforms={platforms} funcDelete={() => { setNewProduct(null); DeleteProduct() }} employee={employee} is_edit={true} />}
                                    {products.map((product) => (
                                        <AdminProductPanel key={product.id} product={product} employee={employee} funcDelete={DeleteProduct} platforms={platforms} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{
                    marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9,
                }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px", marginBottom: "30px" }} />
                </div>
            </div>

        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <BaseCenterContainer>
                    <Header is_admin />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", gap: "30px" }}>
                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Товары</span></div>

                        <div className={styles.general}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className={styles.title}>Товары</div>
                                <div className={styles.button} onClick={createProduct} style={{ fontFamily: "Unbounded_Medium", fontSize: "10px", width: "206px", padding: "13px" }}>Добавить товар</div>
                            </div>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <Input style={{ width: "320px", height: "29px" }} maxlenght={30} placeholder="Поиск" onEventEnterPressed={HandleSearch} value={search} onChange={setSearch} />
                                    <div onClick={HandleSearch} style={{ position: "absolute", left: "310px", top: "32%" }}><SearchIcon /></div>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                    <div>Вид товара:</div>
                                    <FlagButton className={styles.flag_button} text="Все товары" initialState={filterAllProduct} onChangeActive={HandleSelectAllProduct} onChangeDirectionSorting={setOrderingAllProduct} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                    <div>Сортировать по:</div>
                                    <FlagButton className={styles.flag_button} text="Цене" initialState={filterСost} onChangeActive={(value) => { setfilterDiscount(false); setFilterCost(value) }} onChangeDirectionSorting={setOrderingCost} />
                                </div>
                            </div>

                            <div className={styles.container_orders} style={{ display: "flex", flexDirection: "column", gap: "25px", maxHeight: "1600px", overflowY: "auto", overflowX: "hidden", paddingRight: "10px" }}>
                                {newProduct !== null && <AdminProductPanel product={newProduct} platforms={platforms} funcDelete={() => { setNewProduct(null); DeleteProduct() }} employee={employee} is_edit={true} />}
                                {products.map((product) => (
                                    <AdminProductPanel key={product.id} product={product} employee={employee} funcDelete={DeleteProduct} platforms={platforms} />
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

export default AdminProductPage;