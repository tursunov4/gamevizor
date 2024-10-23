import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/frames/thridFrame.module.css"
import ProductTable from "../productTable"
import axios from "axios"
import { Link } from "react-router-dom"
import Cross2Icon from "/images/backgrounds/elements/cross_2.png"
import Square1Icon from "/images/backgrounds/elements/square_1.png"
import Square2Icon from "/images/backgrounds/elements/square_2.png"
import { ProductInterface } from "../../interfaces/productInterface"
import useWindowSize from "../state/useWindowSize"
import Product from "../product"


const ThirdFrame: FunctionComponent = () => {
	const [Products, setProducts] = useState<ProductInterface[]>([])

	const GetProducts = async () => {
		try {
			const response = await axios.get('/api/v1/products/', {
				params: {
					page: 1,
					page_size: 8,
					type: "PRODUCT"
				}
			});
			setProducts(response.data.results)
		} catch (error) {
			console.error('Ошибка при получении продуктов:', error);
			throw error;
		}
	}


	useEffect(() => {
		GetProducts();
	}, []);
	const [maxWidth, setMaxWidth] = useState(1600.0)
	const [width, _] = useWindowSize()

	useEffect(() => {
		const root = document.documentElement;
		const computedStyle = getComputedStyle(root);
		setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
	}, [])


	if (width >= maxWidth) {
		return (
			<div className={styles.background} style={{ padding: "0", paddingLeft: "100px", marginTop: "120px", maxWidth: "1342px", marginLeft: "auto", marginRight: "auto" }}>
				<div className={styles.circle} />
				<div className={styles.circle_2} />

				<img src={Cross2Icon} className={styles.icon_background}
					style={{ left: "90%", top: "-5%", opacity: 0.1, transform: "scale(0.6)" }} />
				<img src={Square1Icon} className={styles.icon_background}
					style={{ left: "80%", top: "-5%", opacity: 0.2, transform: "scale(0.5)" }} />
				<img src={Square2Icon} className={styles.icon_background}
					style={{ left: "66%", top: "47%", opacity: 0.2, transform: "scale(1.5)" }} />
				<img src={Square1Icon} className={styles.icon_background}
					style={{ left: "-5%", top: "25%", opacity: 0.2 }} />

				<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
					<div className={styles.header} style={{ marginBottom: "40px", maxWidth: "1250px" }}>
						<b style={{ fontSize: "var(--font-size-13xl)", fontFamily: "Unbounded_Bold" }}>Каталог игр<br /><span style={{ color: "var(--color-silver-100)" }}>в наличии</span></b>
						<Link to={"../catalog/"} className={styles.button} style={{ fontFamily: "Unbounded_Medium" }}>Смотреть весь каталог</Link>
					</div>
					<div style={{ maxWidth: "1250px" }}>
						<ProductTable products={Products} is_index_page/>
					</div>
				</div>
			</div>
		)
	} else {

		return (
			<div className={styles.background} style={{ padding: "0px", margin: "0 auto", marginTop: "50px", display: "flex", flexDirection: "column", gap: "40px", width: "320px" }}>
				<b style={{ fontSize: "25px", fontFamily: "Unbounded_Bold" }}>Каталог игр<br /><span style={{ color: "var(--color-silver-100)" }}>в наличии</span></b>
				<div className={styles.feedbacks} style={{
					overflowX: "auto", overflowY: "hidden", width: "300px",
					height: "240px", display: "flex", gap: "20px", paddingBottom: "30px", marginTop: "-10px"
				}}>
					{Products.map((product) => (

						<Product key={product.id} id={product.id} title={product.title} general_image={product.general_image} platforms={product.platforms} cost={product.cost}
							is_deluxe_or_premium={product.is_deluxe_or_premium} description={product.description} discount={product.discount} is_hit={product.is_hit} is_novelty={product.is_novelty} />
					))}
				</div>

				<Link to={"../catalog/"} style={{ fontFamily: "Unbounded_Medium", width: "calc(320px - 40px)", fontSize: "12px" }} className={styles.button}>Смотреть весь каталог</Link>
			</div>
		)
	}
}

export default ThirdFrame