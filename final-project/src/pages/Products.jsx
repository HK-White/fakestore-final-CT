import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <h2>Error</h2>
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center">
        <h1 className="section-title">Our Products</h1>
      </div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map((product) => (
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
    </Container>
  );
}
