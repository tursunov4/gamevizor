import { FunctionComponent, useEffect, useState } from "react";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import styles from "../styles/pages/subscriptionsPage.module.css"
import PSPlus from "../components/psPlus";
import EaPlayPanel from "../components/panels/subscriptions/eaPlayPanel";
import XboxUltimatePanel from "../components/panels/subscriptions/xboxUltimatePanel";
import axios from "axios";
import useWindowSize from "../components/state/useWindowSize";
import { Link } from "react-router-dom";

interface SUBSCRIPTION_Interface {
	id: number;
	title: string;

	subscription_duration_mouth: number;
	subscription_type: string;
	cost: number;
}



const SubscriptiosPage: FunctionComponent = () => {
	const [subscriptions, setSubscriptions] = useState<SUBSCRIPTION_Interface[]>([]);

	const GetSubscriptions = async () => {
		try {
			const response = await axios.get('/api/v1/products/', {
				params: {
					type: "SUBSCRIPTION",
					page_size: 100,
				},
			});
			setSubscriptions(response.data.results);

		} catch (error) {
			console.error('Ошибка при получении подписок:', error);
			// ... обработайте ошибку, например, выведите сообщение пользователю
		}
	}

	useEffect(() => {
		GetSubscriptions()
	}, [])

	const TypeKeys = { "ОСНОВНОЙ": 1, "ЭКСТРА": 2, "ЛЮКС": 3 }

	const [width, _] = useWindowSize()
	const [maxWidth, setMaxWidth] = useState(1600)

	useEffect(() => {
		const root = document.documentElement;
		const computedStyle = getComputedStyle(root);
		setMaxWidth(parseInt(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
	}, [])

	if (width >= maxWidth) {
		return (
			<div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
				<div style={{ background: "#120F25", zoom: 0.9 }}><Header style={{ maxWidth: "1220px", margin: "0 auto" }} /></div>
				<BaseCenterContainer style={{ zoom: 0.9 }}>
					<div className={styles.container}>
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


						<div style={{ color: "#C2C2C2" }}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link>/<span style={{ color: "White" }}>Подписки</span></div>

						{subscriptions.filter(item => item.subscription_type == "PS_PLUS").length > 0 ?
							<div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
								<div style={{ fontSize: "2rem", fontWeight: "bold" }}>ПОДПИСКИ<br /><span style={{ color: "#C2C2C2" }}>PS PLUS</span></div>
								<div style={{ display: "flex", gap: "25px" }}>
									{subscriptions.filter(item => item.subscription_type === "PS_PLUS").map((subscription) => {
										return (
											<PSPlus key={subscription.id} id={subscription.id}
												type={TypeKeys[subscription.title.split(' ')[0] as keyof typeof TypeKeys]} title={subscription.title} duration={subscription.subscription_duration_mouth + " Мес *"} cost={subscription.cost} is_full={true} />
										);
									})}
								</div>
							</div> : null}
						{subscriptions.filter(item => item.subscription_type == "EA_PLAY").length > 0 ?
							<div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
								<div style={{ fontSize: "2rem", fontWeight: "bold" }}>ПОДПИСКИ<br /><span style={{ color: "#C2C2C2" }}>EA PLAY</span></div>
								<div style={{ display: "flex", gap: "25px" }}>
									{subscriptions.filter(item => item.subscription_type === "EA_PLAY").map((subscription) => {
										return (
											<EaPlayPanel key={subscription.id} id={subscription.id}
												title={subscription.title} duration={subscription.subscription_duration_mouth + " Мес *"} cost={subscription.cost} is_full={true} />
										);
									})}
								</div>
							</div>
							: null}
						{subscriptions.filter(item => item.subscription_type == "XBOX_ULTIMATE").length > 0 ?
							<div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
								<div style={{ fontSize: "2rem", fontWeight: "bold" }}>ПОДПИСКИ<br /><span style={{ color: "#C2C2C2", textTransform: "uppercase" }}>GAME Pass ultimate</span></div>
								<div style={{ display: "flex", gap: "25px" }}>
									{subscriptions.filter(item => item.subscription_type === "XBOX_ULTIMATE").map((subscription) => {
										return (
											<XboxUltimatePanel key={subscription.id} id={subscription.id}
												title={subscription.title} duration={subscription.subscription_duration_mouth + " Мес *"} cost={subscription.cost} is_full={true} />
										);
									})}
								</div>
							</div>
							: null}
					</div>
				</BaseCenterContainer>
				<div style={{
					marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9,
				}}>
					<Footer style={{ margin: "30px auto", maxWidth: "1240px", background: "none" }} />
				</div>
			</div>
		)
	} else {
		return (
			<div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
				<Header style={{ maxWidth: "1220px", margin: "0 auto" }} />
				<BaseCenterContainer>
					<div className={styles.container} style={{ padding: "25px", marginTop: "0px", marginBlock: "0px" }}>
						<div style={{ color: "#C2C2C2" }}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link>/<span style={{ color: "White" }}>Подписки</span></div>

						{subscriptions.filter(item => item.subscription_type == "PS_PLUS").length > 0 ?
							<div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
								<div style={{ fontSize: "2rem", fontWeight: "bold" }}>ПОДПИСКИ<br /><span style={{ color: "#C2C2C2" }}>PS PLUS</span></div>
								<div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
									{subscriptions.filter(item => item.subscription_type === "PS_PLUS").map((subscription) => {
										return (
											<PSPlus key={subscription.id} id={subscription.id} is_mobile
												type={TypeKeys[subscription.title.split(' ')[0] as keyof typeof TypeKeys]} title={subscription.title} duration={subscription.subscription_duration_mouth + " месяцев *"} cost={subscription.cost} is_full={true} />
										);
									})}
								</div>
							</div> : null}

						{subscriptions.filter(item => item.subscription_type == "EA_PLAY").length > 0 ?
							<div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
								<div style={{ fontSize: "2rem", fontWeight: "bold" }}>ПОДПИСКИ<br /><span style={{ color: "#C2C2C2" }}>EA PLAY</span></div>
								<div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
									{subscriptions.filter(item => item.subscription_type === "EA_PLAY").map((subscription) => {
										return (
											<EaPlayPanel key={subscription.id} id={subscription.id} is_mobile
												title={subscription.title} duration={subscription.subscription_duration_mouth + " месяцев *"} cost={subscription.cost} is_full={true} />
										);
									})}
								</div>
							</div>
							: null}

						{subscriptions.filter(item => item.subscription_type == "XBOX_ULTIMATE").length > 0 ?
							<div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
								<div style={{ fontSize: "2rem", fontWeight: "bold" }}>ПОДПИСКИ<br /><span style={{ color: "#C2C2C2", textTransform: "uppercase" }}>GAME Pass ultimate</span></div>
								<div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
									{subscriptions.filter(item => item.subscription_type === "XBOX_ULTIMATE").map((subscription) => {
										return (
											<XboxUltimatePanel key={subscription.id} id={subscription.id} is_mobile
												title={subscription.title} duration={subscription.subscription_duration_mouth + " месяцев *"} cost={subscription.cost} is_full={true} />
										);
									})}
								</div>
							</div>
							: null}
					</div>
				</BaseCenterContainer>
				<div style={{ marginTop: "auto" }}>
					<Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
				</div>

			</div>
		)
	}
}

export default SubscriptiosPage