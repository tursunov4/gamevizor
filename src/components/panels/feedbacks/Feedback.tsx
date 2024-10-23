import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../../styles/feedback.module.css"
import RatingComponent from "../../ratingComponent";


interface childprops {
  type_buy: string;
  username: string;
  rating: number;
  text: string;
  index?: number;
}


type StylesDict = { [key: string]: string };
let dict_styles: StylesDict = {
  1: styles.item_deepskyblue,
  2: styles.item_green,
  3: styles.item_deeppink,
}

let styles_for_blur: StylesDict = {
  1: styles.blur_blue,
  2: styles.blur_green,
  3: styles.blur_pink
}


const Feedback: FunctionComponent<childprops> = ({ index, type_buy, username, rating, text }) => {

  index = index ?? 1
  const styleIndex = index % 3
  let item_style = dict_styles[styleIndex + 1] ?? styles.item;
  let blur_style = styles_for_blur[styleIndex + 1] ?? styles.blur;

  const [isShowBox, setIsShowBox] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsShowBox(true));
  }, []);

  return (
    <div className={!isShowBox ? styles.feedback : styles.feedback_show} style={{gap: "4px", height: "fit-content"}}>
      <div className={blur_style} />
      <div className={styles.infotitle}>
        <div className={styles.username}>{username}</div>
        <div className={item_style} style={{textWrap: "wrap"}}>{type_buy}</div>
      </div>
      <RatingComponent initialRating={rating} disabled={true}/> 
      <div className={styles.text}>
        {text.slice(0, 50)}{text.length > 50 ? "..." : ""}
      </div>
    </div>
  );
};


export default Feedback;