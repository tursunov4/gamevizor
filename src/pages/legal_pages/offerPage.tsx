import BaseCenterContainer from "../../components/baseCenterContainer"
import Header from "../../components/header"
import Footer from "../../components/footer"
import styles from "../../styles/pages/NotFoundPage.module.css"

import Cross4Icon from "/images/backgrounds/elements/cross_4.png"
import Triangle4Icon from "/images/backgrounds/elements/triangle_4.png"
import Triangle3Icon from "/images/backgrounds/elements/triangle_3.png"
import Triangle2Icon from "/images/backgrounds/elements/triangle_2.png"
import Circle2Icon from "/images/backgrounds/elements/circle_2.png"
import Square3Icon from "/images/backgrounds/elements/square_3.png"
import Circle3Icon from "/images/backgrounds/elements/circle_3.png"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import useWindowSize from "../../components/state/useWindowSize"


function OfferPage() {
    const [width, height] = useWindowSize()
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

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <div className={styles.container} style={{ zoom: 0.9, background: "none", height: "fit-content" }}>

                {width >= maxWidth ? (
                    <div>
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
                    </div>
                ) : null}

                <BaseCenterContainer style={{ display: "flex", flexDirection: "column" }}>
                    <Header />

                    <div className={styles.main} style={{ display: "flex", flexDirection: "column", paddingLeft: width >= maxWidth ? "150px" : "25px", paddingRight: width >= maxWidth ? "150px" : "25px" }}>

                        <div className={styles.base_path}><Link to={"../"} style={{ textDecoration: "none", color: "var(--color-gray-1100)" }}>Главная</Link><span style={{ color: "white" }}> / Оферта</span></div>

                        <div style={{ marginTop: "50px" }}>
                            <h1>ПУБЛИЧНАЯ ОФЕРТА </h1>
                            <h3>сайта «gamevizor.ru», расположенного по адресу https://gamevizor.ru/</h3>

                            <p style={{ marginTop: "25px" }}>Дата публикации «26» сентября 2024 года</p>

                            <p>
                                Настоящая ПУБЛИЧНАЯ ОФЕРТА является предложением Индивидуального предпринимателя
                                Шарова Олега Константиновича, выступающего от своего имени, действующего на основании записи в ЕГРНИП 324911200074826 от 08.08.2024 года, в адрес Пользователей Сайта «gamevizor.ru», заключить Договор возмездного оказания информационных услуг неограниченному количеству лиц по доступу  к играм,  опубликованных на Сайте.
                                Присоединяясь к настоящему Договору, Пользователь подтверждает свою правоспособность и свою дееспособность, является совершеннолетним, выражает полное и безоговорочное согласие со всеми его условиями, в том числе, в части предоставления согласия на обработку Сайтом персональных данных Пользователя, в соответствии с Политикой конфиденциальности, расположенной по адресу https://gamevizor.ru/confidential.
                            </p>

                            <h2>Термины и определения</h2>

                            <p>
                                <b>ПУБЛИЧНАЯ ОФЕРТА</b> - предложение заключить Договор возмездного оказания информационных услуг неограниченному количеству лиц по доступу  к играм,  опубликованных на Сайте, на условиях Акцепта.<br /><br />
                                <b>Игра</b> – компью́терная игра́ (компьютерная программа), служащая для организации игрового процесса (геймплея), связи с партнёрами по игре, или сама выступающая в качестве партнёра, размещённая в Каталоге Сайта, доступная Пользователям посредством интерфейса Сайта.<br /><br />
                                <b>Акцепт</b> – оплата Услуг  свидетельствует о полном и безоговорочном акцепте настоящей оферты, а также о факте заключения Сторонами Договора возмездного оказания услуг, на условиях настоящей Публичной оферты.<br /><br />
                                <b>Сайт</b> – интернет-ресурс «gamevizor.ru», расположенный по адресу https://gamevizor.ru/,
                                принадлежит Исполнителю. Под термином «Сайт» следует понимать любые страницы, совокупность текстов,
                                графических и информационных материалов, изображений, программного кода, фото- и видеоматериалов,
                                программ для ЭВМ и иных результатов интеллектуальной деятельности Исполнителя, созданный и функционирующий для оформления Пользователем Услуг, посредством сети Интернет.<br /><br />

                                <b>Исполнитель</b> – Индивидуальный предприниматель  Шаров Олег Константинович, выступающий от своего имени, действующий на основании записи в ЕГРНИП 324911200074826 от 08.08.2024 года и/или лица его представляющие. Исполнитель не является правообладателем Игр, Исполнитель оказывает информационные услуги по доступу  к Играм,  опубликованных в Каталоге Сайта.<br /><br />
                                <b>Пользователь</b> – любой посетитель Сайта.<br /><br />
                                <b>Заказчик</b> - Пользователь посетивший Сайт, заказавший и оплативший Услугу.<br /><br />
                                <b>Стороны</b> – Исполнитель и Заказчик, по отдельности Сторона.<br /><br />
                                <b>Договор</b> - Договор возмездного оказания информационных услуг неограниченному количеству лиц по доступу  к Играм,  опубликованных в Каталоге Сайта, на указанных в настоящей Публичной оферте условиях между Заказчиком и Исполнителем, на основании Акцепта Оферты.<br /><br />
                                <b>Заказ</b> – заказ услуги подписки на предоставление доступа к играм по Тарифам:<br />
                                - ОСНОВНОЙ 12 Месяцев * 3500₽<br />
                                - ЭКСТРА 12 Месяцев * 4500₽<br />
                                - ЛЮКС 12 Месяцев * 5000₽<br />

                            </p>
                        </div>

                        <div style={{ marginTop: "50px" }}>
                            <h2>1. Предмет Договора</h2>

                            <p>
                                1.1. Исполнитель не является правообладателем Игр, а оказывает информационные услуги по доступу к Играм, на указанных в настоящей Публичной оферте условиях между Заказчиком и Исполнителем, на основании Акцепта Оферты.
                            </p>

                            <p>1.2. Договор определяет общие условия договорных отношений, возникающих между Исполнителем и Заказчиком, при оказании Услуг, на условиях Сайта и настоящей Публичной оферты. </p>

                            <p>1.3. Заключаемый Договор, представляет собой Договор с открытыми условиями. Существенные условия каждой совершаемой на Сайте сделки по оказанию Услуг, формируются онлайн, индивидуально для каждого Пользователя, с помощью веб-интерфейса Сайта. </p>
                        </div>

                        <div style={{ marginTop: "50px" }}>
                            <h2>2. Оформление Заказа</h2>
                            <p>2.1. Заказ Услуги осуществляется Заказчиком через Сайт, форму обратной связи.</p>
                            <p>2.2. При регистрации на Сайте, Заказчик обязуется предоставить следующие персональные данные:<br />
                                - имя;<br />
                                - адрес эл. почты;<br />
                                - номер телефона.<br />
                            </p>
                            <p>2.3. При оформлении Заказа через Сайт, Заказчик обязуется предоставить информацию, указанную в п. 2.2. настоящего Договора.
                                Заказчик имеет право редактировать регистрационную информацию о себе.
                                Сайт не изменяет и не редактирует регистрационную информацию о Заказчике без согласия последнего. </p>
                            <p>2.4. Исполнитель не несёт ответственности за содержание и достоверность информации, предоставленной Заказчиком при оформлении Заказа. </p>
                            <p>2.5. Оплата Заказчиком оформленного на Сайте Заказа, означает согласие Заказчика с условиями настоящего Договора. День оплаты Заказа является датой заключения Договора между Исполнителем и Заказчиком.</p>
                            <p>2.6. Все информационные материалы, представленные на Сайте, носят справочный характер и не могут в полной мере передавать достоверную информацию, об определенных свойствах и характеристиках Услуги.
                                В случае возникновения у Заказчика вопросов, касающихся Услуги, перед оформлением Заказа, ему необходимо обратиться за консультацией к Исполнителю по адресу эл. почты support@gamevizor.ru. </p>
                        </div>

                        <div style={{ marginTop: "50px" }}>
                            <h2>3. Стоимость Услуг, порядок расчетов, возврат денежных средств</h2>
                            <p>3.1. Стоимость выбранной Пользователем Услуги при заключении сделки в рамках Договора согласно выбранного Тарифа,
                                определяется исходя из Заказа и сообщается Пользователю в рублях через пользовательский интерфейс на Сайте, при завершении оформления заказа.
                                Стоимость указана без НДС, Исполнитель применяет упрощенную систему налогообложения и не является плательщиком НДС. Оплата Услуг осуществляется по ценам,
                                действующим на момент совершения платежа.  </p>
                            <p>3.2. Исполнитель обязуется предпринимать все разумные усилия для должного оказания Услуг, однако не отвечает и не компенсирует убытки Заказчика в случае, если Заказчик не может воспользоваться Услугами по следующим причинам:<br />
                                - технологические неисправности каналов связи общего пользования, посредством которых осуществляется доступ к интернет-услугам, утраты Пользователем доступа к сети Интернет по любой причине, ошибки, пропуски, перерывы в работе или передаче данных, дефекты линий связи и иные технические сбои;<br />
                                - несанкционированное вмешательство в работу Сайта третьих лиц, включая хакерские, DDoS-атаки, действия вирусных программ и иные нарушения работы Сайта.<br />
                                - в случаях, подпадающих под определение обстоятельств непреодолимой силы.<br />
                            </p>

                            <p>3.3. В случае причинения убытков Заказчику по вине Исполнителя, ответственность определяется в порядке, предусмотренном действующим законодательством. При этом ответственность Исполнителя перед Заказчиком определяется в размере, не превышающем стоимость заказанной и оплаченной Заказчиком Услуги.   </p>

                            <p>3.4. Исполнитель не отвечает перед Заказчиком за убытки, возникшие у Заказчика не по вине Исполнителя, в том числе в связи с нарушением Заказчиком условий настоящей Публичной оферты.  </p>

                            <p>3.5. Заказчик проинформирован и соглашается с тем, что часть операций, включая (но не ограничиваясь указанным) операции по приему оплаты за оказываемые Услуги не контролируется и не отслеживается Администрацией Сайта или через третьих лиц, Администрация Сайта не несет ответственности за перевод и/или поступление денежных средств Пользователя в оплату Услуг.<br />
                                Безопасность, конфиденциальность, а также иные условия использования выбранных Заказчиком способов оплаты определяются соглашениями между Заказчиком и соответствующими организациями.
                            </p>

                            <p>3.6. Исполнитель обязуется обеспечивать работу Сайта, в соответствии с настоящей Офертой, круглосуточно 7 дней в неделю, включая выходные и праздничные дни (сервис должен быть доступен не менее 90% времени в месяц), за исключением случаев, оговоренных в настоящей Оферте.   </p>

                            <p>3.7. В случае невозможности исполнения Договора, возникшей по вине Заказчика, стоимость Услуги не возвращается.</p>

                            <p>3.8. В случае нарушения условий Договора одной из Сторон, Сторона, нарушившая Договор, оплачивает штраф в размере 10% (десяти процентов) от суммы Заказа, а в случае причинения убытков оплачивает убытки, понесенные другой Стороной. </p>

                            <p>3.9. Выплата штрафа не освобождает Стороны от выполнения обязанностей, предусмотренных Договором.</p>
                        </div>

                        <div style={{ marginTop: "50px" }}>
                            <h2>4. Рассмотрение претензий</h2>
                            <p>4.1. Все возникающие по Договору споры, Стороны будут стремиться урегулировать в досудебном порядке путем переговоров.</p>
                            <p>4.2. Неурегулированные споры, возникшие в рамках настоящего Договора, должны быть переданы на рассмотрение в судебные инстанции по месту регистрации Исполнителя, с претензионным порядком, согласно законодательству РФ. </p>
                        </div>

                        <div style={{ marginTop: "50px" }}>
                            <h2>5. Прочие условия</h2>
                            <p>5.1. Договор вступает в силу с момента его заключения в порядке, указанном в разделе 2 Оферты, и действует до момента его прекращения в соответствии с условиями Сайта,
                                Договором и законодательством РФ.   </p>
                            <p>5.2. Исполнитель вправе изменять и/или дополнять условия Оферты в той мере, в какой это допускается действующим законодательством, а также отозвать Оферту в любое время.
                                Датой изменения Оферты является дата опубликования на Сайте новой редакции Оферты. Пользователь должен ознакомиться с действующей редакцией Оферты. </p>
                        </div>

                        <div style={{ marginTop: "50px" }}>
                            <h2>6. Конфиденциальность</h2>
                            <p>6.1. Предоставляя свои персональные данные на Сайте, Пользователь соглашается на обработку персональных данных.</p>
                            <p>6.2. Сайт использует систему аналитики «metrika.yandex.ru», которая позволяет определить уникального посетителя Сайта и посредством которой, может осуществляться сбор и трансграничная передача персональных данных пользователей Сайта.</p>
                            <p>6.3. Политика конфиденциальности (обработки персональных данных), расположена на Сайте по адресу https://gamevizor.ru/confidential.</p>
                            <p>6.4. К конфиденциальной информации не относится информация, которая отнесена существующим законодательством к категории открытой, или раскрытие которой вменено в обязанность Стороне.</p>
                        </div>

                        <div style={{ marginTop: "50px" }}>
                            <h2>7. Обстоятельства непреодолимой силы (форс-мажор)</h2>
                            <p>7.1.	Стороны освобождаются от ответственности за невыполнение или ненадлежащее выполнение своих обязательств,
                                если оно вызвано обстоятельствами непреодолимой силы,
                                которые наступили после подписания Договора в результате событий непреодолимой силы и стороны не могли предусмотреть и/или предотвратить эти события.
                                Событиями непреодолимой силы считаются: война и военные действия, мобилизация, эпидемия, пожар,
                                взрывы, дорожные события и природные катастрофы, акты высших органов власти, которые делают невозможным надлежащее исполнение обязательств,
                                и все другие события, и обстоятельства, которые Торгово-промышленная палата или соответствующий государственный орган признает и объявит событиями непреодолимой силы.</p>
                            <p>7.2.	Сторона, которая подпадает под действие обстоятельств непреодолимой силы, должна прислать уведомление об этом другой стороне в течение 10 (десяти) дней с начала действия этих обстоятельств.</p>
                            <p>7.3.	Если о наступлении вышеупомянутых обстоятельств не будет сообщено своевременно, сторона, пострадавшая от непреодолимой силы, не имеет права на нее ссылаться, кроме случая, когда само обстоятельство препятствует направлению такого сообщения.</p>
                            <p>7.4.	Стороны признают, что неплатежеспособность Сторон, не является обстоятельством непреодолимой силы. </p>
                        </div>

                        <div style={{ marginTop: "50px" }}>
                            <h2>8. Реквизиты Исполнителя</h2>
                            <p>ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ</p>
                            <p>ШАРОВ ОЛЕГ </p>
                            <p>ИНН 911116321630</p>
                            <p>ОГРНИП 324911200074826</p>
                            <p>Юридический адрес:</p>
                            <p>Адрес эл. почты: support@gamevizor.ru</p>
                            <p>Тел.: +7 (918) 090-06-03</p>
                        </div>
                    </div>
                </BaseCenterContainer>


            </div>

            <div style={{ width: "auto", height: "150px", zoom: 0.9 }}>
                <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
            </div>
        </div>
    )

}

export default OfferPage