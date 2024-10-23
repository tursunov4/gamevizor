import { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/frames/firstFrame.module.css";
import Feedback from "../panels/feedbacks/Feedback";
import AvatarsImage from "/images/bases/avatars.png";
import ArrowIcon from "/icons/bases/arrows/arrow.svg";

import Cross4Icon from "/images/backgrounds/elements/cross_4.png";
import Triangle4Icon from "/images/backgrounds/elements/triangle_4.png";
import Triangle3Icon from "/images/backgrounds/elements/triangle_3.png";
import Triangle2Icon from "/images/backgrounds/elements/triangle_2.png";
import Circle2Icon from "/images/backgrounds/elements/circle_2.png";
import Square3Icon from "/images/backgrounds/elements/square_3.png";
import Circle3Icon from "/images/backgrounds/elements/circle_3.png";

import TelegramIcon from "/icons/social/telegram.png";
import InstagramIcon from "/icons/social/instagram.png";
import YoutubeIcon from "/icons/social/youtube.png";
import axios from "axios";
import feedbackInterface from "../../interfaces/feedbackInterface";
import { Link } from "react-router-dom";
import useWindowSize from "../state/useWindowSize";

const FirstFrame: FunctionComponent = () => {
  const [feedbacks, setFeedbacks] = useState<feedbackInterface[]>([]);
  const [selectPage, setSelectPage] = useState(1);
  const [maxPage, setMaxPage] = useState(5);
  const [isStopLoadingFeedbacks, setIsStopLoadingFeedbacks] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isStopLoadingFeedbacks) return;
      if (selectPage > maxPage) return;
      try {
        var url = "/api/v1/feedbacks/?page=" + selectPage;
        if (feedbacks.length) {
          url += "&page_size=1";
        }
        const response = await axios.get(url);
        // Обновляем состояние только если есть новые отзыв
        setFeedbacks([...feedbacks, ...response.data.results]);
        setSelectPage(selectPage + 1);
      } catch (error) {
        setIsStopLoadingFeedbacks(true);
        console.error("Ошибка загрузки отзывов", error);
      }
    };

    if (!feedbacks.length) {
      fetchData();
    }
    // Установите интервал для обновления данных каждые 2 секунды
    const intervalId = setInterval(fetchData, 5000);

    // Очистите интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [selectPage, isStopLoadingFeedbacks]);

  const [maxWidth, setMaxWidth] = useState(1600.0);
  const [width, _] = useWindowSize();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    setMaxWidth(
      parseFloat(
        computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")
      )
    );
    setIsActive(true);
  }, []);

  if (width >= maxWidth) {
    return (
      <div className={!isActive ? styles.background : styles.background_active}>
        {/* <div className={styles.ellipse}></div>
        <div className={styles.circle}></div>
        <div className={styles.rect} />

        <div className={styles.circle_2} />
        <div className={styles.circle_3} /> */}

        {/* <img
          src={Cross4Icon}
          className={styles.icon_background}
          style={{ left: "80%", top: "15%" }}
        />
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
        /> */}

        <b className={!isActive ? styles.title : styles.title_active}>
          ШЕРИНГ PS PLUS
        </b>
        <div
          className={!isActive ? styles.description : styles.description_active}
        >
          Откройте для себя мир бесплатных игр с sPS Plus на целый год!
          Наслаждайтесь увлекательными играми и экономьте свои средства!
        </div>
        <div className={styles.boxes}>
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
              <b
                className={styles.box_number_completed_task}
                style={{ fontFamily: "Unbounded_Bold" }}
              >
                10 000 +
              </b>
              <b
                className={styles.box_bottom_description}
                style={{ fontFamily: "Unbounded_Bold" }}
              >
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
              <b
                className={styles.box_description_2}
                style={{ fontFamily: "Unbounded_Bold" }}
              >
                Клиентов
              </b>
            </div>
          </div>
          <div className={styles.box_age_work}>
            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                height: "100%",
              }}
            >
              <div className={styles.box_age_top}>
                <b
                  className={styles.box_text_2022}
                  style={{ fontFamily: "Unbounded_Bold", alignSelf: "center" }}
                >
                  2022
                </b>
              </div>
              <div
                className={styles.box_bottom_3}
                style={{ flexDirection: "row" }}
              >
                <div>
                  <b style={{ fontFamily: "Unbounded_Bold" }}>
                    РАБОТАЕМ ДЛЯ ВАС
                  </b>
                </div>
                <img src="/icons/bases/arrows/arrow_diagonal.svg" />
              </div>
            </div>
          </div>

          <div style={{ width: "350px" }}>
            <Link
              to={"../all_feedbacks/"}
              style={{ textDecoration: "none", pointerEvents: "all" }}
            >
              <div
                className={
                  !isActive ? styles.button_anim : styles.button_anim_active
                }
                style={{
                  width: "280px",
                  fontFamily: "Unbounded_Medium",
                  fontSize: "15px",
                }}
              >
                ВСЕ ОТЗЫВЫ
              </div>
            </Link>
            <div
              className={styles.feedbacks}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {[...feedbacks].map((feedback, index) => {
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
      </div>
    );
  } else {
    return (
      <div
        className={
          !isActive ? styles.background_mobile : styles.background_mobile_active
        }
        style={{ width: width }}
      >
        <div
          className={styles.background_title}
          style={{
            alignSelf: "flex-start",
            background: "none",
            backgroundColor: "none",
            alignItems: "center",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <b
            className={!isActive ? styles.title : styles.title_active}
            style={{ fontFamily: "Unbounded_Bold", fontSize: "25px" }}
          >
            ШЕРИНГ PS PLUS
          </b>
          <div
            className={
              !isActive ? styles.description : styles.description_active
            }
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "12px",
              alignSelf: "center",
              width: "350px",
            }}
          >
            Откройте для себя мир бесплатных игр с sPS Plus на целый год!
            Наслаждайтесь увлекательными играми и экономьте свои средства!
          </div>
        </div>

        <div
          className={styles.boxes}
          style={{
            marginTop: "150px",
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
              }}
            >
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  height: "100%",
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
              display: "flex",
              gap: "20px",
              paddingBottom: "30px",
              marginTop: "-10px",
              alignItems: "center",
              height: "auto",
            }}
          >
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

          {
            <Link
              to={"../all_feedbacks/"}
              style={{ textDecoration: "none", pointerEvents: "all" }}
            >
              <div
                className={
                  !isActive ? styles.button_anim : styles.button_anim_active
                }
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
        </div>
      </div>
    );
  }
};

export default FirstFrame;
