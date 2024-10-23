import { FunctionComponent, useEffect, useState } from "react";
import { adminWalletCountryInterface, adminWalletInterface } from "../../../interfaces/admin/walletInterface"
import { useUser } from "../../../stores/userStore";
import useWindowSize from "../../state/useWindowSize";

import TrashIcon from "/public/icons/bases/trash.svg?react"

import styles from "../../../styles/panels/adminTeamPanel.module.css"
import { useAuth } from "../../../stores/JWTTokenStore";
import axios from "axios";
import Input from "../../inputs/input";
import MyReactSelect from "../../inputs/MyReactSelect";
import { prependListener } from "process";


interface Props {
    panel: adminWalletInterface
    is_edit?: boolean;
    country_wallets: adminWalletCountryInterface[];
    funcDelete?: () => void;
}

const RuleWalletPanel: FunctionComponent<Props> = ({ panel, funcDelete, country_wallets, is_edit = false }) => {
    const { accessToken } = useAuth();
    const [ruleWalletPanel, setRuleWalletPanel] = useState<adminWalletInterface>(panel);

    const { } = useUser();

    const [error, setError] = useState<string>("");

    const [isEdit, setIsEdit] = useState(is_edit);
    const [isVisibleDeleteWindow, setIsVisibleDeleteWindow] = useState(false)

    const options_county = country_wallets.map((country) => ({
        value: country.id,
        label: country.title,
    }));

    const handleIsEdit = () => {
        setIsEdit(true);
    }

    const handleisCanceled = () => {
        setRuleWalletPanel(panel);
        setIsEdit(false);
        if (funcDelete) { funcDelete() }
    }

    const HandleSave = async () => {

        if (!accessToken) return;

        if (String(ruleWalletPanel?.coefficient).length) ruleWalletPanel.coefficient = parseFloat(String(ruleWalletPanel?.coefficient))

        try {
            const response = await axios.put('/api/v1/admin/wallet_rules/' + (ruleWalletPanel?.id ? ruleWalletPanel.id + "/" : ""),
                ruleWalletPanel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 201 || response.status == 200) {
                setRuleWalletPanel(response.data);
                setIsEdit(false);
                setError("")

                if (funcDelete) { funcDelete() }
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
        }
    }

    const HandleDelete = async () => {

        if (!accessToken) return;

        try {
            const response = await axios.delete('/api/v1/admin/wallet_rules/' + (ruleWalletPanel?.id ? ruleWalletPanel.id + "/" : ""),
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 204) {
                setIsEdit(false);
                setIsVisibleDeleteWindow(false)
                if (funcDelete) { funcDelete() }
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
        }
    }

    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    const options = [{ value: ">", label: ">" }, { value: ">=", label: ">=" }, { value: "=", label: "=" }, { value: "<", label: "<" }, { value: "<=", label: "<=" },]

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])


    if (width >= maxWidth) {
        return (
            <div className={styles.container} style={{ height: isEdit ? '200px' : "" }}>
                {isEdit ? (
                    <div style={{ display: "flex", justifyContent: "space-between", height: "100%" }}>
                        <div style={{ display: 'flex', gap: "25px", flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: "25px", alignItems: "center" }}>
                                <Input label={"От"} value={ruleWalletPanel.start_range} onChange={(value) => {
                                    value.length ? setRuleWalletPanel({ ...ruleWalletPanel, start_range: parseFloat(value) }) :
                                        setRuleWalletPanel({ ...ruleWalletPanel, start_range: null })
                                }} />
                                <MyReactSelect defaultValue={{ value: ruleWalletPanel.start_sign_of_the_expression, label: ruleWalletPanel.start_sign_of_the_expression }} options={options} style={{ height: "fit-content", width: "100px" }} label="Знак" onChange={(value) => {
                                    setRuleWalletPanel({ ...ruleWalletPanel, start_sign_of_the_expression: value.value as string })
                                }}
                                />

                                (Число)

                                <MyReactSelect defaultValue={{ value: ruleWalletPanel.end_sign_of_the_expression, label: ruleWalletPanel.end_sign_of_the_expression }} options={options} style={{ height: "fit-content", width: "100px" }} label="Знак" onChange={(value) => {
                                    setRuleWalletPanel({ ...ruleWalletPanel, end_sign_of_the_expression: value.value as string })
                                }}
                                />

                                <Input label={"До"} value={ruleWalletPanel.end_range} onChange={(value) => {
                                    value.length ? setRuleWalletPanel({ ...ruleWalletPanel, end_range: parseFloat(value) }) :
                                        setRuleWalletPanel({ ...ruleWalletPanel, end_range: null })
                                }} />
                            </div>
                            <div style={{ display: 'flex', gap: "25px" }}>
                                <Input value={ruleWalletPanel.coefficient} label={"Коффицент"} onChange={(value) => {
                                    setRuleWalletPanel({ ...ruleWalletPanel, coefficient: value })
                                }} />

                                <MyReactSelect value={{ value: ruleWalletPanel.select_county, label: options_county.find(country => country.value === ruleWalletPanel.select_county)?.label }} options={options_county} style={{ height: "fit-content", width: "200px" }} label="Правила для страны" onChange={(value) => {
                                    setRuleWalletPanel({ ...ruleWalletPanel, select_county: parseFloat(String(value.value) ?? "0") })
                                }}
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                            <div style={{ display: 'flex', gap: '10px', flexDirection: "column", alignItems: "flex-end", width: "92px", alignSelf: "flex-end" }}>
                                <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={HandleDelete}>Удалить <TrashIcon fill="#FF6062" /></div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <div>{error}</div>
                                <div className={styles.button} onClick={HandleSave} style={{}}>Сохранить</div>
                                <div onClick={handleisCanceled} style={{ cursor: "pointer" }}>Закрыть / Отмена</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: 'flex', gap: '100px' }}>
                            <div>{ruleWalletPanel.start_range} {ruleWalletPanel.start_sign_of_the_expression} (x) {ruleWalletPanel.end_sign_of_the_expression} {ruleWalletPanel.end_range}</div>
                            <div style={{ width: "70px" }}>{ruleWalletPanel.coefficient}</div>
                            <div>{country_wallets.find(item => item.id === ruleWalletPanel.select_county)?.title}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '90px' }}>
                            <div>

                            </div>
                            <div style={{ width: "193.98px" }}>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: "column", alignItems: "flex-start", width: "92px", marginLeft: "auto" }}>
                                    <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { setIsEdit(true) }}>Изменить</div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить <TrashIcon fill="#FF6062" /></div>
                                </div>

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
                                <div className={styles.button} onClick={HandleDelete}>Да</div>
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
                {isEdit ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                            <Input label={"От"} value={ruleWalletPanel.start_range} onChange={(value) => {
                                value.length ? setRuleWalletPanel({ ...ruleWalletPanel, start_range: parseFloat(value) }) :
                                    setRuleWalletPanel({ ...ruleWalletPanel, start_range: null })
                            }} />
                            <MyReactSelect defaultValue={{ value: ruleWalletPanel.start_sign_of_the_expression, label: ruleWalletPanel.start_sign_of_the_expression }} options={options} style={{ height: "fit-content", width: "100px" }} label="Знак" onChange={(value) => {
                                setRuleWalletPanel({ ...ruleWalletPanel, start_sign_of_the_expression: value.value as string })
                            }}
                            />

                            (Число)
                        </div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <MyReactSelect defaultValue={{ value: ruleWalletPanel.end_sign_of_the_expression, label: ruleWalletPanel.end_sign_of_the_expression }} options={options} style={{ height: "fit-content", width: "100px" }} label="Знак" onChange={(value) => {
                                setRuleWalletPanel({ ...ruleWalletPanel, end_sign_of_the_expression: value.value as string })
                            }}
                            />

                            <Input label={"До"} value={ruleWalletPanel.end_range} onChange={(value) => {
                                value.length ? setRuleWalletPanel({ ...ruleWalletPanel, end_range: parseFloat(value) }) :
                                    setRuleWalletPanel({ ...ruleWalletPanel, end_range: null })
                            }} />
                        </div>

                        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                            <Input value={ruleWalletPanel.coefficient} label={"Коффицент"} onChange={(value) => {
                                setRuleWalletPanel({ ...ruleWalletPanel, coefficient: value })
                            }} />

                            <MyReactSelect value={{ value: ruleWalletPanel.select_county, label: options_county.find(country => country.value === ruleWalletPanel.select_county)?.label }} options={options_county} style={{ height: "fit-content", width: "200px" }} label="Правила для страны" onChange={(value) => {
                                setRuleWalletPanel({ ...ruleWalletPanel, select_county: parseFloat(String(value.value) ?? "0") })
                            }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <div>{error}</div>
                                <div className={styles.button} onClick={() => { HandleSave() }} style={{ width: "250px" }}>Сохранить</div>
                                <div onClick={handleisCanceled} style={{ cursor: "pointer" }}>Закрыть / Отмена</div>
                            </div>
                    </div>
                )
                    : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                                <div>Правило: </div>
                                <div>{ruleWalletPanel.start_range} {ruleWalletPanel.start_sign_of_the_expression} (x) {ruleWalletPanel.end_sign_of_the_expression} {ruleWalletPanel.end_range}</div>
                            </div>
                            <div style={{ display: "flex", gap: "20px" }}>
                                <div>Коффицент:</div>
                                <div>{ruleWalletPanel.coefficient}</div>
                            </div>
                            <div style={{ display: "flex", gap: "20px" }}>
                                <div>Тип валюты:</div>
                                <div>{country_wallets.find(item => item.id === ruleWalletPanel.select_county)?.title}</div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: "column", alignItems: "flex-start", width: "92px", marginLeft: "auto" }}>
                                    <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { setIsEdit(true) }}>Изменить</div>
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
                        <div className={styles.container_delete} style={{ width: "280px", left: "6%", top: "15%" }}>
                            <img src="/icons/bases/trash_delete.svg" width={200} />
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <h1>Удалить?</h1>
                                <div className={styles.button} onClick={HandleDelete}>Да</div>
                                <div className={styles.button} onClick={() => setIsVisibleDeleteWindow(false)} style={{ backgroundColor: "rgba(194, 194, 194, 0.14)" }}>Нет</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

}

export default RuleWalletPanel;