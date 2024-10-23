/// <reference types="vite-plugin-svgr/client" />
import BaseCenterContainer from "../../components/baseCenterContainer"
import Footer from "../../components/footer"
import Header from "../../components/header"

import { useState, useEffect } from "react"
import styles from "../../styles/pages/catalogPage.module.css"
import Checkbox from "../../components/inputs/checkbox"

import Logo from "/icons/bases/logo.svg"

import InputWithSuffix from "../../components/inputWithSuffix"
import ReactSelect from "react-select"
import FlagButton from "../../components/inputs/flagButton"
import Input from "../../components/inputs/input"
import SearchIcon from "/public/icons/bases/search.svg?react"
import axios from "axios"
import ProductTable from "../../components/productTable"

import Cross4Icon from "/images/backgrounds/elements/cross_4.png"
import Triangle4Icon from "/images/backgrounds/elements/triangle_4.png"
import Triangle3Icon from "/images/backgrounds/elements/triangle_3.png"
import Triangle2Icon from "/images/backgrounds/elements/triangle_2.png"
import Square3Icon from "/images/backgrounds/elements/square_3.png"
import Circle3Icon from "/images/backgrounds/elements/circle_3.png"
import Circle2Icon from "/images/backgrounds/elements/circle_2.png"

import MultiRangeSlider from "../../components/multiRangeSlider"
import { ProductInterface } from "../../interfaces/productInterface"
import useWindowSize from "../../components/state/useWindowSize"
import { Link, useNavigate, useSearchParams } from "react-router-dom"



interface Genre {
    value: number;
    label: string;
}


