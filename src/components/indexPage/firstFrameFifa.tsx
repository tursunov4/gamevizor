import { FunctionComponent, useEffect, useRef, useState } from "react";
import styles from "../../styles/frames/firstFrameFifa.module.css";
import Feedback from "../panels/feedbacks/Feedback";
import AvatarsImage from "/images/bases/avatars.png";
import ArrowIcon from "/icons/bases/arrows/arrow.svg";

import Triangle4Icon from "/images/backgrounds/elements/triangle_4.png";
import Triangle3Icon from "/images/backgrounds/elements/triangle_3.png";
import Triangle2Icon from "/images/backgrounds/elements/triangle_2.png";
import Circle2Icon from "/images/backgrounds/elements/circle_2.png";
import Square3Icon from "/images/backgrounds/elements/square_3.png";
import Circle3Icon from "/images/backgrounds/elements/circle_3.png";

import TelegramIcon from "/icons/social/telegram.png";
import YoutubeIcon from "/icons/social/youtube.png";
import InstagramIcon from "/icons/social/instagram.png";
import NewPlayerImageV2 from "../../assets/Fifa_v2.png";
import FifaTextImage from "../../assets/fifaText.png";
import FifaBackgroundImage from "../../assets/background_fifa_v3.png";
import { Link } from "react-router-dom";
import axios from "axios";
import useWindowSize from "../state/useWindowSize";

interface feedbackInterface {
  id: number;
  text: string;
  answer: string;
  created_on: string;
  updated_on: string;
  rating: number;

  order: {
    user: string;
    product_type: string;
    title: string;
  };
}

