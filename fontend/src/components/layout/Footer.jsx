export default function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <div className="text-center">
        <h6 className="mb-1 fw-bold">FUNews Management System</h6>
        <p className="mb-0 small">
          © {new Date().getFullYear()} FUNews. All rights reserved.
        </p>
        <p className="mb-0 small">
          Developed by <span className="text-primary fw-semibold">Pthao4</span>
        </p>
      </div>
    </footer>
  );
}
