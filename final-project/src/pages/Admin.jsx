import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Modal,
  Spinner,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";

export default function Admin() {
  // State for product list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for new product form
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  // State for edit product modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  // State for form submission
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Categories for dropdown
  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch all products
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

  // Handle new product form input changes
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    });
  };

  // Handle edit form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    });
  };

  // Submit new product
  const handleNewProductSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !newProduct.title ||
      !newProduct.price ||
      !newProduct.description ||
      !newProduct.category
    ) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Product added:", data);

      // In a real app, we would add the new product to the products array
      // For the FakeStore API, it doesn't actually add the product to the database
      // So we'll simulate it by adding it to our local state
      setProducts([...products, { ...newProduct, id: Date.now() }]);

      // Reset form
      setNewProduct({
        title: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      setSubmitError("Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit modal with product data
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
    });
    setShowEditModal(true);
  };

  // Submit edited product
  const handleEditSubmit = async () => {
    if (!editingProduct) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await fetch(
        `https://fakestoreapi.com/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Product updated:", data);

      // Update the product in our local state
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...editFormData } : p
      );
      setProducts(updatedProducts);

      setShowEditModal(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating product:", error);
      setSubmitError("Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteClick = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the product from our local state
      setProducts(products.filter((p) => p.id !== productId));

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error deleting product:", error);
      setSubmitError("Failed to delete product. Please try again.");
    }
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <h1 className="section-title">Admin Dashboard</h1>
      </div>

      {submitSuccess && (
        <Alert variant="success" className="mb-4">
          Operation completed successfully!
        </Alert>
      )}

      {submitError && (
        <Alert variant="danger" className="mb-4">
          {submitError}
        </Alert>
      )}

      <Tabs defaultActiveKey="products" className="mb-4">
        <Tab eventKey="products" title="Manage Products">
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Product List</Card.Title>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "contain",
                              }}
                            />
                          </td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "200px" }}
                          >
                            {product.title}
                          </td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>{product.category}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditClick(product)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteClick(product.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="add" title="Add New Product">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Add New Product</Card.Title>
              <Form onSubmit={handleNewProductSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={newProduct.title}
                        onChange={handleNewProductChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price *</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="price"
                        value={newProduct.price}
                        onChange={handleNewProductChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={newProduct.description}
                    onChange={handleNewProductChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={newProduct.category}
                        onChange={handleNewProductChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="image"
                        value={newProduct.image}
                        onChange={handleNewProductChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    className="rounded-pill px-4"
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Edit Product Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingProduct && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditFormChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditFormChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="image"
                      value={editFormData.image}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <div className="text-center mb-3">
                    <p className="mb-2">Current Image:</p>
                    <img
                      src={editingProduct.image}
                      alt={editingProduct.title}
                      style={{ maxHeight: "100px", objectFit: "contain" }}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
