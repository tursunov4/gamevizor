import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/panels/adminTeamPanel.module.css"
import TrashIcon from "/public/icons/bases/trash.svg?react"
import EmployeeInterface from "../../interfaces/employeeInterface";
import EyeIcon from "/public/icons/bases/eye.svg?react"
import EyeCloseIcon from "/public/icons/bases/eye_crossed_out.svg?react"
import { useAuth } from "../../stores/JWTTokenStore";
import axios from "axios";
import Input from "../inputs/input";
import MyTextAreaInput from "../inputs/MyTextAreaInput";
import PromoCodeData from "../../interfaces/promoCodeData";
import ReactSelect from "react-select";
import useWindowSize from "../state/useWindowSize";
import MyReactSelect from "../inputs/MyReactSelect";


interface adminTeamPanelProps {
    promocode: PromoCodeData;
    employee: EmployeeInterface | null;
    funcDelete?: () => void;
    usersOptions: ReactSelectEmail[];
    is_edit?: boolean;
    listProduct: { value: number, label: string, type: string }[],
    listCountryWallet: { value: number, label: string }[],
}

interface ReactSelectEmail {
    value: number | null;
    label: string;
}


const AdminOffersPanel: FunctionComponent<adminTeamPanelProps> = ({ promocode, funcDelete, listProduct, listCountryWallet, usersOptions, is_edit = false }) => {
    const { accessToken } = useAuth();
    const [promocodePanel, setPromocodePanel] = useState<PromoCodeData>(promocode);

    const [isEdit, setIsEdit] = useState(is_edit);

    if (!promocodePanel?.for_product) {
        promocodePanel.for_product = "ALL"
    }

    const [isVisibleDeleteWindow, setIsVisibleDeleteWindow] = useState(false)

    const [error, setError] = useState<string>("");

    const options_for_product = {
        "ALL": "ВСЕ",
        "PRODUCT": "ПРОДУКТ",
        "SUBSCRIPTION": "ПОДПИСКА",
        "WALLET": "Пополнение счета"
    }

    useEffect(() => {

    },)

    const HandleDetele = async () => {
        try {
            const response = await axios.delete('/api/v1/admin/promocodes/' + promocodePanel.id + "/",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (response.status == 204) {
                setIsEdit(false);
                setIsVisibleDeleteWindow(false)
                if (funcDelete) funcDelete()
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));

            return
        }

    }

    const HandleSave = async (changeVisible = false) => {
        if (!accessToken) return;

        let url = '/api/v1/admin/promocodes/' + (promocodePanel.id ? promocodePanel.id + "/" : "")
        if (changeVisible) {
            promocodePanel.is_active = !promocodePanel.is_active
        }

        try {
            const response = await axios.put(url,
                promocodePanel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (response.status == 200 || response.status == 201) {
                setPromocodePanel(response.data);
                setIsEdit(false);
                setError('')
                if (funcDelete) funcDelete();
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
            if (changeVisible) promocodePanel.is_active = !promocodePanel.is_active
            return
        }



    }

    const handleCanceled = () => {
        setIsEdit(false)
        setPromocodePanel(promocode)
        setError('')
        if (funcDelete) funcDelete()
    }

    const ListType = [{ value: "PERCENT", label: "Процент" }, { value: "FIXED", label: "Фиксированная" }]


    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])


    if (width >= maxWidth) {
        return (
            <div className={styles.container}>

                {isEdit ? (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <Input label="Название" value={promocodePanel.title} onChange={(value) => { setPromocodePanel({ ...promocodePanel, title: value }) }} style={{ minHeight: "42px" }} />
                                <Input label="Выгода" value={promocodePanel.value} type="number" onChange={(value) => { value ? setPromocodePanel({ ...promocodePanel, value: parseFloat(value) }) : null }} style={{ minHeight: "42px" }} />
                                <ReactSelect
                                    className={styles.select}
                                    unstyled
                                    classNamePrefix="select"
                                    isSearchable={false}
                                    options={ListType}
                                    value={{ value: promocodePanel.type, label: ListType.find(item => item.value === promocodePanel.type)?.label }}
                                    onChange={(value: any) => { setPromocodePanel({ ...promocodePanel, type: value.value }); }} />
                            </div>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <Input label="Дата" type="date" value={promocodePanel.expiry_date} onChange={(value) => { setPromocodePanel({ ...promocodePanel, expiry_date: value }) }} style={{ minHeight: "42px" }} />
                                <MyReactSelect style={{ width: "187px" }} label="Для продукта" options={[{ value: "ALL", label: "ВСЕ" }, { value: "PRODUCT", label: "ПРОДУКТ" },
                                { value: "SUBSCRIPTION", label: "ПОДПИСКА" }, { value: "WALLET", label: "КОШЕЛЕК" }]}
                                    value={{ value: promocodePanel?.for_product, label: options_for_product[promocodePanel?.for_product] }}
                                    onChange={(value) => { setPromocodePanel({ ...promocodePanel, for_product: value.value as "ALL" | "PRODUCT" | "SUBSCRIPTION" | "WALLET" }) }} />

                                <Input label="Кол. Использований" type="number" value={promocodePanel.number_of_uses}
                                    onChange={(value) => { setPromocodePanel({ ...promocodePanel, number_of_uses: parseInt(value) }) }} />
                            </div>

                            {promocodePanel.for_product === "PRODUCT" ? <MyReactSelect isSearchable label="Выберите продукт"
                                value={{ value: promocodePanel.select_product, label: listProduct.find(item => item.value == promocodePanel.select_product)?.label }}
                                onChange={(value) => { setPromocodePanel({ ...promocodePanel, select_product: value.value as number }) }}
                                options={listProduct.filter(item => item.type == "PRODUCT")} /> : null}

                            {promocodePanel.for_product === "SUBSCRIPTION" ? <MyReactSelect isSearchable label="Выберите подписку"
                                value={{ value: promocodePanel.select_product, label: listProduct.find(item => item.value == promocodePanel.select_product)?.label }}
                                onChange={(value) => { setPromocodePanel({ ...promocodePanel, select_product: value.value as number }) }}
                                options={listProduct.filter(item => item.type == "SUBSCRIPTION")} /> : null}

                            {promocodePanel.for_product === "WALLET" ? <MyReactSelect isSearchable label="Выберите страну пополнения"
                                value={{ value: promocodePanel.select_product, label: listCountryWallet.find(item => item.value == promocodePanel.select_wallet)?.label }}
                                onChange={(value) => { setPromocodePanel({ ...promocodePanel, select_wallet: value.value as number }) }}
                                options={listCountryWallet} /> : null}

                            <ReactSelect
                                className={styles.select_2}
                                unstyled
                                classNamePrefix="select"
                                options={usersOptions}
                                value={{ value: promocodePanel?.for_user, label: usersOptions.find(item => item.value == promocodePanel?.for_user)?.label }}
                                onChange={(value: any) => { setPromocodePanel({ ...promocodePanel, for_user: value.value }); }} />
                            <MyTextAreaInput value={promocodePanel.description} onChange={(value) => { setPromocodePanel({ ...promocodePanel, description: value }) }} style={{ height: "150px", resize: "none" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-end" }}>
                                <div onClick={() => { HandleSave(true) }}>{promocodePanel.is_active === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeIcon width={16} height={16} /></span>
                                    : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeCloseIcon width={16} height={16} /></span>}</div>
                                <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={HandleDetele}>Удалить <TrashIcon fill="#FF6062" /></div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <div>{error}</div>
                                <div className={styles.button} onClick={() => { HandleSave() }} style={{ width: "128px" }}>Сохранить</div>
                                <div onClick={handleCanceled} style={{ cursor: "pointer" }}>Закрыть / Отмена</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "30px" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ width: "100px", textWrap: "wrap" }}>{promocode.title}</div>
                            <div style={{ width: "80px", textWrap: "nowrap" }}>{promocode.type === "FIXED" ? promocode.value + " ₽" : promocode.value + " %"}</div>
                            <div style={{ width: "100px" }}>{options_for_product[promocode?.for_product ? promocode?.for_product : "ALL"]}</div>
                        </div>
                        <div style={{ display: "flex", gap: "35px" }}>
                            <div style={{ width: "50px" }}>{promocode?.number_of_uses_now}/{promocode?.number_of_uses}</div>
                            <div style={{ width: "200px", textWrap: "nowrap" }}>{usersOptions.find(item => item.value === promocodePanel?.for_user)?.label}</div>
                            <div style={{ textWrap: "nowrap" }}>{promocode.expiry_date ? promocode.expiry_date : "бессрочно"}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", alignItems: "flex-end", width: "100px" }}>
                                <div onClick={() => { setIsEdit(true) }} style={{ color: 'white', textDecoration: 'underline', cursor: "pointer" }}>Редактировать</div>
                                <div onClick={() => { HandleSave(true) }}>{promocodePanel.is_active === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeIcon width={16} height={16} /></span>
                                    : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeCloseIcon width={16} height={16} /></span>}</div>
                                <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить <TrashIcon fill="#FF6062" /></div>
                            </div>
                        </div>
                    </div>
                )}

                {isVisibleDeleteWindow && (
                    <div className={styles.background_delete} onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsVisibleDeleteWindow(false);
                        }
                    }}>
                        <div className={styles.container_delete}>
                            <img src="/icons/bases/trash_delete.svg" width={200} />
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <h1>Удалить?</h1>
                                <div className={styles.button} onClick={HandleDetele}>Да</div>
                                <div className={styles.button} onClick={() => setIsVisibleDeleteWindow(false)} style={{ backgroundColor: "rgba(194, 194, 194, 0.14)" }}>Нет</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    } else {
        return (
            <div className={styles.container}>

                {isEdit ?
                    (
                        <div style={{ display: 'flex', flexDirection: "column", gap: "20px" }}>
                            <Input label="Название" value={promocodePanel.title} onChange={(value) => { setPromocodePanel({ ...promocodePanel, title: value }) }} style={{ minHeight: "42px" }} />
                            <Input label="Выгода" value={promocodePanel.value} type="number" onChange={(value) => { value ? setPromocodePanel({ ...promocodePanel, value: parseFloat(value) }) : null }} style={{ minHeight: "42px" }} />
                            <ReactSelect
                                className={styles.select}
                                unstyled
                                classNamePrefix="select"
                                isSearchable={false}
                                options={ListType}
                                value={{ value: promocodePanel.type, label: ListType.find(item => item.value === promocodePanel.type)?.label }}
                                defaultValue={{ value: promocodePanel.type, label: ListType.find(item => item.value === promocodePanel.type)?.label }}
                                onChange={(value: any) => { setPromocodePanel({ ...promocodePanel, type: value.value }); }} />

                            <div style={{ display: "flex", gap: "25px" }}>
                                <MyReactSelect style={{ width: "187px" }} label="Для продукта" options={[{ value: "ALL", label: "ВСЕ" }, { value: "PRODUCT", label: "ПРОДУКТ" },
                                { value: "SUBSCRIPTION", label: "ПОДПИСКА" }, { value: "WALLET", label: "КОШЕЛЕК" }]}
                                    value={{ value: promocodePanel?.for_product, label: options_for_product[promocodePanel?.for_product] }}
                                    onChange={(value) => { setPromocodePanel({ ...promocodePanel, for_product: value.value as "ALL" | "PRODUCT" | "SUBSCRIPTION" | "WALLET" }) }} />

                                <Input label="Кол. Использований" type="number" value={promocodePanel.number_of_uses}
                                    onChange={(value) => { setPromocodePanel({ ...promocodePanel, number_of_uses: parseInt(value) }) }} />
                            </div>

                            {promocodePanel.for_product === "PRODUCT" ? <MyReactSelect isSearchable label="Выберите продукт"
                                value={{ value: promocodePanel.select_product, label: listProduct.find(item => item.value == promocodePanel.select_product)?.label }}
                                onChange={(value) => { setPromocodePanel({ ...promocodePanel, select_product: value.value as number }) }}
                                options={listProduct.filter(item => item.type == "PRODUCT")} /> : null}

                            {promocodePanel.for_product === "SUBSCRIPTION" ? <MyReactSelect isSearchable label="Выберите подписку"
                                value={{ value: promocodePanel.select_product, label: listProduct.find(item => item.value == promocodePanel.select_product)?.label }}
                                onChange={(value) => { setPromocodePanel({ ...promocodePanel, select_product: value.value as number }) }}
                                options={listProduct.filter(item => item.type == "SUBSCRIPTION")} /> : null}

                            {promocodePanel.for_product === "WALLET" ? <MyReactSelect isSearchable label="Выберите страну пополнения"
                                value={{ value: promocodePanel.select_product, label: listCountryWallet.find(item => item.value == promocodePanel.select_wallet)?.label }}
                                onChange={(value) => { setPromocodePanel({ ...promocodePanel, select_wallet: value.value as number }) }}
                                options={listCountryWallet} /> : null}


                            <ReactSelect
                                className={styles.select_2}
                                unstyled
                                classNamePrefix="select"
                                options={usersOptions}
                                value={{ value: promocodePanel?.for_user, label: usersOptions.find(item => item.value == promocodePanel?.for_user)?.label }}
                                onChange={(value: any) => { setPromocodePanel({ ...promocodePanel, for_user: value.value }); }} />
                            <MyTextAreaInput value={promocodePanel.description} onChange={(value) => { setPromocodePanel({ ...promocodePanel, description: value }) }} style={{ height: "150px", resize: "none" }} />

                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-end" }}>
                                    <div onClick={() => { HandleSave(true) }}>{promocodePanel.is_active === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeIcon width={16} height={16} /></span>
                                        : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeCloseIcon width={16} height={16} /></span>}</div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={HandleDetele}>Удалить <TrashIcon fill="#FF6062" /></div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                    <div>{error}</div>
                                    <div className={styles.button} onClick={() => { HandleSave() }} style={{ width: "128px" }}>Сохранить</div>
                                    <div onClick={handleCanceled} style={{ cursor: "pointer" }}>Закрыть / Отмена</div>
                                </div>
                            </div>
                        </div>
                    ) :
                    (
                        <div style={{ display: 'flex', flexDirection: "column", gap: "20px" }}>
                            <div>Название: <span style={{ color: "white" }}>{promocode.title}</span></div>
                            <div>Выгода: <span style={{ color: "white" }}>{promocode.type === "FIXED" ? promocode.value + " ₽" : promocode.value + " %"}</span></div>
                            <div>Описание: <span style={{ color: "white" }}>{promocode.description}</span></div>
                            <div>Пользователь: <span style={{ color: "white" }}>{usersOptions.find(item => item.value === promocodePanel?.for_user)?.label}</span></div>
                            <div>Кол. использований: {promocode.number_of_uses_now}/{[promocode.number_of_uses]}</div>
                            <div>Для продукта: {options_for_product[promocode?.for_product ? promocode?.for_product : "ALL"]}</div>
                            <div>Дата: <span style={{ color: "white" }}>{promocode.expiry_date ? promocode.expiry_date : "бессрочно"}</span></div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", alignItems: "flex-end", width: "100px", alignSelf: "flex-end" }}>
                                <div onClick={() => { setIsEdit(true) }} style={{ color: 'white', textDecoration: 'underline', cursor: "pointer" }}>Редактировать</div>
                                <div onClick={() => { HandleSave(true) }}>{promocodePanel.is_active === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeIcon width={16} height={16} /></span>
                                    : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeCloseIcon width={16} height={16} /></span>}</div>
                                <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить <TrashIcon fill="#FF6062" /></div>
                            </div>
                        </div>
                    )
                }

                {isVisibleDeleteWindow && (
                    <div className={styles.background_delete} onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsVisibleDeleteWindow(false);
                        }
                    }}>
                        <div className={styles.container_delete} style={{ width: "280px", left: "6%", top: "15%" }}>
                            <img src="/icons/bases/trash_delete.svg" width={200} />
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <h1>Удалить?</h1>
                                <div className={styles.button} onClick={HandleDetele}>Да</div>
                                <div className={styles.button} onClick={() => setIsVisibleDeleteWindow(false)} style={{ backgroundColor: "rgba(194, 194, 194, 0.14)" }}>Нет</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
};

export default AdminOffersPanel