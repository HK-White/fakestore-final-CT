import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Welcome to ALT STORE</h1>
        <p>Your one-stop shop for all things alternative</p>
        <Link to="/products">
          <button className="btn btn-primary">Shop Now</button>
        </Link>
      </div>
    </div>
  );
}