function CatalogPage(data: any) {
    console.log(data)
    const [searchParams, _setSearchParams] = useSearchParams()

    const [CostFilterRange, setCostFilterRange] = useState<[number, number]>([500, 5000]);
    const [CostFilterRangeMinMax, setCostFilterRangeMinMax] = useState<[number, number]>([0, 0]);
    const [ListGenres, setListGenres] = useState<Genre[]>([])

    const [SelectPage, SetSelectPage] = useState(parseInt(searchParams.get("page") ?? "1"));

    const [selectedGenre, setselectedGenre] = useState<Genre>({ value: 0, "label": "Все" });

    const [isPS4, setIsPS4] = useState(false);
    const [isPS5, setIsPS5] = useState(false);

    const [isDiscount, setIsDiscount] = useState(false);
    const [isHit, setIsHit] = useState(false);
    const [isNew, setIsNew] = useState(false);

    const [Products, setProducts] = useState<ProductInterface[]>(data.products);

    const [isActiveCost, SetIsActiveCost] = useState(false);
    const [isDirectionSortingCost, SetIsDirectionCost] = useState(false);

    const [isActivePopular, SetIsActivePopular] = useState(true);
    const [isDirectionSortingPopular, SetIsDirectionPopular] = useState(false);

    const [isActiveDiscount, SetIsActiveDiscount] = useState(false);
    const [isDirectionSortingDiscount, SetIsDirectionDiscount] = useState(false);

    const [Search, SetSearch] = useState('');

    const [isStandart, setisStandart] = useState(false)
    const [isDeluxe, setisDeluxe] = useState(false)
    const [isClient, setIsClient] = useState(false)

    const [isShowMenuSettings, setisShowMenuSettings] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsClient(true)

        if (!Products.length) {
            handleClickGetProduct()
        }
    })

    useEffect(() => {
        window.moveTo(0, 0)
    }, [navigate])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/v1/get_genres/');
                const items = response.data;
                setListGenres([
                    { value: 0, label: "Все" },
                    ...items.map((item: { id: number; title: string }) => ({
                        value: item.id,
                        label: item.title,
                    }))
                ]);
            } catch (error) {
                console.error('Ошибка проверки токена:', error);
            }

            try {
                // Ожидаем завершения handleClickGetProduct
                const response = await axios.get('/api/v1/products/get_min_max_cost/');
                setCostFilterRangeMinMax([response.data["min_price"], response.data["max_price"]])
                setCostFilterRange([response.data["min_price"], response.data["max_price"]])

            } catch (error) {
                console.error('Ошибка проверки токена:', error);
            }
        };

        fetchData(); // Вызываем функцию fetchData при первой загрузке

    

    }, []);

    const handleSetIsPS4 = (value: boolean) => {
        setIsPS4(value)
    }

    const handleSetIsPS5 = (value: boolean) => {
        setIsPS5(value)
    }

    const handleSetIsDiscount = (value: boolean) => {
        setIsDiscount(value)
    }

    const handleSetIsHit = (value: boolean) => {
        setIsHit(value)
    }

    const handleSetIsNew = (value: boolean) => {
        setIsNew(value)
    }

    const handleGenreChange = (genre: any) => {
        setselectedGenre(genre);
    };

    const handleSliderChange = (newValue: any) => {
        ;
        setCostFilterRange(newValue);
    };

    const handleChangeBeginRange = (value: string) => {
        const newValue = parseInt(value, 10);

        if (newValue > 0) {
            setCostFilterRange([newValue, CostFilterRange[1]]);
        } else if (newValue < 0 || !newValue) { setCostFilterRange([0, CostFilterRange[1]]); }

        if (newValue > CostFilterRangeMinMax[1]) {
            setCostFilterRange([CostFilterRangeMinMax[1], CostFilterRange[1]]);
        }

    }

    const handleChangeEndRange = (value: string) => {
        const newValue = parseInt(value, 10);

        if (newValue > 0) {
            setCostFilterRange([CostFilterRange[0], newValue]);
        } else if (newValue < 0 || !newValue) { setCostFilterRange([CostFilterRange[0], 0]); }

        if (newValue > CostFilterRangeMinMax[1]) {
            setCostFilterRange([CostFilterRange[0], CostFilterRangeMinMax[1]]);
        }

    }

    const handleClickGetProduct = async () => {
        const platforms = [];
        if (isPS4) platforms.push('PS4');
        if (isPS5) platforms.push('PS5');

        const sortOrder = isActiveCost ? Number(!isDirectionSortingCost) : null;
        const sortPopular = isActivePopular ? Number(!isDirectionSortingPopular) : null;
        const sortDicount = isActiveDiscount ? Number(!isDirectionSortingDiscount) : null;

        try {
            const response = await axios.get('/api/v1/products/', {
                params: {
                    type: "PRODUCT",
                    page: SelectPage,
                    genre: selectedGenre['value'],
                    cost_from: CostFilterRange[0],
                    cost_to: CostFilterRange[1],
                    platforms: platforms.join(','),
                    sort_cost: sortOrder,
                    sort_discount: sortDicount,
                    sort_popular: sortPopular,
                    search: Search,
                    is_discount: isDiscount,
                    standart_or_deluxe: isDeluxe && !isStandart ? isDeluxe : false,
                    is_hit: isHit,
                    is_new: isNew,
                }
            });
            setProducts(response.data.results)
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
            throw error;
        }
    }

    const handleIsActiveCost = (value: boolean) => {
        SetIsActiveCost(value)
        SetIsActivePopular(false)
        SetIsActiveDiscount(false)
        handleClickGetProduct();
    }

    const handleIsDirectionCost = (value: boolean) => {
        SetIsDirectionCost(value)
        handleClickGetProduct();
    }

    const handleGetInput = (value: string) => {
        SetSearch(value);
    }

    const handleIsActivePopular = (value: boolean) => {
        SetIsActiveCost(false)
        SetIsActivePopular(value)
        SetIsActiveDiscount(false)
        handleClickGetProduct();
    }

    const handleIsDirectionPopular = (value: boolean) => {
        SetIsDirectionPopular(value)
        handleClickGetProduct();
    }

    const handleIsActiveDiscount = (value: boolean) => {
        SetIsActiveCost(false)
        SetIsActivePopular(false)
        SetIsActiveDiscount(value)
        handleClickGetProduct();
    }

    const handleIsDirectionDiscount = (value: boolean) => {
        SetIsDirectionDiscount(value)
        handleClickGetProduct();
    }

    const handleClickGetProductNewPage = async () => {
        const platforms = [];
        if (isPS4) platforms.push('PS4');
        if (isPS5) platforms.push('PS5');

        const sortOrder = isActiveCost ? Number(!isDirectionSortingCost) : null;
        const sortPopular = isActivePopular ? Number(!isDirectionSortingPopular) : null;
        const sortDicount = isActiveDiscount ? Number(!isDirectionSortingDiscount) : null;

        try {
            const response = await axios.get('/api/v1/products/', {
                params: {
                    type: "PRODUCT",
                    page: SelectPage + 1,
                    genre: selectedGenre['value'],
                    cost_from: CostFilterRange[0],
                    cost_to: CostFilterRange[1],
                    platforms: platforms.join(','),
                    sort_cost: sortOrder,
                    sort_discount: sortDicount,
                    sort_popular: sortPopular,
                    search: Search,
                    is_discount: isDiscount,
                    standart_or_deluxe: isDeluxe && !isStandart ? isDeluxe : false,
                    is_hit: isHit,
                    is_new: isNew,
                }
            });

            // Проверка на наличие новых продуктов
            if (response.data.results.length > 0) {
                // Добавляем новые продукты к существующим
                setProducts([...Products, ...response.data.results]);
                // Увеличиваем номер страницы
                SetSelectPage(SelectPage + 1);
            }
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (!isShowMenuSettings) return
        setIsShowAnimetionClose(true)
    }, [isShowMenuSettings])

    const [isShowAnimetionClose, setIsShowAnimetionClose] = useState(false)

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


                        <div className={styles.base_path}><Link to={"../"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Главная</Link> / <span style={{ color: " var(--color-white)" }}>Каталог</span></div>

                        <div className={styles.main_panel}>
                            <div className={styles.menu}>
                                <div className={styles.panel}>Наши предложения</div>
                                <Checkbox label="Скидка" onChange={handleSetIsDiscount} style={{ marginLeft: "12px" }} />
                                <Checkbox label="Новинка" onChange={handleSetIsNew} style={{ marginLeft: "12px" }} />
                                <Checkbox label="Хит" onChange={handleSetIsHit} style={{ marginLeft: "12px" }} />

                                <div className={styles.line} />

                                <div className={styles.panel}>Поколения приставки</div>
                                <Checkbox label="Ps5" onChange={handleSetIsPS5} style={{ marginLeft: "12px" }} />
                                <Checkbox label="Ps4" onChange={handleSetIsPS4} style={{ marginLeft: "12px" }} />

                                <div className={styles.line} />

                                <div className={styles.panel}>Жанр</div>

                                
                                {isClient && <div style={{ paddingLeft: "10px" }}>
                                    <ReactSelect className={styles.select} unstyled classNamePrefix={"select"}
                                        isSearchable={false} options={ListGenres} defaultValue={{ value: 0, label: "Все" }}
                                        onChange={handleGenreChange} />

                                </div>}

                                <div className={styles.line} />

                                <div className={styles.panel}>Издания</div>
                                <Checkbox label="Standart" style={{ marginLeft: "12px" }} onChange={setisStandart} checked={isStandart} />
                                <Checkbox label="Deluxe/Premium" style={{ marginLeft: "12px" }} onChange={setisDeluxe} checked={isDeluxe} />

                                <div className={styles.line} />

                                <div className={styles.panel}>Стоимость</div>

                                {CostFilterRangeMinMax[0] !== 0 && CostFilterRangeMinMax[1] !== 0 ?
                                    <MultiRangeSlider
                                        min={CostFilterRangeMinMax[0]}
                                        max={CostFilterRangeMinMax[1]}
                                        onChange={handleSliderChange}

                                    />
                                    : null}

                                <div style={{
                                    display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%",
                                    maxWidth: "200px", alignSelf: "center", marginTop: "-15px", color: "#D4D4D4", fontSize: "10px", fontFamily: "Unbounded_Light_Base"
                                }}>
                                    <div>от {CostFilterRangeMinMax[0]}₽</div>
                                    <div>до {CostFilterRangeMinMax[1]}₽</div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", marginTop: "15px", gap: "10px", justifyContent: "space-between", width: "100%", fontFamily: "Unbounded_Light_Base" }} className={styles.input_range_container} >
                                    <InputWithSuffix sub_styles={{ width: "101px" }} suffix="₽" suffixProps={{ style: { top: "12px" } }} inputProps={{
                                        max: CostFilterRangeMinMax[1],
                                        min: CostFilterRangeMinMax[0]
                                    }} value={String(CostFilterRange[0])} onChange={handleChangeBeginRange} />
                                    <InputWithSuffix sub_styles={{ width: "101px" }} suffix="₽" suffixProps={{ style: { top: "12px" } }} inputProps={{
                                        max: CostFilterRangeMinMax[1],
                                        min: CostFilterRangeMinMax[0]
                                    }} value={String(CostFilterRange[1])} onChange={handleChangeEndRange} />
                                </div>
                                <div className={styles.button} onClick={handleClickGetProduct}>Обновить</div>


                            </div>
                            <div className={styles.general}>
                                <div style={{ display: "flex", gap: "30px", alignItems: "center", width: "100%" }}>
                                    <h3 style={{ fontWeight: "400", textWrap: "nowrap" }}>Сортировать по:</h3>
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "765px" }}>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <FlagButton className={styles.flag_button} text="Цене" initialState={isActiveCost}
                                                onChangeActive={handleIsActiveCost} onChangeDirectionSorting={handleIsDirectionCost} />
                                            <FlagButton className={styles.flag_button} text="Популярности" initialState={isActivePopular}
                                                onChangeActive={handleIsActivePopular} onChangeDirectionSorting={handleIsDirectionPopular} />
                                            <FlagButton className={styles.flag_button} text="Скидке" initialState={isActiveDiscount}
                                                onChangeActive={handleIsActiveDiscount} onChangeDirectionSorting={handleIsDirectionDiscount} />
                                        </div>
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <Input placeholder="Поиск" style={{ width: "271px", height: "32px" }} maxlenght={30} onChange={handleGetInput} onEventEnterPressed={handleClickGetProduct} />
                                            <div style={{ position: "absolute", left: "260px", top: "32%" }}><SearchIcon onClick={handleClickGetProduct} /></div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", flexDirection: "column", height: "100%" }}>
                                    <ProductTable products={Products} />
                                    <div className={styles.button_2} onClick={handleClickGetProductNewPage} style={{}}>Показать еще</div>
                                    <Link to={"../catalog?page="+(SelectPage+1)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{
                    marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9,
                }}>
                    <Footer style={{ margin: "30px auto auto", maxWidth: "1240px", background: "none" }} />
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <BaseCenterContainer>
                    <Header />

                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", gap: "30px" }}>
                    <div className={styles.base_path}><Link to={"../"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Главная</Link> / <span style={{ color: " var(--color-white)" }}>Каталог</span></div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <Input placeholder="Поиск" style={{ width: "240px", height: "20px" }} maxlenght={30} onChange={handleGetInput} onEventEnterPressed={handleClickGetProduct} />
                                <div style={{ position: "absolute", left: "230px", top: "32%" }}><SearchIcon onClick={handleClickGetProduct} /></div>
                            </div>
                            <div className={styles.button_menu} >
                                <img src="/icons/header/Menuj.svg" width={14} onClick={() => { setisShowMenuSettings(true) }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ textWrap: "nowrap" }}>Сортировать по:</div>
                            <FlagButton className={styles.flag_button} text="Популярности" initialState={isActivePopular}
                                onChangeActive={handleIsActivePopular} onChangeDirectionSorting={handleIsDirectionPopular} />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", height: "100%" }}>
                            <ProductTable products={Products} />
                            <div className={styles.button_2} onClick={handleClickGetProductNewPage} style={{ width: "112px", fontSize: "10px", fontFamily: "Unbounded_Medium" }}>Показать еще</div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{ marginTop: "auto" }}>
                    <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                </div>

                {isShowMenuSettings ?
                    (<div className={styles.mobile_menu} style={{overflowY: "scroll"}}>
                        <div className={styles.mobile_menu_flex} style={{gap: "40px"}}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Link to="/"><img className={styles.icon} src={Logo} style={{ width: "41px", height: "39px" }} /></Link>
                                <img src={"/icons/bases/close.svg"} onClick={() => { setisShowMenuSettings(false) }} />
                            </div>

                            <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                                <div className={styles.panel} style={{padding: "0"}}>Наши предложения</div>
                                <Checkbox label="Скидка" onChange={handleSetIsDiscount} checked={isDiscount}/>
                                <Checkbox label="Новинка" onChange={handleSetIsNew} checked={isNew}/>
                                <Checkbox label="Хит" onChange={handleSetIsHit} checked={isHit}/>

                                <div className={styles.line} style={{marginLeft: "0", marginTop: "8px", marginBottom: "8px"}}/>

                                <div className={styles.panel} style={{padding: "0"}}>Поколения приставки</div>
                                <Checkbox label="Ps5" onChange={handleSetIsPS5} checked={isPS5}/>
                                <Checkbox label="Ps4" onChange={handleSetIsPS4} checked={isPS4}/>

                                <div className={styles.line} style={{marginLeft: "0", marginTop: "8px", marginBottom: "8px"}}/>

                                <div className={styles.panel}  style={{padding: "0"}}>Жанр</div>

                                {isClient && <div>
                                    <ReactSelect className={styles.select} unstyled classNamePrefix={"select"}
                                        isSearchable={false} options={ListGenres} defaultValue={{ value: 0, label: "Все" }}
                                        onChange={handleGenreChange} value={selectedGenre}/>

                                </div>}

                                <div className={styles.line} style={{marginLeft: "0", marginTop: "8px", marginBottom: "8px"}}/>

                                <div className={styles.panel} style={{padding: "0"}}>Издания</div>
                                <Checkbox label="Standart" onChange={setisStandart} checked={isStandart} />
                                <Checkbox label="Deluxe/Premium" onChange={setisDeluxe} checked={isDeluxe} />

                                <div className={styles.line} style={{marginLeft: "0", marginTop: "8px", marginBottom: "8px"}}/>

                                <div className={styles.panel} style={{padding: "0"}}>Стоимость</div>

                                {CostFilterRangeMinMax[0] !== 0 && CostFilterRangeMinMax[1] !== 0 ?
                                    <MultiRangeSlider is_mobile
                                        min={CostFilterRangeMinMax[0]}
                                        max={CostFilterRangeMinMax[1]}
                                        onChange={handleSliderChange}

                                    />
                                    : null}

                                <div style={{
                                    display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%",
                                    maxWidth: "100%", alignSelf: "center", marginTop: "-15px", color: "#D4D4D4", fontSize: "10px", fontFamily: "Unbounded_Light_Base"
                                }}>
                                    <div>от {CostFilterRangeMinMax[0]}₽</div>
                                    <div>до {CostFilterRangeMinMax[1]}₽</div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", marginTop: "5px", gap: "10px", justifyContent: "space-between", width: "100%", fontFamily: "Unbounded_Light_Base" }} className={styles.input_range_container} >
                                    <InputWithSuffix sub_styles={{ width: "152px" }} suffix="₽" suffixProps={{ style: { top: "12px" } }} inputProps={{width: "152px",
                                        max: CostFilterRangeMinMax[1],
                                        min: CostFilterRangeMinMax[0]
                                    }} value={String(CostFilterRange[0])} onChange={handleChangeBeginRange} />
                                    <InputWithSuffix sub_styles={{ width: "152px" }} suffix="₽" suffixProps={{ style: { top: "12px" } }} inputProps={{
                                        max: CostFilterRangeMinMax[1],
                                        min: CostFilterRangeMinMax[0]
                                    }} value={String(CostFilterRange[1])} onChange={handleChangeEndRange} />
                                </div>

                                <div className={styles.button} onClick={() => {handleClickGetProduct(); setisShowMenuSettings(false)}}>Обновить</div>
                            </div>
                        </div>
                    </div>)
                    : isShowAnimetionClose ? (<div className={styles.close_mobile_menu}>
                        <div className={styles.mobile_menu_flex}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Link to="/"><img className={styles.icon} src={Logo} style={{ width: "41px", height: "39px" }} /></Link>
                                <img src={"/icons/bases/close.svg"} onClick={() => { setisShowMenuSettings(false) }} />
                            </div>
                        </div>
                    </div>)
                : null}
            </div>
        )
    }
}

export default CatalogPage
