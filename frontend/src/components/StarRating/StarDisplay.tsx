interface Props {
  value: number | null;
  showNumber?: boolean;
}

const StarDisplay = ({ value, showNumber = true }: Props) => {
  if (value == null) return <span className="no-rating">Not rated</span>;

  const full = Math.floor(value);
  const partial = value - full;
  const empty = 5 - full - (partial > 0 ? 1 : 0);

  return (
    <span className="star-display" title={`${value.toFixed(1)} / 5`}>
      {'★'.repeat(full)}
      {partial > 0 && <span style={{ opacity: 0.5 }}>★</span>}
      {'☆'.repeat(empty)}
      {showNumber && <span className="star-number"> {value.toFixed(1)}</span>}
    </span>
  );
};

export default StarDisplay;
