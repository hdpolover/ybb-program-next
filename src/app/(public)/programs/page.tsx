import PublicLayout from "@/layouts/PublicLayout";

export default function ProgramsPage() {
  return (
    <PublicLayout>
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Startup Accelerator</h5>
                  <p className="card-text">
                    Intensive 12-week program for early-stage startups with mentorship and funding opportunities.
                  </p>
                  <span className="badge bg-primary">12 Weeks</span>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Business Fundamentals</h5>
                  <p className="card-text">
                    Learn essential business skills including finance, marketing, and operations management.
                  </p>
                  <span className="badge bg-success">8 Weeks</span>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Leadership Development</h5>
                  <p className="card-text">
                    Develop leadership skills and learn how to build and manage high-performing teams.
                  </p>
                  <span className="badge bg-info">6 Weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}