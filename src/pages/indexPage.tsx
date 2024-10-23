import { useEffect, useState } from "react";
import BaseCenterContainer from "../components/baseCenterContainer";
import Footer from "../components/footer";
import Header from "../components/header";
import FifthFrame from "../components/indexPage/fifthFrane";
import FirstFrame from "../components/indexPage/firstFrame";
//import FirstFrameFifa from "../components/indexPage/firstFrameFifa"
import FourthFrame from "../components/indexPage/fourthFrame";
import SecondFrame from "../components/indexPage/secondFrame";
import ThirdFrame from "../components/indexPage/thirdFrame";
import useWindowSize from "../components/state/useWindowSize";

function IndexPage() {
  const [maxWidth, setMaxWidth] = useState(1600);
  const [width, height] = useWindowSize();

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    setMaxWidth(
      parseInt(
        computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")
      )
    );
  }, []);

  return (
    <BaseCenterContainer
      style={{ zoom: width >= maxWidth ? 0.9 : 1, position: "relative" }}
    >
      <Header style={{ padding: "20px 189px" }} />
      <FirstFrame />
      {/* <SecondFrame />
        <ThirdFrame />
        <FourthFrame />
        <FifthFrame /> */}
      {/* <Footer style={{height: "150px", display: "flex", justifyContent: "center", }}/> */}
    </BaseCenterContainer>
  );
}

export default IndexPage;
