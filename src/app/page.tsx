import Link from "next/link";
import PublicLayout from "@/layouts/PublicLayout";
import { YBB_ROUTES } from "@/constants/ybb";

export default function Home() {
  return (
    <PublicLayout>
      <section className="section pb-0 hero-section" id="hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-sm-10">
              <div className="text-center mt-lg-5 pt-5">
                <h1 className="display-6 fw-semibold mb-3 lh-base">
                  Empowering the Next Generation of{" "}
                  <span className="text-success">Business Leaders</span>
                </h1>
                <p className="lead text-muted lh-base">
                  Join the Young Business Builder Program and unlock your entrepreneurial potential.
                </p>
                <div className="d-flex gap-2 justify-content-center mt-4">
                  <Link href={YBB_ROUTES.PROGRAMS} className="btn btn-primary">
                    Explore Programs
                  </Link>
                  <Link href={YBB_ROUTES.AUTH.REGISTER} className="btn btn-outline-success">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
