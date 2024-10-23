import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/panels/adminTeamPanel.module.css"
import TrashIcon from "/public/icons/bases/trash.svg?react"
import EmployeeInterface from "../../interfaces/employeeInterface";
import EyeIcon from "/public/icons/bases/eye.svg?react"
import EyeCloseIcon from "/public/icons/bases/eye_crossed_out.svg?react"
import { useAuth } from "../../stores/JWTTokenStore";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { NewFileProductInteface, PlatformProductInterface, ProductInterface } from "../../interfaces/productInterface";
import Input from "../inputs/input";
import MyTextAreaInput from "../inputs/MyTextAreaInput";
import Checkbox from "../inputs/checkbox";
import ReactSelect from "react-select";
import { Link } from "react-router-dom";
import useWindowSize from "../state/useWindowSize";


interface adminTeamPanelProps {
    product: ProductInterface;
    employee: EmployeeInterface | null;
    funcDelete?: () => void;
    is_edit?: boolean;
    platforms: PlatformProductInterface[];
}

interface Genre {
    id: number;
    title: string;

    created_on: string,
    updated_on: string,
}

const AdminProductPanel: FunctionComponent<adminTeamPanelProps> = ({ product, funcDelete, platforms, is_edit = false }) => {
    const { accessToken } = useAuth();
    const [productPanel, setProductPanel] = useState<ProductInterface>(product);

    const [isEdit, setIsEdit] = useState(is_edit);


    const [error, setError] = useState<string>("");

    const [generalImage, setGeneralImage] = useState<File | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<File | null>(null);

    const [images, setImages] = useState<NewFileProductInteface[]>([])

    const [_image5, setImage5] = useState<File | null>(null);
    const [_image4, setImage4] = useState<File | null>(null);
    const [image3, setImage3] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [image1, setImage1] = useState<File | null>(null);

    const [genres, setGenres] = useState<Genre[]>([])

    const [isVisibleDeleteWindow, setIsVisibleDeleteWindow] = useState(false)

    const platforms_subscriptions = [{ value: "PS_PLUS", label: "PS PLUS" }, { value: "EA_PLAY", label: "EA PLAY" }, { value: "XBOX_ULTIMATE", label: "XBOX ULTIMATE" }]


    useEffect(() => {
        if (!isEdit) return
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/v1/get_genres/');
                setGenres(response.data)
            } catch (error) {

            }
        }
        fetchData();
    }, [accessToken, isEdit])


    const HandleDetele = async () => {
        try {
            const response = await axios.delete('/api/v1/admin/products/' + productPanel.id + "/",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (response.status == 204) {
                setIsEdit(false);
                if (funcDelete) funcDelete()
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));

            return
        }

    }

    const HandleSave = async (changeVisible = false) => {
        if (!accessToken) return;

        let url = '/api/v1/admin/products/' + productPanel.id + "/"
        if (!productPanel?.id) {
            url = '/api/v1/admin/products/'
        }

        if (productPanel?.cost == 0) delete productPanel.cost

        if (productPanel?.discount === null) delete productPanel.discount

        if (changeVisible) {
            productPanel.is_visible = !productPanel.is_visible
        }

        delete productPanel?.general_image
        delete productPanel?.background_image
        delete productPanel?.images_or_videos

        try {
            var response = await axios.put(url,
                productPanel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (response.status == 200) {
                setProductPanel(response.data);
                setIsEdit(false);
                setError('')
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
            if (changeVisible) productPanel.is_visible = !productPanel.is_visible
            return
        }

        url = '/api/v1/admin/products/' + response.data.id + "/"

        const data = new FormData();
        if (generalImage) {
            data.append("general_image", generalImage)
        }
        if (backgroundImage) {
            data.append("background_image", backgroundImage)
        }
        const sortedImages = images.sort((a, b) => a.position - b.position);
        if (images) {
            sortedImages.forEach((image, index) => {
                data.append(`images_or_videos[${index}]`, image.file); // Добавляем каждый файл отдельно
                data.append(`images_or_videos_position[${index}]`, String(image.position));
            });
        }

        try {
            const response = await axios.put(url,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (response.status == 200) {
                setProductPanel(response.data);
                setIsEdit(false);
                setError('')
                setGeneralImage(null)
                setImage5(null)
                setImage4(null)
                setImage3(null)
                setImage2(null)
                setImage1(null)
                setImages([])
                if (funcDelete) funcDelete()
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
        }


    }

    const HandleAddPlatforms = (title: string) => {
        const platform = platforms.filter((item) => item.title == title)[0]
        if (!platform) return
        if (productPanel.platforms?.filter((item) => item.title == title).length === 1) {
            setProductPanel({ ...productPanel, platforms: productPanel.platforms.filter((item) => item.title !== platform.title) })
        } else {
            setProductPanel({ ...productPanel, platforms: [...productPanel.platforms, platform] })
        }
    }

    const handleCanceled = () => {
        setIsEdit(false)
        setProductPanel(product)
        setError('')
        setGeneralImage(null)
        setImage5(null)
        setImage4(null)
        setImage3(null)
        setImage2(null)
        setImage1(null)

        if (funcDelete) funcDelete()
    }

    const handleAddImages = (e: any, position: number) => {
        if (!e.target.files) {
            return
        }
        const file = e.target.files[0]

        const existingIndex = images.findIndex(image => image.position === position);

        if (existingIndex !== -1) {
            // Заменить существующий элемент
            setImages(prevImages => [
                ...prevImages.slice(0, existingIndex),
                { ...prevImages[existingIndex], file: file },
                ...prevImages.slice(existingIndex + 1)
            ]);
        } else {
            // Добавить новый элемент
            setImages(prevImages => [
                ...prevImages,
                { file: file, position }
            ]);
        }
    }

    useEffect(() => {
        console.log(images)
    }, [images])


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
                        <div style={{ display: "flex", gap: "50px" }}>

                            <div style={{ display: "flex", flexDirection: "column", maxWidth: "80px" }}>
                                <label htmlFor={"general_image" + productPanel?.id} className={styles.change_image} style={{
                                    width: "80px", textAlign: "center", color: "#C2C2C2",
                                    display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none"
                                }}>
                                    <img src={generalImage ? URL.createObjectURL(generalImage) : (productPanel.general_image || "/images/bases/new_photo.png")}
                                        width={"80px"} height={"80px"} style={{ borderRadius: "10px", cursor: "pointer", pointerEvents: "initial" }} />
                                    <div style={{ cursor: "pointer", pointerEvents: "initial" }}>Добавьте главное фото</div>
                                </label>
                                <input id={"general_image" + productPanel?.id} style={{ visibility: "hidden" }} multiple={false} accept="image/*" type="file" onChange={(e) => { setGeneralImage(e.target.files ? e.target.files[0] : null) }} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <Input placeholder={"Добавьте название товара"} value={productPanel.title} label={"Название"} style={{ width: "642px", height: "42px" }} onChange={(value) => { setProductPanel({ ...productPanel, title: value }) }} />
                                {productPanel?.product_type == "PRODUCT" ?
                                    <MyTextAreaInput label={"Описание"} placeholder={"Добавьте краткое описание ..."} value={productPanel.description} style={{ resize: "none", height: "77px" }} onChange={(value: string) => { setProductPanel({ ...productPanel, description: value }) }} />
                                    : null}
                                <div style={{ display: "flex", gap: "25px" }}>
                                    <Input placeholder={"Добавьте цену товара"} value={productPanel.cost} label={"Цена"} style={{ width: "194px", height: "42px" }} type="number" onChange={(value: string) => { setProductPanel({ ...productPanel, cost: Number(value) }) }} />
                                    <Input placeholder={"Добавьте скидкой для товара"} label={"Скидка"} style={{ width: "194px", height: "42px" }}
                                        type="number" value={productPanel?.discount?.discount_cost} onChange={(value) => { setProductPanel({ ...productPanel, discount: { discount_cost: parseFloat(value), data_to_end: productPanel?.discount?.data_to_end ?? "" } }) }} />
                                    <Input type="date" style={{ width: "194px", height: "42px", colorScheme: "dark" }} value={productPanel.discount?.data_to_end}
                                        label="Дата окончания скидки" onChange={(value) => { setProductPanel({ ...productPanel, discount: { discount_cost: productPanel.discount?.discount_cost ?? -1, data_to_end: value } }) }} />
                                </div>
                                <div style={{ display: "flex", gap: "25px" }}>
                                    <div>Вид товара:</div>
                                    { /* <Checkbox label="Все товары (по умолчанию)" checked={productPanel?.product_type === "ALL"} onChange={(value) => { value ? setProductPanel({ ...productPanel, product_type: "ALL" }) : null }} /> */}
                                    <Checkbox label="Подписка" checked={productPanel?.product_type === "SUBSCRIPTION"} onChange={(value) => { value ? setProductPanel({ ...productPanel, product_type: "SUBSCRIPTION" }) : null }} />
                                    <Checkbox label="Игра" checked={productPanel?.product_type === "PRODUCT"} onChange={(value) => { value ? setProductPanel({ ...productPanel, product_type: "PRODUCT" }) : null }} />
                                    <Checkbox label="Валюта" checked={productPanel?.product_type === "CURRENCY"} onChange={(value) => { value ? setProductPanel({ ...productPanel, product_type: "CURRENCY" }) : null }} />
                                </div>

                                {productPanel?.product_type == "SUBSCRIPTION" ?
                                    <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
                                        <div>Подписка для:</div>
                                        <ReactSelect
                                            className={styles.new_select}
                                            unstyled
                                            classNamePrefix="my_select"
                                            isSearchable={false}
                                            options={platforms_subscriptions}
                                            defaultValue={{ value: productPanel.subscription_type, label: platforms_subscriptions.find(item => item.value === productPanel.subscription_type)?.label }}

                                            onChange={(value) => { setProductPanel({ ...productPanel, subscription_type: value?.value }) }}
                                        />

                                    </div>
                                    : null}

                                {productPanel?.product_type == "SUBSCRIPTION" ? <div style={{ height: "5px" }} /> : null}

                                {productPanel?.product_type == "SUBSCRIPTION" ?
                                    <Input placeholder="введите число " label="длительность подписки" type="number" min={1} style={{ width: "200px", height: "42px" }}
                                        value={productPanel?.subscription_duration_mouth} onChange={(value) => { setProductPanel({ ...productPanel, subscription_duration_mouth: parseFloat(value) }) }} />
                                    : null}

                                {productPanel?.product_type == "PRODUCT" || productPanel?.product_type == "CURRENCY" ?
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div>Поколение PS:</div>
                                        <Checkbox label="PS4" checked={productPanel?.platforms.some(platforms => platforms.title === 'PS4')} onChange={() => HandleAddPlatforms("PS4")} />
                                        <Checkbox label="PS5" checked={productPanel?.platforms.some(platforms => platforms.title === 'PS5')} onChange={() => HandleAddPlatforms("PS5")} />
                                    </div>
                                    : null}

                                {productPanel?.product_type == "PRODUCT" ?
                                    <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
                                        <div>Выбор издания:</div>
                                        <Checkbox label="Это deluxe/premium издание?" checked={productPanel.is_deluxe_or_premium} onChange={(value) => setProductPanel({ ...productPanel, is_deluxe_or_premium: value })} />
                                    </div>
                                    : null}

                                {productPanel?.product_type == "PRODUCT" && productPanel.is_deluxe_or_premium ?
                                    <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
                                        <div>Настройки deluxe/premium издания:</div>

                                    </div>
                                    : null}


                                {productPanel?.product_type == "PRODUCT" && productPanel.is_deluxe_or_premium ?
                                    <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
                                        <Input placeholder="Цена" value={productPanel.deluxe_or_premium_cost} label="Цена deluxe/premium издания" min={1} style={{ width: "200px", height: "42px" }}
                                            onChange={(value) => setProductPanel({ ...productPanel, deluxe_or_premium_cost: parseFloat(value) })} />

                                        <Input placeholder="Скидка" value={productPanel.deluxe_or_premium_discount?.discount_cost} label="Скидка deluxe/premium издания" min={1} style={{ width: "200px", height: "42px" }}
                                            onChange={(value) => setProductPanel({
                                                ...productPanel, deluxe_or_premium_discount:
                                                    { discount_cost: parseFloat(value), data_to_end: productPanel?.deluxe_or_premium_discount?.data_to_end ?? "" }
                                            })} />

                                        <Input type="date" style={{ width: "194px", height: "42px", colorScheme: "dark" }} value={productPanel.deluxe_or_premium_discount?.data_to_end}
                                            label="Дата окончания скидки" onChange={(value) => { setProductPanel({ ...productPanel, deluxe_or_premium_discount: { discount_cost: productPanel.deluxe_or_premium_discount?.discount_cost ?? -1, data_to_end: value } }) }} />
                                    </div>
                                    : null}


                                {productPanel?.product_type == "PRODUCT" || productPanel?.product_type == "CURRENCY" ?
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div>Метки:</div>
                                        <Checkbox label="Хит" checked={productPanel?.is_hit} onChange={(value) => setProductPanel({ ...productPanel, is_hit: value })} />
                                        <Checkbox label="Новинка" checked={productPanel?.is_novelty} onChange={(value) => setProductPanel({ ...productPanel, is_novelty: value })} />
                                    </div>
                                    : null}

                                {productPanel?.product_type == "PRODUCT" ?
                                    <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
                                        <div>Жанры:</div>
                                        <ReactSelect
                                            className={styles.new_select}
                                            unstyled
                                            classNamePrefix="my_select"
                                            getOptionLabel={option => option.title}
                                            getOptionValue={option => option.id.toString()}
                                            isSearchable={false}
                                            options={genres}
                                            defaultValue={productPanel.genre}

                                            onChange={(value) => { setProductPanel({ ...productPanel, genre: value as typeof genres }) }}
                                            isMulti
                                        />

                                    </div>
                                    : null}

                                {productPanel?.product_type == "PRODUCT" ?
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div>Есть ли русский язык:</div>
                                        <Checkbox label="Русская озвучка" checked={productPanel?.is_rus_voice} onChange={(value) => setProductPanel({ ...productPanel, is_rus_voice: value })} />
                                        <Checkbox label="Русские субтитры" checked={productPanel?.is_rus_subtitle} onChange={(value) => setProductPanel({ ...productPanel, is_rus_subtitle: value })} />
                                    </div>
                                    : null}

                                {productPanel?.product_type == "PRODUCT" ?
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "80px" }}>
                                            <label htmlFor={"image_1_" + productPanel?.id} className={styles.change_image}
                                                style={{ width: "76px", textAlign: "center", color: "#C2C2C2", fontSize: "0.6rem", display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none", cursor: "pointer" }}>
                                                <img src={image1 ? URL.createObjectURL(image1) : (productPanel.images_or_videos?.find(image => image.position === 1)?.file || "/images/bases/new_photo.png")}
                                                    width={"80px"} height={"80px"} style={{ pointerEvents: "initial" }} />
                                                <div style={{ pointerEvents: "initial", cursor: "pointer" }}>Добавьте фото</div>
                                            </label>
                                            <input id={"image_1_" + productPanel?.id} style={{ visibility: "hidden" }} multiple={false} accept="image/*" type="file" onChange={(e) => { handleAddImages(e, 1); setImage1(e.target.files ? e.target.files[0] : null) }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "80px" }}>
                                            <label htmlFor={"image_2_" + productPanel?.id} className={styles.change_image}
                                                style={{ width: "76px", textAlign: "center", color: "#C2C2C2", fontSize: "0.6rem", display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none", cursor: "pointer" }}>
                                                <img src={image2 ? URL.createObjectURL(image2) : (productPanel.images_or_videos?.find(image => image.position === 2)?.file || "/images/bases/new_photo.png")}
                                                    width={"80px"} height={"80px"} style={{ pointerEvents: "initial" }} />
                                                <div style={{ pointerEvents: "initial", cursor: "pointer" }}>Добавьте фото</div>
                                            </label>
                                            <input id={"image_2_" + productPanel?.id} style={{ visibility: "hidden" }} multiple={false} accept="image/*" type="file" onChange={(e) => { handleAddImages(e, 2); setImage2(e.target.files ? e.target.files[0] : null) }} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", maxWidth: "80px" }}>
                                            <label htmlFor={"image_3_" + productPanel?.id} className={styles.change_image}
                                                style={{ width: "76px", textAlign: "center", color: "#C2C2C2", fontSize: "0.6rem", display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none", cursor: "pointer" }}>
                                                <img src={image3 ? URL.createObjectURL(image3) : (productPanel.images_or_videos?.find(image => image.position === 3)?.file || "/images/bases/new_photo.png")}
                                                    width={"80px"} height={"80px"} style={{ pointerEvents: "initial" }} />
                                                <div style={{ pointerEvents: "initial", cursor: "pointer" }}>Добавьте фото</div>
                                            </label>
                                            <input id={"image_3_" + productPanel?.id} style={{ visibility: "hidden" }} multiple={false} accept="image/*" type="file" onChange={(e) => { handleAddImages(e, 3); setImage3(e.target.files ? e.target.files[0] : null) }} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "80px" }}>
                                            <label htmlFor={"background_image_" + productPanel?.id} className={styles.change_image}
                                                style={{ width: "76px", textAlign: "center", color: "#C2C2C2", fontSize: "0.6rem", display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none", cursor: "pointer" }}>
                                                <img src={backgroundImage ? URL.createObjectURL(backgroundImage) : (productPanel.background_image || "/images/bases/new_background_photo.png")}
                                                    width={"80px"} height={"80px"} style={{ pointerEvents: "initial" }} />
                                                <div style={{ pointerEvents: "initial", cursor: "pointer" }}>Добавить фон</div>
                                            </label>
                                            <input id={"background_image_" + productPanel?.id} style={{ visibility: "hidden" }} multiple={false} accept="image/*" type="file" onChange={(e) => { setBackgroundImage(e.target.files ? e.target.files[0] : null) }} />

                                        </div>
                                    </div>
                                    : null}
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "250px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-end" }}>
                                <div onClick={() => { HandleSave(true) }}>{productPanel.is_visible === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeIcon width={16} height={16} /></span>
                                    : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeCloseIcon width={16} height={16} /></span>}</div>
                                <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить <TrashIcon fill="#FF6062" /></div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <div>{error}</div>
                                <div className={styles.button} onClick={() => { HandleSave() }} style={{ width: "128px" }}>Сохранить</div>
                                <div onClick={handleCanceled} style={{ cursor: "pointer" }}>Закрыть / Отмена</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: "40px" }}>
                            <img src={productPanel.general_image ? productPanel.general_image : "https://placehold.co/80"} width={"80px"} height={"80px"} style={{ borderRadius: "10px" }} />
                            {productPanel?.product_type === "PRODUCT" ?
                                <Link to={"../product/" + product.id} style={{ color: "white" }}>{productPanel.title}</Link>
                                : <div style={{ color: "white" }}>{productPanel.title}</div>}
                        </div>
                        <div style={{ display: "flex", gap: "50px" }}>
                            <div>
                                {productPanel.discount && productPanel.cost ?
                                    (<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                            <div style={{ color: "#FF007A" }}>{productPanel.cost - productPanel.discount.discount_cost} ₽</div>
                                            <div style={{ color: "#C2C2C2", fontSize: "0.6rem" }}>до {format(parseISO(productPanel.discount.data_to_end), 'dd.MM.yy')}</div>
                                        </div>
                                        <div style={{ color: "white" }}>{productPanel.cost} ₽</div>
                                    </div>)
                                    : (
                                        <div style={{ color: "white" }}>{productPanel.cost} ₽</div>
                                    )}
                            </div>
                            <div onClick={() => { setIsEdit(true) }} style={{ color: 'white', textDecoration: 'underline' }}>Редактировать</div>
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

            </div >
        )
    } else {
        return (
            <div className={styles.container}>
                {isEdit ?
                    (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
                                <div style={{ display: "flex", flexDirection: "column", maxWidth: "80px" }}>
                                    <label htmlFor={"general_image" + productPanel?.id} className={styles.change_image} style={{
                                        width: "120px", textAlign: "center", color: "#C2C2C2",
                                        display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none"
                                    }}>
                                        <img src={generalImage ? URL.createObjectURL(generalImage) : (productPanel.general_image || "/images/bases/new_photo.png")}
                                            width={"120px"} height={"120px"} style={{ borderRadius: "10px", cursor: "pointer", pointerEvents: "initial" }} />
                                        <div style={{ cursor: "pointer", pointerEvents: "initial" }}>Добавьте главное фото</div>
                                    </label>
                                    <input id={"general_image" + productPanel?.id} style={{ visibility: "hidden" }} multiple={false} accept="image/*" type="file" onChange={(e) => { setGeneralImage(e.target.files ? e.target.files[0] : null) }} />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-end" }}>
                                    <div onClick={() => { HandleSave(true) }}>{productPanel.is_visible === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeIcon width={16} height={16} /></span>
                                        : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeCloseIcon width={16} height={16} /></span>}</div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить <TrashIcon fill="#FF6062" /></div>
                                </div>
                            </div>

                            <Input placeholder={"Добавьте название товара"} value={productPanel.title} label={"Название"} style={{ width: "642px", height: "42px" }} onChange={(value) => { setProductPanel({ ...productPanel, title: value }) }} />
                            {productPanel?.product_type == "PRODUCT" ?
                                <MyTextAreaInput label={"Описание"} placeholder={"Добавьте краткое описание ..."} value={productPanel.description} style={{ resize: "none", height: "77px" }} onChange={(value: string) => { setProductPanel({ ...productPanel, description: value }) }} />
                                : null}
                            <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                                <Input placeholder={"Добавьте цену товара"} value={productPanel.cost} label={"Цена"} style={{ width: "194px", height: "42px" }} type="number" onChange={(value: string) => { setProductPanel({ ...productPanel, cost: Number(value) }) }} />
                                <Input placeholder={"Добавьте скидкой для товара"} label={"Скидка"} style={{ width: "194px", height: "42px" }}
                                    type="number" value={productPanel?.discount?.discount_cost} onChange={(value) => { setProductPanel({ ...productPanel, discount: { discount_cost: parseFloat(value), data_to_end: productPanel?.discount?.data_to_end ?? "" } }) }} />
                                <Input type="date" style={{ width: "194px", height: "42px", colorScheme: "dark" }} value={productPanel.discount?.data_to_end}
                                    label="Дата окончания скидки" onChange={(value) => { setProductPanel({ ...productPanel, discount: { discount_cost: productPanel.discount?.discount_cost ?? -1, data_to_end: value } }) }} />
                            </div>
                            <div style={{ display: "flex", gap: "25px", flexDirection: 'column' }}>
                                <div>Вид товара:</div>
                                { /* <Checkbox label="Все товары (по умолчанию)" checked={productPanel?.product_type === "ALL"} onChange={(value) => { value ? setProductPanel({ ...productPanel, product_type: "ALL" }) : null }} /> */}
                                <Checkbox label="Подписка" checked={productPanel?.product_type === "SUBSCRIPTION"} onChange={(value) => { value ? setProductPanel({ ...productPanel, product_type: "SUBSCRIPTION" }) : null }} />
                                <Checkbox label="Игра" checked={productPanel?.product_type === "PRODUCT"} onChange={(value) => { value ? setProductPanel({ ...productPanel, product_type: "PRODUCT" }) : null }} />
                                <Checkbox label="Валюта" checked={productPanel?.product_type === "CURRENCY"} onChange={(value) => { value ? setProductPanel({ ...productPanel, product_type: "CURRENCY" }) : null }} />
                            </div>

                            {productPanel?.product_type == "SUBSCRIPTION" ?
                                <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
                                    <div>Подписка для:</div>
                                    <ReactSelect
                                        className={styles.new_select}
                                        unstyled
                                        classNamePrefix="my_select"
                                        isSearchable={false}
                                        options={platforms_subscriptions}
                                        defaultValue={{ value: productPanel.subscription_type, label: platforms_subscriptions.find(item => item.value === productPanel.subscription_type)?.label }}

                                        onChange={(value) => { setProductPanel({ ...productPanel, subscription_type: value?.value }) }}
                                    />

                                </div>
                                : null}

                            {productPanel?.product_type == "SUBSCRIPTION" ? <div style={{ height: "5px" }} /> : null}

                            {productPanel?.product_type == "SUBSCRIPTION" ?
                                <Input placeholder="введите число " label="длительность подписки" type="number" min={1} style={{ width: "200px", height: "42px" }}
                                    value={productPanel?.subscription_duration_mouth} onChange={(value) => { setProductPanel({ ...productPanel, subscription_duration_mouth: parseFloat(value) }) }} />
                                : null}

                            {productPanel?.product_type == "PRODUCT" || productPanel?.product_type == "CURRENCY" ?
                                <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                                    <div>Поколение PS:</div>
                                    <Checkbox label="PS4" checked={productPanel?.platforms.some(platforms => platforms.title === 'PS4')} onChange={() => HandleAddPlatforms("PS4")} />
                                    <Checkbox label="PS5" checked={productPanel?.platforms.some(platforms => platforms.title === 'PS5')} onChange={() => HandleAddPlatforms("PS5")} />
                                </div>
                                : null}

                            {productPanel?.product_type == "PRODUCT" ?
                                <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                                    <div>Выбор издания:</div>
                                    <Checkbox label="Это deluxe/premium издание?" checked={productPanel.is_deluxe_or_premium} onChange={(value) => setProductPanel({ ...productPanel, is_deluxe_or_premium: value })} />
                                </div>
                                : null}

                            {productPanel?.product_type == "PRODUCT" && productPanel.is_deluxe_or_premium ?
                                <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                                    <div>Настройки deluxe/premium издания:</div>

                                </div>
                                : null}


                            {productPanel?.product_type == "PRODUCT" && productPanel.is_deluxe_or_premium ?
                                <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                                    <Input placeholder="Цена" value={productPanel.deluxe_or_premium_cost} label="Цена deluxe/premium издания" min={1} style={{ width: "200px", height: "42px" }}
                                        onChange={(value) => setProductPanel({ ...productPanel, deluxe_or_premium_cost: parseFloat(value) })} />

                                    <Input placeholder="Скидка" value={productPanel.deluxe_or_premium_discount?.discount_cost} label="Скидка deluxe/premium издания" min={1} style={{ width: "200px", height: "42px" }}
                                        onChange={(value) => setProductPanel({
                                            ...productPanel, deluxe_or_premium_discount:
                                                { discount_cost: parseFloat(value), data_to_end: productPanel?.deluxe_or_premium_discount?.data_to_end ?? "" }
                                        })} />

                                    <Input type="date" style={{ width: "194px", height: "42px", colorScheme: "dark" }} value={productPanel.deluxe_or_premium_discount?.data_to_end}
                                        label="Дата окончания скидки" onChange={(value) => { setProductPanel({ ...productPanel, deluxe_or_premium_discount: { discount_cost: productPanel.deluxe_or_premium_discount?.discount_cost ?? -1, data_to_end: value } }) }} />
                                </div>
                                : null}


                            {productPanel?.product_type == "PRODUCT" || productPanel?.product_type == "CURRENCY" ?
                                <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                                    <div>Метки:</div>
                                    <Checkbox label="Хит" checked={productPanel?.is_hit} onChange={(value) => setProductPanel({ ...productPanel, is_hit: value })} />
                                    <Checkbox label="Новинка" checked={productPanel?.is_novelty} onChange={(value) => setProductPanel({ ...productPanel, is_novelty: value })} />
                                </div>
                                : null}

                            {productPanel?.product_type == "PRODUCT" ?
                                <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
                                    <div>Жанры:</div>
                                    <ReactSelect
                                        className={styles.new_select}
                                        unstyled
                                        classNamePrefix="my_select"
                                        getOptionLabel={option => option.title}
                                        getOptionValue={option => option.id.toString()}
                                        isSearchable={false}
                                        options={genres}
                                        defaultValue={productPanel.genre}

                                        onChange={(value) => { setProductPanel({ ...productPanel, genre: value as typeof genres }) }}
                                        isMulti
                                    />

                                </div>
                                : null}

                            {productPanel?.product_type == "PRODUCT" ?
                                <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                                    <div>Есть ли русский язык:</div>
                                    <Checkbox label="Русская озвучка" checked={productPanel?.is_rus_voice} onChange={(value) => setProductPanel({ ...productPanel, is_rus_voice: value })} />
                                    <Checkbox label="Русские субтитры" checked={productPanel?.is_rus_subtitle} onChange={(value) => setProductPanel({ ...productPanel, is_rus_subtitle: value })} />
                                </div>
                                : null}

                            {productPanel?.product_type == "PRODUCT" ?
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "80px" }}>
                                            <label htmlFor={"image_1_" + productPanel?.id} className={styles.change_image}
                                                style={{ width: "76px", textAlign: "center", color: "#C2C2C2", fontSize: "0.6rem", display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none", cursor: "pointer" }}>
                                                <img src={image1 ? URL.createObjectURL(image1) : (productPanel.images_or_videos?.find(image => image.position === 1)?.file || "/images/bases/new_photo.png")}
                                                    width={"80px"} height={"80px"} style={{ pointerEvents: "initial" }} />
                                                <div style={{ pointerEvents: "initial", cursor: "pointer" }}>Добавьте фото</div>
                                            </label>
                                            <input id={"image_1_" + productPanel?.id} style={{ visibility: "hidden", display: "none" }} multiple={false} accept="image/*" type="file" onChange={(e) => { handleAddImages(e, 1); setImage1(e.target.files ? e.target.files[0] : null) }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "80px" }}>
                                            <label htmlFor={"image_2_" + productPanel?.id} className={styles.change_image}
                                                style={{ width: "76px", textAlign: "center", color: "#C2C2C2", fontSize: "0.6rem", display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none", cursor: "pointer" }}>
                                                <img src={image2 ? URL.createObjectURL(image2) : (productPanel.images_or_videos?.find(image => image.position === 2)?.file || "/images/bases/new_photo.png")}
                                                    width={"80px"} height={"80px"} style={{ pointerEvents: "initial" }} />
                                                <div style={{ pointerEvents: "initial", cursor: "pointer" }}>Добавьте фото</div>
                                            </label>
                                            <input id={"image_2_" + productPanel?.id} style={{ visibility: "hidden", display: "none" }} multiple={false} accept="image/*" type="file" onChange={(e) => { handleAddImages(e, 2); setImage2(e.target.files ? e.target.files[0] : null) }} />
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", maxWidth: "80px" }}>
                                            <label htmlFor={"image_3_" + productPanel?.id} className={styles.change_image}
                                                style={{ width: "76px", textAlign: "center", color: "#C2C2C2", fontSize: "0.6rem", display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none", cursor: "pointer" }}>
                                                <img src={image3 ? URL.createObjectURL(image3) : (productPanel.images_or_videos?.find(image => image.position === 3)?.file || "/images/bases/new_photo.png")}
                                                    width={"80px"} height={"80px"} style={{ pointerEvents: "initial" }} />
                                                <div style={{ pointerEvents: "initial", cursor: "pointer" }}>Добавьте фото</div>
                                            </label>
                                            <input id={"image_3_" + productPanel?.id} style={{ visibility: "hidden", display: "none" }} multiple={false} accept="image/*" type="file" onChange={(e) => { handleAddImages(e, 3); setImage3(e.target.files ? e.target.files[0] : null) }} />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "80px" }}>
                                            <label htmlFor={"background_image_" + productPanel?.id} className={styles.change_image}
                                                style={{ width: "76px", textAlign: "center", color: "#C2C2C2", fontSize: "0.6rem", display: "flex", flexDirection: "column", gap: "25px", pointerEvents: "none", cursor: "pointer" }}>
                                                <img src={backgroundImage ? URL.createObjectURL(backgroundImage) : (productPanel.background_image || "/images/bases/new_background_photo.png")}
                                                    width={"80px"} height={"80px"} style={{ pointerEvents: "initial" }} />
                                                <div style={{ pointerEvents: "initial", cursor: "pointer" }}>Добавить фон</div>
                                            </label>
                                            <input id={"background_image_" + productPanel?.id} style={{ visibility: "hidden" }} multiple={false} accept="image/*" type="file" onChange={(e) => { setBackgroundImage(e.target.files ? e.target.files[0] : null) }} />

                                        </div>
                                    </div>
                                </div>
                                : null}

                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <div>{error}</div>
                                <div className={styles.button} onClick={() => { HandleSave() }} style={{ width: "250px" }}>Сохранить</div>
                                <div onClick={handleCanceled} style={{ cursor: "pointer" }}>Закрыть / Отмена</div>
                            </div>

                        </div>
                    )
                    :
                    (
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
                            <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                                <div style={{ color: "white", display: "flex", gap: "10px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Название: </span>{productPanel?.product_type == "PRODUCT" ? "Игра" : "Подписка"} {productPanel.title}
                                    {" "} {productPanel.product_type === "SUBSCRIPTION" && `${productPanel.subscription_duration_mouth} мес`}</div>

                                <div style={{ color: "white", display: "flex", gap: "10px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Цена: </span>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div>{productPanel.cost}</div>
                                        {productPanel?.discount &&
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <div style={{ color: "#FF007A" }}>{(productPanel?.cost ?? 0) - (productPanel?.discount?.discount_cost ?? 0)} ₽</div>
                                                <div style={{ color: "#C2C2C2", fontSize: "0.6rem" }}>до {format(parseISO(productPanel?.discount?.data_to_end ?? ""), 'dd.MM.yy')}</div>
                                            </div>}
                                    </div>
                                </div>

                                <div style={{ color: "white", display: "flex", gap: "10px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Действия: </span><span onClick={() => { setIsEdit(true) }} style={{ textDecoration: "underline" }}>Редактировать</span></div>
                            </div>

                            <img src={productPanel.general_image ? productPanel.general_image : "https://placehold.co/42"} width={"42px"} height={"42px"} style={{ borderRadius: "10px" }} />
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

export default AdminProductPanel