const FirstFrameFifa: FunctionComponent = () => {
  const [feedbacks, setFeedbacks] = useState<feedbackInterface[]>([]);

  const [showLink, setShowLink] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const feedbacksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get("/api/v1/feedbacks/", {})
      .then((response) => {
        setFeedbacks(response.data.results);
      })
      .catch((error) => {
        console.error("Ошибка проверки токена:", error);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const feedbacksElement = feedbacksRef.current;
      if (feedbacksElement) {
        const scrollTop = feedbacksElement.scrollTop;
        const feedbackHeight = 126;

        // Check if more than 5 Feedbacks are visible

        if (scrollTop / feedbackHeight >= 2) {
          setShowLink(true);
        } else {
          setShowLink(false);
        }
      }
    };

    if (feedbacksRef.current) {
      feedbacksRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (feedbacksRef.current) {
        feedbacksRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const [maxWidth, setMaxWidth] = useState(1600.0);
  const [width, _] = useWindowSize();

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    setMaxWidth(
      parseFloat(
        computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")
      )
    );
  }, []);

  const [fifaPrice, setFifaPrice] = useState(0);

  useEffect(() => {
    axios
      .get("/api/v1/products/15", {})
      .then((response) => {
        setFifaPrice(response.data.cost);
      })
      .catch((_error) => {});
  }, []);

  if (width >= maxWidth) {
    return (
      <div
        className={styles.background}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <div
          style={{
            width: "1442px",
            position: "absolute",
            overflow: "hidden",
            left: "-60px",
            top: "-125px",
            pointerEvents: "none",
          }}
        >
          <img
            src={FifaBackgroundImage}
            style={{
              position: "absolute",
              pointerEvents: "none",
              zIndex: -2,
              zoom: 0.9,
              width: "1600px",
              top: "100px",
            }}
          />
          {/* <img src={PlayersImage} style={{
                    pointerEvents: "none", zIndex: -1, position: "relative", left: "10%",
                }} /> */}
          <img
            src={NewPlayerImageV2}
            width={852}
            height={903}
            style={{
              pointerEvents: "none",
              zIndex: -1,
              position: "relative",
              left: "35%",
              zoom: 1.1,
              top: "25px",
            }}
          />
          <img
            src={FifaTextImage}
            style={{
              position: "absolute",
              pointerEvents: "none",
              zIndex: -2,
              top: "180px",
              left: "70px",
              zoom: 0.9,
            }}
          />
        </div>
        <div className={styles.ellipse}></div>
        <div className={styles.circle}></div>
        <div className={styles.rect} />

        <div className={styles.circle_2} />
        <div className={styles.circle_3} />

        <img
          src={Triangle4Icon}
          className={styles.icon_background}
          style={{ left: "65%", top: "10%" }}
        />
        <img
          src={Triangle3Icon}
          className={styles.icon_background}
          style={{ left: "45%", top: "0%" }}
        />
        <img
          src={Circle2Icon}
          className={styles.icon_background}
          style={{ left: "2%", top: "60%" }}
        />
        <img
          src={Triangle2Icon}
          className={styles.icon_background}
          style={{ left: "8.5%", top: "75%" }}
        />
        <img
          src={Square3Icon}
          className={styles.icon_background}
          style={{ left: "32.5%", top: "50%", opacity: 0.4 }}
        />
        <img
          src={Circle3Icon}
          className={styles.icon_background}
          style={{ left: "51%", top: "75%" }}
        />
        <div
          className={styles.background_title}
          style={{
            alignSelf: "flex-start",
            marginTop: "-60px",
            background: "none",
            backgroundColor: "none",
            alignItems: "flex-start",
          }}
        >
          <b className={styles.title} style={{ fontFamily: "Unbounded_Bold" }}>
            EA Sports FC 25
          </b>
          <div className={styles.description} style={{ textAlign: "left" }}>
            EA Sports FC 25 — новая часть
            <br /> футбольной серии.
          </div>
          <Link
            to={"../product/15"}
            className={styles.button}
            style={{
              fontFamily: "Unbounded_Medium",
              fontSize: "15px",
              alignSelf: "flex-start",
            }}
          >
            <span>КУПИТЬ {fifaPrice}₽</span>
          </Link>
        </div>
        <div className={styles.boxes} style={{ marginTop: "70px" }}>
          <div className={styles.box_completed_tasks}>
            <div className={styles.box_top}>
              <div className={styles.box_description}>
                В меню каждого товара есть описание с преимуществами каждой
                подписки
              </div>
              <div className={styles.box_arrow}>
                <img src={ArrowIcon} />
              </div>
            </div>
            <div className={styles.box_bottom}>
              <b className={styles.box_number_completed_task}>10 000 +</b>
              <b className={styles.box_bottom_description}>
                ВЫПОЛНЕННЫХ <br /> ЗАКАЗОВ
              </b>
            </div>
          </div>
          <div className={styles.box_number_clients}>
            <div className={styles.box_up}>
              <img src={AvatarsImage} />
              <div className={styles.box_number_clients_value}>8000+</div>
            </div>
            <div className={styles.box_bottom_2}>
              <div className={styles.box_description_1}>Довольных</div>
              <div
                className={styles.box_description_2}
                style={{ fontFamily: "Unbounded_Bold" }}
              >
                Клиентов
              </div>
            </div>
          </div>
          <div className={styles.box_age_work}>
            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div className={styles.box_age_top}>
                <div
                  className={styles.box_text_2022}
                  style={{ fontFamily: "Unbounded_Bold", alignSelf: "center" }}
                >
                  2022
                </div>
                <div className={styles.box_icons}>
                  <Link to={"https://t.me/gamevizor"}>
                    <img src={TelegramIcon} className={styles.icon} />
                  </Link>
                  <Link
                    to={"https://youtube.com/@game_vizor?si=c6grYOCIhW7OGt_F"}
                  >
                    <img src={YoutubeIcon} className={styles.icon} />
                  </Link>
                  <Link to={"https://instagram.com/gamevizor.ru"}>
                    <img src={InstagramIcon} className={styles.icon} />
                  </Link>
                </div>
              </div>
              <div className={styles.box_bottom_3}>
                <div>
                  <div style={{ fontFamily: "Unbounded_Bold" }}>
                    РАБОТАЕМ ДЛЯ ВАС
                  </div>
                </div>
                <img src="/icons/bases/arrows/arrow_diagonal.svg" />
              </div>
            </div>
          </div>

          <Link
            to={"../all_feedbacks/"}
            ref={linkRef}
            style={{
              textDecoration: "none",
              position: "absolute",
              zIndex: "3",
              left: "71.3%",
              top: "-18%",
              pointerEvents: "all",
            }}
          >
            <div
              className={styles.button}
              style={{
                width: "280px",
                fontFamily: "Unbounded_Medium",
                fontSize: "15px",
              }}
            >
              ВСЕ ОТЗЫВЫ
            </div>
          </Link>
          {feedbacks ? (
            <div className={styles.feedbacks} ref={feedbacksRef}>
              {feedbacks.map((feedback, index) => {
                return (
                  <Feedback
                    index={index}
                    type_buy={feedback.order.title}
                    key={feedback.id}
                    username={feedback.order.user}
                    rating={feedback.rating}
                    text={feedback.text}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={styles.background}
        style={{
          paddingLeft: "0px",
          width: width,
          paddingTop: "0px",
          marginTop: "90px",
        }}
      >
        <div
          style={{
            width: width,
            position: "absolute",
            overflow: "hidden",
            top: "-125px",
            pointerEvents: "none",
          }}
        >
          <img
            src={FifaBackgroundImage}
            style={{
              position: "absolute",
              pointerEvents: "none",
              zIndex: -2,
              zoom: 0.9,
              width: "100%",
            }}
          />
          {/* <img src={PlayersImage} style={{
                    pointerEvents: "none", zIndex: -1, position: "relative", left: "10%",
                }} /> */}
          <img
            src={NewPlayerImageV2}
            style={{
              pointerEvents: "none",
              zIndex: -1,
              position: "relative",
              left: "50%",
              zoom: 1.1,
              top: "25px",
              width: "380px",
              transform: "translate(-50%, 0) scale(-1, 1)",
            }}
          />
          <img
            src={FifaTextImage}
            style={{
              position: "absolute",
              pointerEvents: "none",
              zIndex: -2,
              top: "30%",
              left: "50%",
              width: width / 1.2,
              height: width / 3,
              transform: "translate(-50%, -30%)",
            }}
          />
        </div>

        <div
          className={styles.background_title}
          style={{
            alignSelf: "flex-start",
            background: "none",
            backgroundColor: "none",
            alignItems: "flex-start",
            margin: "0 auto",
            marginTop: "90px",
          }}
        >
          <b
            className={styles.title}
            style={{ fontFamily: "Unbounded_Bold", fontSize: "25px" }}
          >
            EA Sports FC 25
          </b>
          <div
            className={styles.description}
            style={{
              textAlign: "center",
              fontSize: "12px",
              alignSelf: "center",
            }}
          >
            EA Sports FC 25 — новая часть
            <br /> футбольной серии.
          </div>
          <Link
            to={"../product/15"}
            className={styles.button}
            style={{
              fontFamily: "Unbounded_Medium",
              fontSize: "10px",
              alignSelf: "center",
              width: "134px",
              padding: "13px",
            }}
          >
            <span>КУПИТЬ {fifaPrice}₽</span>
          </Link>
        </div>

        <div
          className={styles.boxes}
          style={{
            marginTop: "70px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className={styles.box_completed_tasks}
            style={{
              width: "calc(320px - 60px)",
              gap: "10px",
              height: "calc(163px - 60px)",
            }}
          >
            <div className={styles.box_top}>
              <div
                className={styles.box_description}
                style={{ fontSize: "10px", maxWidth: "251px" }}
              >
                В меню каждого товара есть описание <br />с преимуществами
                каждой подписки
              </div>
            </div>
            <div className={styles.box_bottom}>
              <b
                className={styles.box_number_completed_task}
                style={{ fontSize: "27px" }}
              >
                10 000 +
              </b>
              <div style={{ display: "flex", alignItems: "center" }}>
                <b
                  className={styles.box_bottom_description}
                  style={{ fontSize: "12px" }}
                >
                  ВЫПОЛНЕННЫХ <br /> ЗАКАЗОВ
                </b>
                <div
                  className={styles.box_arrow}
                  style={{ alignSelf: "flex-end" }}
                >
                  <img src={ArrowIcon} width={24} />
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              className={styles.box_number_clients}
              style={{
                width: "calc(152px - 40px)",
                height: "calc(141px - 40px)",
              }}
            >
              <div className={styles.box_up}>
                <img src={AvatarsImage} width={56} height={30} />
                <div
                  className={styles.box_number_clients_value}
                  style={{ fontSize: "12px" }}
                >
                  8000+
                </div>
              </div>
              <div className={styles.box_bottom_2}>
                <div
                  className={styles.box_description_1}
                  style={{ fontSize: "12px" }}
                >
                  Довольных
                </div>
                <b
                  className={styles.box_description_2}
                  style={{ fontSize: "14px", fontFamily: "Unbounded_Bold" }}
                >
                  Клиентов
                </b>
              </div>
            </div>
            <div
              className={styles.box_age_work}
              style={{
                width: "calc(152px)",
                height: "calc(143px)",
                backgroundPositionX: "40%",
                backgroundPositionY: "50%",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div className={styles.box_age_top}>
                  <b
                    className={styles.box_text_2022}
                    style={{
                      fontSize: "22px",
                      alignSelf: "flex-start",
                      marginTop: "10px",
                      fontFamily: "Unbounded_Bold",
                    }}
                  >
                    2022
                  </b>
                  <div className={styles.box_icons} style={{ gap: "5px" }}>
                    <Link
                      to={"https://t.me/gamevizor"}
                      style={{ height: "16px" }}
                    >
                      <img
                        src={TelegramIcon}
                        className={styles.icon}
                        style={{ width: "16px", height: "16px" }}
                      />
                    </Link>
                    <Link
                      to={"https://youtube.com/@game_vizor?si=c6grYOCIhW7OGt_F"}
                      style={{ height: "16px" }}
                    >
                      <img
                        src={YoutubeIcon}
                        className={styles.icon}
                        style={{ width: "16px", height: "16px" }}
                      />
                    </Link>
                    <Link
                      to={"https://instagram.com/gamevizor.ru"}
                      style={{ height: "16px" }}
                    >
                      <img
                        src={InstagramIcon}
                        className={styles.icon}
                        style={{ width: "16px", height: "16px" }}
                      />
                    </Link>
                  </div>
                </div>
                <div
                  className={styles.box_bottom_3}
                  style={{ fontSize: "12px" }}
                >
                  <div>
                    <div style={{ fontFamily: "Unbounded_Bold" }}>
                      РАБОТАЕМ ДЛЯ ВАС
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles.feedbacks}
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              width: "300px",
              height: "140px",
              display: "flex",
              gap: "20px",
              paddingBottom: "30px",
              marginTop: "-10px",
              alignItems: "center",
            }}
          >
            {
              <Link
                to={"../all_feedbacks/"}
                ref={linkRef}
                style={{ textDecoration: "none", pointerEvents: "all" }}
              >
                <div
                  className={styles.button}
                  style={{
                    width: "280px",
                    fontFamily: "Unbounded_Medium",
                    fontSize: "15px",
                  }}
                >
                  ВСЕ ОТЗЫВЫ
                </div>
              </Link>
            }
            {feedbacks.map((feedback, index) => {
              return (
                <Feedback
                  index={index}
                  type_buy={feedback.order.title}
                  key={feedback.id}
                  username={feedback.order.user}
                  rating={feedback.rating}
                  text={feedback.text}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

export default FirstFrameFifa;
