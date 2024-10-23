import { FC, useEffect, useState } from "react";
import styles from "../styles/product.module.css";
import { Link, useNavigate } from "react-router-dom";
import { PlatformProductInterface, ProductInterface } from "../interfaces/productInterface";
import useWindowSize from "./state/useWindowSize";


export function getPlatformTitles(platforms: PlatformProductInterface[] | null) {
  if (!Array.isArray(platforms)) {
    return "";
  }
  const titles = platforms.map(platform => platform.title);
  return titles.join("/");
}

const Product: FC<ProductInterface> = ({ id, title, general_image, platforms, discount, cost, is_hit, is_novelty }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [leftPosition, setLeftPosition] = useState(220);

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsShow(true));
  }, []);

  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  useEffect(() => {
    const eventText = `${discount ? 'скидка' : ''}${is_hit ? (discount ? '/' : '') + 'хит' : ''}${is_novelty ? (discount || is_hit ? '/' : '') + 'новинка' : ''}
    `.trim();

    if (eventText === "хит") {
      setLeftPosition(230);
      return
    }
    console.log(eventText)
    if (eventText === "скидка/новинка") {
      setLeftPosition(155);
      return
    }

    if (!eventText.includes("/")) {
      setLeftPosition(205);
      return
    }

    if (eventText.split("/").length - 1 == 1) {
      setLeftPosition(165)
      return
    }

    if (eventText.split("/").length - 1 == 2) {
      setLeftPosition(105)
      return
    }
  }, [discount, is_hit, is_novelty]);

  const [maxWidth, setMaxWidth] = useState(1600.0)
  const [width, _] = useWindowSize()

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
  }, [])
  if (width >= maxWidth) {
    return (
      <div className={!isShow ? styles.container : styles.container_show} style={{ width: "fit-content" }}>
        {platforms.length > 0 && <div className={styles.for_play}>{getPlatformTitles(platforms)}</div>}
        {
          (discount || is_hit || is_novelty) && (
            <div className={styles.event} style={{ left: `${leftPosition}px` }} >
              {discount && "скидка"}
              {is_hit && (discount ? "/ " : "")}
              {is_hit && "хит"}
              {is_novelty && (discount || is_hit ? "/ " : "")}
              {is_novelty && "новинка"}
            </div>
          )
        }
        <Link to={"../product/" + id} style={{ cursor: "pointer" }} className={styles.imageContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img src={general_image?.replace("http", "https") ?? "https://placehold.co/300"} className={styles.image} style={{ filter: isHovered ? 'brightness(0.5)' : 'brightness(1)' }} />
        </Link>
        <div className={styles.title} style={{ fontFamily: "Unbounded_Light", textWrap: "wrap", maxWidth: "290px" }}>{title}</div>
        {cost && discount ?
          (<div className={styles.cost} style={{ color: "#FF007A" }}>{cost - discount?.discount_cost} ₽ <span style={{ textDecoration: "line-through", color: "#84828f" }}>{cost} ₽</span></div>) :
          (<div className={styles.cost}>{cost} {cost && "₽"}</div>)}
      </div>
    );
  } else {
    return (
      <div className={!isShow ? styles.container : styles.container_show} style={{ width: "fit-content"}}>
        {platforms.length > 0 && <div className={styles.for_play} style={{top: "120px", left: "15px"}}>{getPlatformTitles(platforms)}</div>}
        {
          (discount || is_hit || is_novelty) && (
            <div className={styles.event} style={{ left: `${leftPosition - 130}px`, top: "10px" }} >
              {discount && "скидка"}
              {is_hit && (discount ? "/ " : "")}
              {is_hit && "хит"}
              {is_novelty && (discount || is_hit ? "/ " : "")}
              {is_novelty && "новинка"}
            </div>
          )
        }
        <Link to={"../product/" + id} style={{ cursor: "pointer" }} className={styles.imageContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img src={general_image?.replace("http", "https") ?? "https://placehold.co/152"} className={styles.image} style={{ filter: isHovered ? 'brightness(0.5)' : 'brightness(1)', width: "152px", height: "152px" }} />
        </Link>
        <div className={styles.title} style={{ fontFamily: "Unbounded_Light", textWrap: "wrap", maxWidth: "152px" }}>{title}</div>
        {cost && discount ?
          (<div className={styles.cost} style={{ color: "#FF007A", textWrap: "balance", textAlign: 'center' }}>{cost - discount?.discount_cost} ₽ <span style={{ textDecoration: "line-through", color: "#84828f" }}>{cost} ₽</span></div>) :
          (<div className={styles.cost}>{cost} {cost && "₽"}</div>)}
      </div>
    )
  }
};

export default Product;