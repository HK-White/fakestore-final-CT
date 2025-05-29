import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Spinner, Badge } from "react-bootstrap";

export default function ProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="text-center py-5">
        <h2>Error</h2>
        <p>{error || "Product not found"}</p>
        <Link to="/products">
          <Button variant="primary">Back to Products</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/products" className="text-decoration-none">
        <Button variant="outline-secondary" className="mb-4">
          &larr; Back to Products
        </Button>
      </Link>

      <Row>
        <Col md={5} className="mb-4">
          <div className="product-detail-img-container bg-light p-4 rounded text-center">
            <img
              src={product.image}
              alt={product.title}
              className="product-detail-img img-fluid"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>
        </Col>

        <Col md={7}>
          <h1>{product.title}</h1>
          <h2 className="text-primary mb-3">${product.price.toFixed(2)}</h2>

          <Badge bg="secondary" className="mb-3">
            {product.category}
          </Badge>

          <div className="mb-3">
            <p className="mb-0">Rating: {product.rating.rate}/5</p>
            <small className="text-muted">
              ({product.rating.count} reviews)
            </small>
          </div>

          <p className="mb-4">{product.description}</p>

          <Button variant="primary" size="lg" className="rounded-pill">
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
