import { FC, useState } from "react"
import feedbackInterface from "../../../interfaces/feedbackInterface"
import BaseImageProfileImage from "/images/bases/base_image_for_profile.png"
import DateFormatter from "../../DateFormatter"
import RatingComponent from "../../ratingComponent"
import useWindowSize from "../../state/useWindowSize"


interface Props {
    feedback: feedbackInterface,
    is_mobile?: boolean,
    is_info_frame?: boolean,
}


const FullFeedbackPanel: FC<Props> = ({ feedback, is_mobile = false, is_info_frame = false }) => {
    if (is_info_frame) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: "10px" }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{display: 'flex', alignItems: "center", gap: "10px"}}>
                        <img src={feedback?.order?.logo ? (feedback?.order?.logo.includes('stub_avatars') ? BaseImageProfileImage : feedback?.order?.logo) : BaseImageProfileImage} width={40} style={{ borderRadius: "50%" }} />
                        <div style={{ fontFamily: "Unbounded_Bold" }}>{feedback?.order?.user}</div>
                    </div>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                        <RatingComponent initialRating={feedback?.rating} disabled />
                            <div style={{color: "#D4D4D4"}}><DateFormatter dateString={feedback?.created_on} /></div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: "20px" }}>
                    <div style={{fontFamily: "Unbounded_Bold"}}>{feedback?.order?.title}</div>
                </div>

                <pre style={{ fontFamily: "Unbounded", textWrap: "wrap", maxWidth: "500px" }}>
                    {feedback?.text}
                </pre>

                {feedback?.answer ?
                    <div style={{ marginLeft: "30px", borderLeft: "2px solid #ff007a", padding: "5px", marginTop: "10px" }}>
                        <pre style={{ fontFamily: "Unbounded", textWrap: "wrap", maxWidth: "500px", marginLeft: "10px" }}>
                            {feedback?.answer}
                        </pre>
                    </div>
                    : null}
            </div>
        )
    }

    if (!is_mobile) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: "10px" }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <img src={feedback?.order?.logo ? (feedback?.order?.logo.includes('stub_avatars') ? BaseImageProfileImage : feedback?.order?.logo) : BaseImageProfileImage} width={40} style={{ borderRadius: "50%" }} />
                    <div style={{ display: "flex", flexDirection: 'column', gap: "10px" }}>
                        <div style={{ fontFamily: "Unbounded_Bold" }}>{feedback?.order?.user}</div>
                        <DateFormatter dateString={feedback?.created_on} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: "20px" }}>
                    <RatingComponent initialRating={feedback?.rating} disabled />
                    <div>{feedback?.order?.title}</div>
                </div>

                <pre style={{ fontFamily: "Unbounded", textWrap: "wrap", maxWidth: "500px" }}>
                    {feedback?.text}
                </pre>

                {feedback?.answer ?
                    <div style={{ marginLeft: "30px", borderLeft: "2px solid #ff007a", padding: "5px", marginTop: "10px" }}>
                        <pre style={{ fontFamily: "Unbounded", textWrap: "wrap", maxWidth: "500px", marginLeft: "10px" }}>
                            {feedback?.answer}
                        </pre>
                    </div>
                    : null}
            </div>
        )
    } else {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: "10px", width: "fit-content", maxWidth: "280px" }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <img src={feedback?.order?.logo ? (feedback?.order?.logo.includes('stub_avatars') ? BaseImageProfileImage : feedback?.order?.logo) : BaseImageProfileImage} width={40} style={{ borderRadius: "50%" }} />
                    <div style={{ display: "flex", flexDirection: 'column', gap: "10px" }}>
                        <div style={{ fontFamily: "Unbounded_Bold" }}>{feedback?.order?.user}</div>
                        <DateFormatter dateString={feedback?.created_on} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: "20px" }}>
                    <RatingComponent initialRating={feedback?.rating} disabled />
                    <div>{feedback?.order?.title}</div>
                </div>

                <pre style={{ fontFamily: "Unbounded", textWrap: "wrap", maxWidth: "500px" }}>
                    {feedback?.text}
                </pre>

                {feedback?.answer ?
                    <div style={{ marginLeft: "30px", borderLeft: "2px solid #ff007a", padding: "5px", marginTop: "10px" }}>
                        <pre style={{ fontFamily: "Unbounded", textWrap: "wrap", maxWidth: "500px", marginLeft: "10px" }}>
                            {feedback?.answer}
                        </pre>
                    </div>
                    : null}
            </div>
        )
    }
}


export default FullFeedbackPanel