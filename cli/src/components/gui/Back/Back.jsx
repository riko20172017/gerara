import { useNavigate } from "react-router-dom";
import styles from "./back.module.scss";

export default function Back() {
  const navigate = useNavigate();

  return (
    <div className={styles.back}>
      <button className="btn btn-dark rounded-0" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>
    </div>
  );
}
