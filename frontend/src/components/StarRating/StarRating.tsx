import { useState } from 'react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const StarRating = ({ value, onChange, disabled }: Props) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating" role="group" aria-label="Rate from 1 to 5 stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${(hovered || value) >= star ? 'filled' : ''}`}
          onClick={() => !disabled && onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          disabled={disabled}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
