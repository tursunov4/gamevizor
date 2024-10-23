import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/fifthFrame.module.css"
import InfoPanel from "../infoQuestionPanel"
import InfoPanelContext from "../../context/infoQuestionPanel"
import InformationList from "../informationList"
import useWindowSize from "../state/useWindowSize"


const FifthFrame: FunctionComponent = () => {
    const [activePanels, setActivePanels] = useState([true, false, false, false]);
    const [selectInformation, setSelectInformation] = useState<number>(0)

    const information_list: Record<number, { title: string; text: string; }[]> = {
        0: [{ title: "Что такое шеринг?", text: "Шеринг – метод деления аккаунт на несколько устройств." },
        { title: "У меня будут работать все функции подписки?", text: 'Да, все функции будут работать. Больше ответов вы найдёте в разделе "Подписка"' },
        { title: "Это безопасно?", text: 'Наш метод безопасный, никаких последствий использования его не будет! Больше ответов на ваши вопросы можете найти в разделе "Безопасность"' }
        ],
        1: [{
            title: "Какие игры будут доступны в подписке?", text: `Основная просто базовая подписка, дается доступ к мультиплееру, и каждый месяц даются 3 бесплатные игры
Экстра те же самые функции что и в основном, а также большой каталог игр, более 400
В Люкс на 100+ игр больше, в основном это каталог классики с играми от PS1, PS2, PSP
` },
        { title: "Будет ли русский язык в играх?", text: "Да,  95% игр с нашей подпиской имеют русскую озвучку, либо субтитры" },
        { title: "Где будут сохранения? ", text: "Все сохранения останутся на вашем основном аккаунте любого региона" },
        { title: "Будет ли работать онлайн?", text: "Да, онлайн игры будут работать на вашем аккаунте в любое время" },
        ],
        2: [{ title: "Будет ли кто-то иметь доступ к моему личному аккаунту?", text: "Нет такой технической возможности, к вашему аккаунту ни у кого доступа не будет" },
        { title: "Сможет ли кто-то играть с моими сохранениями?", text: "Никто не сможет испортить ваши сохранения, потому что вы играете со своего аккаунта" },
        {
            title: "Заблокируют ли мой аккаунт?", text: `Ваш аккаунт не заблокируют, данному способу деления подписок уже много лет, на рынке масса предложений по аренде подписок и аккаунтов с играми. Это безопасно!`
        },
        {
            title: "Какие гарантии?", text: `Мы гарантируем незамедлительную помощь на любом этапе, 

так-же если не по вашей вине что-то случилось с аккаунтом на котором установлена наша подписка мы незамедлительно исправим проблему и обеспечим к ней доступ`},
        ],
        3: [{ title: "Могу ли я поменять логин или пароль на вашем аккаунте с подпиской?", text: "Категорически нет! Это запрещено правилами нашего магазина, в ином случае вы потеряете доступ на всегда" },
        {
            title: "Какие манипуляции запрещено совершать?", text: `- запрещено менять пароль
- запрещено привязывать номер телефона
- запрещено ставить пароли на покупку
- запрещено менять любые данные на аккаунте

За нарушение правил забираем доступ на всегда` },
        { title: "Могу ли я перенести подписку на другую консоль?", text: "Да вы можете перенести подписку на консоль в следующем случае: если вы купили шеринг на PS4, то перенести на консоль версии PS5 будет нельзя, также и в обратную сторону. То есть: можно перенести только на версию вашей консоли, для которой и была куплена подписка." },
        { title: "Я хочу перенести аккаунт, что мне делать?", text: 'Перед тем как удалить аккаунт из системы, перейдите на нашем сайте в раздел обратная связь и выберите пункт "Перенести аккаунт", далее наши операторы вам ответят в ближайшее время и помогут вам.' },
        ]
    }

    function handleClickInfoPanel(index: number) {
        const newActivePanels = [false, false, false, false];
        newActivePanels[index] = true;
        setActivePanels(newActivePanels);
        setSelectInformation(index);
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
            <div className={styles.background} style={{ maxWidth: "1240px", padding: "100px", marginLeft: "auto", marginRight: "auto" }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "30px", width: "100%" }}>
                    <b className={styles.title} style={{ fontFamily: "Unbounded_Bold" }}>появился вопрос?<br />Вы найдете <span style={{ color: "var(--color-silver-100)" }}>ответы здесь</span></b>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <InfoPanelContext.Provider value={handleClickInfoPanel}>
                                    <div style={{ display: "flex", gap: "30px" }}>
                                        <InfoPanel text={"Шеринг"} icon={"/icons/info_panel/sharing.svg"} active={activePanels[0]} index={0} />
                                        <InfoPanel text={"Подписка"} icon={"/icons/info_panel/ps_plus.svg"} active={activePanels[1]} index={1} />
                                    </div>
                                    <div style={{ display: "flex", gap: "30px" }}>
                                        <InfoPanel text={"Безопасность"} icon={"/icons/info_panel/contacts.svg"} active={activePanels[2]} index={2} />
                                        <InfoPanel text={"Правила"} icon={"/icons/info_panel/warning.svg"} active={activePanels[3]} index={3} />
                                    </div>
                                </InfoPanelContext.Provider>
                            </div>
                        </div>
                        <InformationList data={information_list[selectInformation] || []} />
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.background} style={{ padding: "0px", margin: "0 auto", marginTop: "50px", display: "flex", flexDirection: "column", gap: "40px", width: "320px" }}>
                <b className={styles.title} style={{ fontSize: "24px", fontFamily: "Unbounded_Bold" }}>появился вопрос?<br />Вы найдете <span style={{ color: "var(--color-silver-100)" }}>ответы здесь</span></b>


                <InfoPanelContext.Provider value={handleClickInfoPanel}>
                    <div style={{ display: "flex", flexDirection: "row", gap: "35px", height: "100px", overflowX: "scroll", }}>
                        <InfoPanel text={"Шеринг"} icon={"/icons/info_panel/sharing.svg"} active={activePanels[0]} index={0} is_mobile />
                        <InfoPanel text={"Подписка"} icon={"/icons/info_panel/ps_plus.svg"} active={activePanels[1]} index={1} is_mobile />
                        <InfoPanel text={"Безопасность"} icon={"/icons/info_panel/contacts.svg"} active={activePanels[2]} index={2} is_mobile/>
                        <InfoPanel text={"Правила"} icon={"/icons/info_panel/warning.svg"} active={activePanels[3]} index={3} is_mobile />
                    </div>
                </InfoPanelContext.Provider>
                <InformationList data={information_list[selectInformation] || []} is_mobile />
            </div>
        )
    }
}

export default FifthFrame