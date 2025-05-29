import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products and then select a few for the featured section
        const response = await fetch("https://fakestoreapi.com/products");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Select 4 random products for the featured section
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);

        setFeaturedProducts(selected);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setError("Failed to load featured products. Please try again later.");
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <Hero />

      <div className="featured-section">
        <Container>
          <div className="text-center">
            <h2 className="section-title">Featured Products</h2>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-danger">{error}</p>
            </div>
          ) : (
            <Row xs={1} sm={2} md={4} className="g-4">
              {featuredProducts.map((product) => (
                <Col key={product.id}>
                  <Link
                    to={`/product/${product.id}`}
                    className="text-decoration-none"
                  >
                    <Card className="h-100 product-card shadow-sm">
                      <div className="product-img-container">
                        <Card.Img
                          variant="top"
                          src={product.image}
                          alt={product.title}
                          className="product-img p-3"
                        />
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="product-title">
                          {product.title}
                        </Card.Title>
                        <Card.Text className="text-muted mb-0 mt-auto">
                          ${product.price.toFixed(2)}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-5">
            <Link
              to="/products"
              className="btn btn-primary btn-lg rounded-pill px-4"
            >
              View All Products
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
