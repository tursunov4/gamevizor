import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/pages/admin/adminTeamPage.module.css"
import axios from "axios";
import BaseCenterContainer from "../../components/baseCenterContainer";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useUser } from "../../stores/userStore";
import { useAuth } from "../../stores/JWTTokenStore";
import AdminMenu from "../../components/menus/adminMenu";
import Input from "../../components/inputs/input";
import SearchIcon from "/public/icons/bases/search.svg?react"
import useWindowSize from "../../components/state/useWindowSize";
import { Link } from "react-router-dom";
import { adminWalletCountryInterface, adminWalletInterface } from "../../interfaces/admin/walletInterface";
import RuleWalletPanel from "../../components/panels/admin/adminRuleWalletPanel";
import { access } from "fs";



const AdminWalletPage: FunctionComponent = () => {

    const { accessToken } = useAuth();
    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    const [isVisibleCreateWalletRule, setIsVisibleCreateWalletRule] = useState(false)

    const [listWalletRules, setListWalletRules] = useState<adminWalletInterface[]>([])

    const [contryWallet, setCountryWallet] = useState<adminWalletCountryInterface[]>([])

    const [Search, setSearch] = useState("")


    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    const fetchCountyWallet = async (is_search=false) => {
        try {
            const response = await axios.get('/api/v1/admin/wallet_rules/',
                {
                    params: {
                        search: is_search ? Search : null
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            if (response.status == 200) {
                setListWalletRules(response.data)
            }
        } catch (error: any) {
            console.log(error)
        }
    }

    const DeleteFunc = async () => {
        fetchCountyWallet()
    }

    useEffect(() => {
        if (!accessToken) return
        fetchCountyWallet()
    }, [accessToken])

    const HandleSearch = () => {
        fetchCountyWallet(true)
    }

    useEffect(() => {
        const fetchCountyWallet = async () => {
            try {
                const response = await axios.get('/api/v1/admin/country_wallet/');
                if (response.status == 200) {
                    setCountryWallet(response.data)
                }
            } catch (error: any) {
                console.log(error)
            }
        }

        fetchCountyWallet()
    }, [])



    if (width >= maxWidth) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer style={{ zoom: 0.9 }}>
                    <Header />
                    <div className={styles.background}>
                        <div className={styles.ellipce_1} />
                        <div className={styles.ellipce_2} />

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

                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Кошелек</span></div>
                        <div className={styles.main_panel}>
                            <AdminMenu selected={10} />
                            <div className={styles.general}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className={styles.title}>Правила пополнение</div>
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <Input style={{ width: "271px", height: "29px" }} maxlenght={30} placeholder="Поиск" onEventEnterPressed={HandleSearch}
                                            onChange={(value) => {setSearch(value)}}/>
                                            <div style={{ position: "absolute", left: "260px", top: "32%" }} onClick={HandleSearch}><SearchIcon /></div>
                                        </div>
                                        <div className={styles.button} style={{ width: "280px" }} onClick={() => { setIsVisibleCreateWalletRule(true) }}>Добавить правила для валюты</div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", maxWidth: "920px", justifyContent: "space-between", color: "rgba(255, 255, 255, 0.6)", marginTop: "50px", fontSize: "0.6rem" }}>
                                    <div style={{ display: "flex", gap: "100px" }}>
                                        <div>Правило</div>
                                        <div>Коффицент</div>
                                        <div>Тип валюты</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "100px" }}>
                                        <div>Действия</div>
                                    </div>
                                </div>

                                <div className={styles.line} />

                                <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto" }}>
                                    {isVisibleCreateWalletRule ? <RuleWalletPanel panel={{}} country_wallets={contryWallet} is_edit funcDelete={() => { setIsVisibleCreateWalletRule(false); DeleteFunc() }} /> : null}
                                    {listWalletRules.map((panel, index) => (
                                        <RuleWalletPanel panel={panel} key={index} country_wallets={contryWallet} funcDelete={DeleteFunc} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </BaseCenterContainer >
                <div style={{
                    marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9,
                }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
                </div>
            </div >
        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer>
                    <Header is_admin />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", gap: "30px" }}>
                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Отзывы</span></div>
                        <div className={styles.general}>
                            <div style={{ display: 'flex', gap: "25px" }}>
                                <div className={styles.title} style={{width: "fit-content"}}>Правила кошелька</div>
                                <div className={styles.button} style={{ width: "280px" }} onClick={() => { setIsVisibleCreateWalletRule(true) }}>Добавить новое правило</div>
                            </div>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <Input style={{ width: "300px", height: "29px" }} maxlenght={30} placeholder="Поиск" 
                                    onChange={(value) => {setSearch(value)}} onEventEnterPressed={HandleSearch}/>
                                    <div style={{ position: "absolute", left: "290px", top: "32%" }} onClick={HandleSearch}><SearchIcon /></div>
                                </div>

                            </div>
                            {/*  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>Фильтр:</div>
                                <FlagButton className={styles.flag_button} text="Все отзывы" initialState={filterAllFeedback} onChangeActive={HandleSelectAllFeedback} onChangeDirectionSorting={setOrderingAllFeedback} />
                            </div> */}

                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto", overflowX: "hidden" }}>
                                {isVisibleCreateWalletRule ? <RuleWalletPanel panel={{}} country_wallets={contryWallet} is_edit funcDelete={() => { setIsVisibleCreateWalletRule(false); DeleteFunc() }} /> : null}
                                {listWalletRules.map((panel, index) => (
                                    <RuleWalletPanel panel={panel} key={index} country_wallets={contryWallet} funcDelete={DeleteFunc} />
                                ))}
                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{ marginTop: "auto", background: "#120F25", }}>
                    <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                </div>
            </div>
        )
    }
}


export default AdminWalletPage;