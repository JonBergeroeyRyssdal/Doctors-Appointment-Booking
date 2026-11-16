import { Link } from "react-router-dom";
import PageContainer from "./PageContainer";
import AppIcon from "../components/ui/AppIcon";

function AccountLayout({ title, subtitle, mode = "patient", children }) {
  const admin = mode === "admin";
  const register = mode === "register";
  const benefits = admin
    ? ["Manage clinics and doctors", "Keep patient records organised", "Maintain your clinic directory"]
    : ["Find a doctor at one of our clinics", "Keep track of your appointments", "Manage your patient information"];

  return (
    <PageContainer size="wide">
      <section className={`account-layout ${register ? "account-layout-register" : ""}`} aria-labelledby="account-title">
        <aside className="account-intro">
          <span className="account-symbol"><AppIcon name={admin ? "shield" : "calendar"} /></span>
          <p className="page-eyebrow">{admin ? "Clinic administration" : "Your patient portal"}</p>
          <h2>{admin ? "A clear view of your clinic." : "Your care, simply organised."}</h2>
          <p>{admin ? "Sign in to manage the people and places behind every appointment." : "Everything you need to book and manage your appointments, in one place."}</p>
          <ul>
            {benefits.map((benefit) => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}
          </ul>
          <Link to="/" className="account-home-link">&larr; Back to Clinic</Link>
        </aside>
        <div className="account-panel">
          <header className="account-panel-header">
            <p className="page-eyebrow">{admin ? "Staff access" : register ? "Get started" : "Welcome back"}</p>
            <h1 id="account-title">{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </header>
          {children}
          <div className="account-switch">
            {admin ? <Link to="/login">Looking for patient login?</Link>
              : register ? <>Already have an account? <Link to="/login">Log in</Link></>
                : <>New to Clinic? <Link to="/register">Create an account</Link></>}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}

export default AccountLayout;
