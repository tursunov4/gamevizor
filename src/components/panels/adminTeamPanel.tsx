import { FunctionComponent, useEffect, useId, useState } from "react"
import styles from "../../styles/panels/adminTeamPanel.module.css"
import ReactSelect from "react-select";
import Input from "../inputs/input";
import TrashIcon from "/public/icons/bases/trash.svg?react"
import MyPhoneInput from "../inputs/MyPhoneInput";
import MyTextAreaInput from "../inputs/MyTextAreaInput";
import Checkbox from "../inputs/checkbox";
import EmployeeInterface, { EmployeeRoleInterface } from "../../interfaces/employeeInterface";
import BaseImageProfileImage from "/images/bases/base_image_for_profile.png"
import axios from "axios";
import { useAuth } from "../../stores/JWTTokenStore";
import { useUser } from "../../stores/userStore";
import MyReactSelect from "../inputs/MyReactSelect";
import useWindowSize from "../state/useWindowSize";


interface adminTeamPanelProps {
    staff: EmployeeInterface;
    employee: EmployeeInterface | null;
    roles: EmployeeRoleInterface[];
    funcDelete?: () => void;
}


const adminTeamPanel: FunctionComponent<adminTeamPanelProps> = ({ staff, employee, roles, funcDelete }) => {
    const { accessToken } = useAuth();
    const [staffPanel, setStaffPanel] = useState<EmployeeInterface>(staff);

    const { } = useUser();

    const [error, setError] = useState<string>("");

    const [isEdit, setIsEdit] = useState(false);

    const [isVisibleDeleteWindow, setIsVisibleDeleteWindow] = useState(false)

    const handleIsEdit = () => {
        setIsEdit(true);
    }

    const handleisCanceled = () => {
        setStaffPanel(staff);
        setIsEdit(false);
    }

    const HandleChangeUsername = (value: string) => {
        setStaffPanel(
            {
                ...staffPanel,
                user: {
                    ...staffPanel.user,
                    username: value,
                },
            })
    }

    const HandleSave = async () => {

        if (!accessToken) return;

        try {
            delete staffPanel.user.profile.image
            const response = await axios.put('/api/v1/admin/staffs/' + staffPanel.id + "/",
                staffPanel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 200) {
                setStaffPanel(response.data);
                setIsEdit(false);
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
        }
    }

    const HandleDelete = async () => {

        if (!accessToken) return;

        try {
            delete staffPanel.user.profile.image
            const response = await axios.delete('/api/v1/admin/staffs/' + staffPanel.id + "/",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 204) {
                setIsEdit(false);
                if (funcDelete) { funcDelete() }
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
        }
    }

    const handleCheckboxChange = (permission: string) => {
        if (staffPanel.permissions.includes(permission)) {
            setStaffPanel({ ...staffPanel, permissions: staffPanel.permissions.filter((item) => item !== permission) });
        } else {
            setStaffPanel({ ...staffPanel, permissions: [...staffPanel.permissions, permission] });
        }
    };

    const handleImageUpdate = async (e: any) => {
        const file = e.target.files[0];

        if (!file) {
            return; // Нет файла для загрузки
        }
        const data = new FormData();
        data.append("profile[image]", file)
        data.append("id", staffPanel?.id.toString())
        const response = await axios.put('/api/v1/admin/staffs/' + staffPanel.id + "/",
            data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }); // Ваш API-endpoint
        if (response.status == 200) {
            setStaffPanel(response.data);
            setIsEdit(false);
        }


    }


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
                    <div style={{ display: "flex", gap: "25px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <img
                                src={staffPanel?.user.profile.image ? staffPanel?.user.profile.image : BaseImageProfileImage}
                                style={{ width: '80px', borderRadius: "50%", height: "80px" }} />
                            <div style={{ maxWidth: "80px" }}>
                                <label htmlFor="icon" className={styles.change_image} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                    <div style={{ cursor: "pointer", pointerEvents: "initial" }}>Изменить фото</div>
                                </label>
                                <input id="icon" style={{ visibility: "hidden" }} type="file" onChange={handleImageUpdate} />
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <Input value={staffPanel.user.username} onChange={HandleChangeUsername} style={{ width: "279px", height: "32px" }} label="Имя" />
                                <Input value={"@" + staffPanel.user.nickname} style={{ width: "279px", height: "32px" }} label="Никнейм" />
                            </div>

                            <MyTextAreaInput style={{ height: "82px", resize: "none" }} label={"О себе"} placeholder={"Расскажите о себе"} value={staffPanel.about_me} onChange={(value) => { setStaffPanel({ ...staffPanel, about_me: value }) }} />

                            <div style={{ display: "flex", gap: "25px" }}>
                                <MyPhoneInput value={staffPanel.user.phone_number} style={{ width: "279px" }} label={"Телефон"} />
                                <Input style={{ width: "279px", height: "32px" }} label="Телеграм" value={staffPanel.telegram} onChange={(value) => { setStaffPanel({ ...staffPanel, telegram: value }) }} />
                            </div>

                            <div>Выберите доступные сотруднику права:</div>

                            <div style={{ display: "flex", gap: "25px" }}>
                                <div style={{ width: "69px" }}>Команда:</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <Checkbox label={"Добавление новых сотрудников"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("create_employee")} onChange={() => handleCheckboxChange("create_employee")} />
                                    <Checkbox label={"Выдача прав сотрудникам"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("add_permissions_for_employee")} onChange={() => handleCheckboxChange("add_permissions_for_employee")} />
                                    <Checkbox label={"Право на просмотр статистики"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("view_stats")} onChange={() => handleCheckboxChange("view_stats")} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <div style={{ width: "69px" }}>Товары:</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <Checkbox label={"Добавление новых товаров"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("add_products")} onChange={() => handleCheckboxChange("add_products")} />
                                    <Checkbox label={"Редактирование стоимости"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("edit_prices")} onChange={() => handleCheckboxChange("edit_prices")} />
                                    <Checkbox label={"Удаление товаров"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("delete_products")} onChange={() => handleCheckboxChange("delete_products")} />
                                    <Checkbox label={"Скрытие товаров"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("hide_products")} onChange={() => handleCheckboxChange("hide_products")} />
                                    <Checkbox label={"Редактирование информации товара"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("edit_product_info")} onChange={() => handleCheckboxChange("edit_product_info")} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <div style={{ width: "69px" }}>Клиенты:</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <Checkbox label={"Блокировка и удаление пользователей"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("delete_and_block_users")} onChange={() => handleCheckboxChange("delete_and_block_users")} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <div style={{ width: "69px" }}>Промо:</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <Checkbox label={"Создание промокодов"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("create_promocodes")} onChange={() => handleCheckboxChange("create_promocodes")} />
                                    <Checkbox label={"Создание скидок и акций"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("create_discounts")} onChange={() => handleCheckboxChange("create_discounts")} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <div style={{ width: "69px" }}>Чаты:</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <Checkbox label={"Создание чатов с командой"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("create_chats")} onChange={() => handleCheckboxChange("create_chats")} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <div style={{ width: "69px" }}>Форум:</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <Checkbox label={"Управление форумом"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("manage_forum")} onChange={() => handleCheckboxChange("manage_forum")} />
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "25px", alignItems: "flex-end" }}>
                                <div style={{ width: "69px" }}>Пополнение кошелька:</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <Checkbox label={"Создание правил для пополнение кошелька"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                        checked={staffPanel.permissions.includes("change_wallet_rules")} onChange={() => handleCheckboxChange("change_wallet_rules")} />
                                </div>
                            </div>

                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", alignItems: "flex-end" }}>
                                {staffPanel?.id === employee?.id ?
                                    <Input label={"Роль сотрудника"} value={roles.find((role) => role.value === staffPanel?.role)?.label} style={{ width: "170px", height: "32px", color: "#D4D4D4" }} isDisabled />
                                    :
                                    <MyReactSelect
                                        isSearchable={false}
                                        options={roles.filter((role) => role.value > (0 ?? employee?.role))}
                                        defaultValue={roles.find((role) => role.value === staffPanel?.role)}
                                        onChange={(value: any) => setStaffPanel({ ...staffPanel, role: value.value })}
                                        label={"Роль сотрудника"}
                                        style={{ width: "194px" }}
                                        isDisabled={staffPanel?.id === employee?.id} />}


                                {(staffPanel?.id === employee?.id) || (employee && employee.role > staffPanel.role) ?
                                    (<div style={{ display: "flex", justifyContent: "center", gap: "5px", cursor: "not-allowed" }}>Удалить сотрудника <TrashIcon fill="#D4D4D4" /></div>) :
                                    (<div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить сотрудника <TrashIcon fill="#FF6062" /></div>)}
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
                        <div style={{ display: 'flex', gap: '30px' }}>
                            <img
                                src={staffPanel?.user.profile.image ? staffPanel?.user.profile.image : BaseImageProfileImage}
                                style={{ width: '80px', borderRadius: "50%", height: "80px" }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ color: "white" }}>{staffPanel.user.username}{"  "}<span style={{ color: "rgba(255, 255, 255, 0.4)" }}>({roles.find((role) => role.value === staffPanel?.role)?.label})</span></div>
                                <div>Краткое описание о себе</div>
                                <div>{staffPanel.user.phone_number}</div>
                                <div>{staffPanel.user.nickname}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '30px' }}>
                            <div onClick={handleIsEdit} style={{ color: 'white', textDecoration: 'underline', cursor: "pointer" }}>Редактировать</div>
                            <Input label={"Роль сотрудника"} value={roles.find((role) => role.value === staffPanel?.role)?.label} style={{ width: "170px", height: "32px" }} isDisabled />
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                <img
                                    src={staffPanel?.user.profile.image ? staffPanel?.user.profile.image : BaseImageProfileImage}
                                    style={{ width: '80px', borderRadius: "50%", height: "80px" }} />
                                <div style={{ maxWidth: "80px" }}>
                                    <label htmlFor="icon" className={styles.change_image} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                        <div style={{ cursor: "pointer", pointerEvents: "initial", textAlign: "center" }}>Изменить фото</div>
                                    </label>
                                    <input id="icon" style={{ visibility: "hidden" }} type="file" onChange={handleImageUpdate} />
                                </div>
                            </div>
                            <div>
                                {(staffPanel?.id === employee?.id) || (employee && employee.role > staffPanel.role) ?
                                    (<div style={{ display: "flex", justifyContent: "center", gap: "5px", cursor: "not-allowed" }}>Удалить сотрудника <TrashIcon fill="#D4D4D4" /></div>) :
                                    (<div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить сотрудника <TrashIcon fill="#FF6062" /></div>)}
                            </div>
                        </div>

                        <Input value={staffPanel.user.username} onChange={HandleChangeUsername} style={{ width: "279px", height: "32px" }} label="Имя" />
                        <Input value={"@" + staffPanel.user.nickname} style={{ width: "279px", height: "32px" }} label="Никнейм" />

                        <MyTextAreaInput style={{ height: "82px", resize: "none" }} label={"О себе"} placeholder={"Расскажите о себе"} value={staffPanel.about_me} onChange={(value) => { setStaffPanel({ ...staffPanel, about_me: value }) }} />

                        <MyPhoneInput value={staffPanel.user.phone_number} style={{ width: "295px" }} label={"Телефон"} />
                        <Input style={{ width: "279px", height: "32px" }} label="Телеграм" value={staffPanel.telegram} onChange={(value) => { setStaffPanel({ ...staffPanel, telegram: value }) }} />

                        {staffPanel?.id === employee?.id ?
                            <Input label={"Роль сотрудника"} value={roles.find((role) => role.value === staffPanel?.role)?.label} style={{ width: "170px", height: "32px", color: "#D4D4D4" }} isDisabled />
                            :
                            <MyReactSelect
                                isSearchable={false}
                                options={roles.filter((role) => role.value > (0 ?? employee?.role))}
                                defaultValue={roles.find((role) => role.value === staffPanel?.role)}
                                onChange={(value: any) => setStaffPanel({ ...staffPanel, role: value.value })}
                                label={"Роль сотрудника"}
                                style={{ width: "194px" }}
                                isDisabled={staffPanel?.id === employee?.id} />}

                        <div>Выберите доступные сотруднику права:</div>

                        <div style={{ width: "69px" }}>Команда:</div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Добавление новых сотрудников"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("create_employee")} onChange={() => handleCheckboxChange("create_employee")} />
                            <Checkbox label={"Выдача прав сотрудникам"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("add_permissions_for_employee")} onChange={() => handleCheckboxChange("add_permissions_for_employee")} />
                            <Checkbox label={"Право на просмотр статистики"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("view_stats")} onChange={() => handleCheckboxChange("view_stats")} />
                        </div>

                        <div style={{ width: "69px" }}>Товары:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Добавление новых товаров"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("add_products")} onChange={() => handleCheckboxChange("add_products")} />
                            <Checkbox label={"Редактирование стоимости"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("edit_prices")} onChange={() => handleCheckboxChange("edit_prices")} />
                            <Checkbox label={"Удаление товаров"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("delete_products")} onChange={() => handleCheckboxChange("delete_products")} />
                            <Checkbox label={"Скрытие товаров"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("hide_products")} onChange={() => handleCheckboxChange("hide_products")} />
                            <Checkbox label={"Редактирование информации товара"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("edit_product_info")} onChange={() => handleCheckboxChange("edit_product_info")} />
                        </div>

                        <div style={{ width: "69px" }}>Клиенты:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Блокировка и удаление пользователей"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("delete_and_block_users")} onChange={() => handleCheckboxChange("delete_and_block_users")} />
                        </div>

                        <div style={{ width: "69px" }}>Промо:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Создание промокодов"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("create_promocodes")} onChange={() => handleCheckboxChange("create_promocodes")} />
                            <Checkbox label={"Создание скидок и акций"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("create_discounts")} onChange={() => handleCheckboxChange("create_discounts")} />
                        </div>


                        <div style={{ width: "69px" }}>Чаты:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Создание чатов с командой"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("create_chats")} onChange={() => handleCheckboxChange("create_chats")} />
                        </div>


                        <div style={{ width: "69px" }}>Форум:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Управление форумом"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("manage_forum")} onChange={() => handleCheckboxChange("manage_forum")} />
                        </div>

                        <div style={{ width: "69px" }}>Пополнение кошелька:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Создание правил для пополнение кошелька"} disabled={staff.id === employee?.id || !((0 ?? employee?.role) < staff.role)}
                                checked={staffPanel.permissions.includes("change_wallet_rules")} onChange={() => handleCheckboxChange("change_wallet_rules")} />
                        </div>


                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                            <div>{error}</div>
                            <div className={styles.button} onClick={HandleSave} style={{}}>Сохранить</div>
                            <div onClick={handleisCanceled} style={{ cursor: "pointer" }}>Закрыть / Отмена</div>
                        </div>
                    </div>
                )
                    : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", gap: "20px" }}>
                                <img
                                    src={staffPanel?.user.profile.image ? staffPanel?.user.profile.image : BaseImageProfileImage}
                                    style={{ width: '40px', borderRadius: "50%", height: "40px", border: "2px solid white" }} />
                                <div style={{ color: "white" }}>{staffPanel.user.username}{"  "}<span style={{ color: "rgba(255, 255, 255, 0.4)" }}>({roles.find((role) => role.value === staffPanel?.role)?.label})</span></div>
                            </div>
                            <div style={{ color: "white" }}>{staffPanel.about_me || "Краткое описание о себе"}</div>
                            <div style={{ color: "white" }}>{staffPanel.user.phone_number}</div>
                            <div style={{ color: "white" }}>{staffPanel.user.nickname}</div>
                            <div>Роль: </div>
                            <Input label={"Роль сотрудника"} value={roles.find((role) => role.value === staffPanel?.role)?.label} style={{ width: "170px", height: "32px" }} isDisabled />
                            <div onClick={handleIsEdit} style={{ color: 'white', textDecoration: 'underline', cursor: "pointer", alignSelf: "center" }}>Редактировать</div>
                        </div>
                    )}
            </div>
        )
    }

};

export default adminTeamPanel