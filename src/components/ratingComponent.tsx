import StarIcon from "../../public/icons/bases/star.svg?react"
import StarEmptyIcon from "../../public/icons/bases/star_empty.svg?react"
import { useState } from "react";



interface RatingProps {
  initialRating?: number;
  onChange?: (newRating: number) => void;
  disabled?: boolean;
}

const RatingComponent: React.FC<RatingProps> = ({ initialRating = 0, onChange, disabled }) => {
  const [rating, setRating] = useState(initialRating);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (onChange) {
      onChange(newRating); // Call the onChange function if provided
    }
  };

  return (
    <div style={{textWrap: "nowrap"}}>
      {[...Array(Math.round(5))].map((_, index) => (
        index < (disabled ? initialRating : rating) ? <StarIcon key={index} onClick={disabled ? () => { } : () => handleRatingChange(index + 1)} /> : 
        <StarEmptyIcon key={index} onClick={disabled ? () => { } : () => handleRatingChange(index + 1)}/>
      ))}
    </div>
  );
};

export default RatingComponent;
