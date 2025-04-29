export default function Meter({ name, value, index }) {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
      <div className="card shadow-sm h-100">
        <div className="card-body text-center">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">
            <strong>Значение:</strong> {value}
          </p>
        </div>
      </div>
    </div>
  );
}
