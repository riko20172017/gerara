export default function Meter({ title, value, index }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body text-center">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">
          <strong>Значение:</strong> {value}
        </p>
      </div>
    </div>
  );
}
