import PublicLayout from "@/layouts/PublicLayout";

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="py-5">
        <div className="container">
          
          <div className="row align-items-center mb-5">
            <div className="col-lg-6">
              <h3 className="mb-4">Our Mission</h3>
              <p className="text-muted mb-4">
                The Young Business Builder (YBB) Platform is dedicated to nurturing entrepreneurial 
                talent among young people worldwide. We provide comprehensive business education, 
                mentorship opportunities, and practical experience to help aspiring entrepreneurs 
                turn their ideas into successful ventures.
              </p>
              <p className="text-muted mb-4">
                Through our innovative programs, we&apos;ve helped thousands of young entrepreneurs 
                develop essential business skills, build networks, and launch sustainable businesses 
                that contribute to economic growth and social impact.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="bg-light rounded p-5 text-center">
                  <h4>Mission Visual</h4>
                  <p className="text-muted">Placeholder for mission image</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mb-5">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="text-center">
                <div className="mx-auto mb-4 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                  📚
                </div>
                <h5>Expert Training</h5>
                <p className="text-muted">
                  Comprehensive business education covering entrepreneurship, finance, 
                  marketing, and leadership development.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="text-center">
                <div className="mx-auto mb-4 d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                  🌟
                </div>
                <h5>Mentorship Network</h5>
                <p className="text-muted">
                  Connect with successful entrepreneurs and industry experts who provide 
                  guidance and support throughout your journey.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="text-center">
                <div className="mx-auto mb-4 d-flex align-items-center justify-content-center bg-info bg-opacity-10 text-info rounded-circle" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                  🌍
                </div>
                <h5>Global Community</h5>
                <p className="text-muted">
                  Join a vibrant community of like-minded entrepreneurs from around 
                  the world and build lasting professional relationships.
                </p>
              </div>
            </div>
          </div>
          
          <div className="row mb-5">
            <div className="col-lg-12">
              <div className="text-center mb-4">
                <h3>Our Impact</h3>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <h2 className="text-primary mb-0">5,000+</h2>
                </div>
                <h6>Graduates</h6>
                <p className="text-muted mb-0">Young entrepreneurs trained</p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <h2 className="text-success mb-0">1,200+</h2>
                </div>
                <h6>Businesses Launched</h6>
                <p className="text-muted mb-0">Successful startups created</p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <h2 className="text-info mb-0">50+</h2>
                </div>
                <h6>Countries</h6>
                <p className="text-muted mb-0">Global reach and impact</p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <h2 className="text-warning mb-0">$10M+</h2>
                </div>
                <h6>Funding Secured</h6>
                <p className="text-muted mb-0">By our graduates</p>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-12">
              <div className="card bg-primary">
                <div className="card-body text-center text-white">
                  <h4 className="text-white mb-3">Ready to Start Your Journey?</h4>
                  <p className="mb-4 opacity-75">
                    Join thousands of young entrepreneurs who have transformed their ideas into successful businesses.
                  </p>
                  <a href="/register" className="btn btn-light">
                    Get Started Today
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}