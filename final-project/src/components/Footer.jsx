export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p className="mb-0">© {new Date().getFullYear()} ALT STORE</p>
        <p className="mb-0">All rights reserved.</p>
        <p className="mb-0">
          Follow us on{" "}
          <a href="https://twitter.com" className="text-white">
            Twitter
          </a>{" "}
          and{" "}
          <a href="https://instagram.com" className="text-white">
            Instagram
          </a>
        </p>
      </div>
    </footer>
  );
}
