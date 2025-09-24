import PublicLayout from "@/layouts/PublicLayout";

export default function InsightsPage() {
  return (
    <PublicLayout>
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <article className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <span className="text-primary">💡</span>
                    </div>
                    <div>
                      <h6 className="mb-0">Entrepreneurship</h6>
                      <small className="text-muted">December 20, 2024</small>
                    </div>
                  </div>
                  <h5 className="card-title">10 Essential Skills Every Young Entrepreneur Needs</h5>
                  <p className="card-text text-muted">
                    Discover the key skills that can make or break your entrepreneurial journey and how to develop them.
                  </p>
                  <a href="#" className="btn btn-outline-primary btn-sm">Read More</a>
                </div>
              </article>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <article className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <span className="text-success">💰</span>
                    </div>
                    <div>
                      <h6 className="mb-0">Finance</h6>
                      <small className="text-muted">December 18, 2024</small>
                    </div>
                  </div>
                  <h5 className="card-title">Funding Your Startup: A Comprehensive Guide</h5>
                  <p className="card-text text-muted">
                    Learn about different funding options and how to prepare your startup for investment.
                  </p>
                  <a href="#" className="btn btn-outline-success btn-sm">Read More</a>
                </div>
              </article>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <article className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                      <span className="text-info">👥</span>
                    </div>
                    <div>
                      <h6 className="mb-0">Leadership</h6>
                      <small className="text-muted">December 15, 2024</small>
                    </div>
                  </div>
                  <h5 className="card-title">Building High-Performance Teams</h5>
                  <p className="card-text text-muted">
                    Master the art of team building and learn how to create a culture of excellence.
                  </p>
                  <a href="#" className="btn btn-outline-info btn-sm">Read More</a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}