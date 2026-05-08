import React, { useState, useEffect, useRef } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import {
  Building2,
  User,
  Mail,
  DollarSign,
  CheckCircle,
  Lock,
  ShieldCheck,
  ChevronRight,
  Phone,
  MapPin,
  Shield,
  ArrowRightLeft,
  Headset,
  Menu,
  X,
  Globe,
  Landmark,
} from "lucide-react";

const ScrollReveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const TransferForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [reference, setReference] = useState("");

  const publicKey =
    import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ||
    "FLWPUBK_TEST-your-public-key-here";

  const config = {
    public_key: publicKey,
    tx_ref: Date.now().toString(),
    amount: amount ? parseFloat(amount) : 0,
    currency: "USD",
    payment_options: "card",
    customer: {
      email: email,
      name: name,
    },
    customizations: {
      title: "Trust Transfer",
      description: "Secure Banking Transfer",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !amount) {
      alert("Please fill in all fields");
      return;
    }

    handleFlutterPayment({
      callback: (response) => {
        console.log(response);
        if (response.status === "successful") {
          setReference(response.transaction_id || response.tx_ref);
          setIsSuccess(true);
        }
        closePaymentModal();
      },
      onClose: () => {
        console.log("Payment closed.");
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="transfer-container">
        <div className="payment-card success-card">
          <div className="success-icon-wrapper">
            <CheckCircle />
          </div>
          <h2 className="card-title">Transfer Successful</h2>
          <p className="card-subtitle">
            Your funds have been securely transferred.
          </p>

          <div className="receipt-details">
            <div className="receipt-row">
              <span className="receipt-label">Beneficiary</span>
              <span className="receipt-value">{name}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Reference</span>
              <span className="receipt-value">
                #{reference || config.tx_ref}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Amount Transferred</span>
              <span className="receipt-value">
                USD ${parseFloat(amount).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            className="reset-button"
            onClick={() => {
              setIsSuccess(false);
              setName("");
              setEmail("");
              setAmount("");
              setReference("");
            }}
          >
            Initiate New Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transfer-container">
      <div className="payment-card">
        <div className="card-header">
          <h2 className="card-title">Initiate Transfer</h2>
          <p className="card-subtitle">
            Enter transfer details below to securely process the transaction.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Account Holder Name</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Contact Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Transfer Amount (USD)</label>
            <div className="input-wrapper amount-input-wrapper">
              <DollarSign className="input-icon" />
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <button type="submit" className="pay-button">
            Transfer USD ${amount ? parseFloat(amount).toFixed(2) : "0.00"}{" "}
            <ShieldCheck size={20} />
          </button>
        </form>

        <div className="footer">
          <Lock size={14} /> 256-bit Bank-Grade Encryption
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <>
            <div className="section-container hero-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  Secure Your{" "}
                  <span className="text-accent">Financial Future</span>
                </h1>
                <p className="hero-subtitle">
                  Experience world-class banking security and seamless
                  transfers. We protect your wealth with bank-grade encryption
                  and 24/7 fraud monitoring.
                </p>
                <div className="hero-buttons">
                  <button
                    className="btn-primary"
                    onClick={() => handleNav("transfer")}
                  >
                    Secure Transfer <ChevronRight size={20} />
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => handleNav("services")}
                  >
                    Our Services
                  </button>
                </div>
              </div>
              <div className="hero-image">
                <img
                  src="/dashboard_mockup.png"
                  alt="Banking Dashboard Mockup"
                  style={{
                    width: "100%",
                    maxWidth: "600px",
                    height: "auto",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  }}
                />
              </div>
            </div>

            {/* Quick Stats Banner */}
            <ScrollReveal delay={100}>
              <div
                style={{
                background: "var(--bg-nav)",
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                padding: "2.5rem 0",
              }}
            >
              <div
                className="section-container quick-stats-wrapper"
                style={{
                  padding: "0 2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "2rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    $50B+
                  </h3>
                  <p
                    style={{ color: "var(--text-secondary)", fontWeight: 500 }}
                  >
                    Protected Assets
                  </p>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    150+
                  </h3>
                  <p
                    style={{ color: "var(--text-secondary)", fontWeight: 500 }}
                  >
                    Countries Supported
                  </p>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    99.99%
                  </h3>
                  <p
                    style={{ color: "var(--text-secondary)", fontWeight: 500 }}
                  >
                    Server Uptime
                  </p>
                </div>
              </div>
            </div>
            </ScrollReveal>

            {/* Feature Highlights */}
            <ScrollReveal delay={100}>
              <div className="section-container" style={{ padding: "6rem 2rem" }}>
              <h2 className="section-title text-center">
                Why Partner With <span className="text-accent">Us?</span>
              </h2>
              <p className="section-subtitle text-center mb-8">
                We combine traditional corporate banking reliability with modern
                FinTech agility.
              </p>

              <div className="services-grid">
                <div
                  className="service-card"
                  style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}
                >
                  <div
                    className="service-icon"
                    style={{
                      margin: "0 auto 1.5rem",
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                    }}
                  >
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="service-title">Bank-Grade Security</h3>
                  <p className="service-desc">
                    Multi-layered encryption protocols ensure your funds are
                    completely impenetrable to modern threats.
                  </p>
                </div>
                <div
                  className="service-card"
                  style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}
                >
                  <div
                    className="service-icon"
                    style={{
                      margin: "0 auto 1.5rem",
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                    }}
                  >
                    <ArrowRightLeft size={28} />
                  </div>
                  <h3 className="service-title">Instant Settlements</h3>
                  <p className="service-desc">
                    Move capital securely across borders with zero delays and
                    complete transparency.
                  </p>
                </div>
                <div
                  className="service-card"
                  style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}
                >
                  <div
                    className="service-icon"
                    style={{
                      margin: "0 auto 1.5rem",
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                    }}
                  >
                    <Headset size={28} />
                  </div>
                  <h3 className="service-title">Dedicated Advisors</h3>
                  <p className="service-desc">
                    Every corporate account comes with a personal wealth manager
                    available 24/7.
                  </p>
                </div>
              </div>
            </div>
            </ScrollReveal>

            {/* CTA Section */}
            <ScrollReveal delay={100}>
              <div style={{ padding: "2rem 2rem 6rem" }}>
              <div
                className="section-container"
                style={{
                  padding: "6rem 3rem",
                  background: "linear-gradient(135deg, var(--bg-card) 0%, #26210f 100%)",
                  borderRadius: "24px",
                  color: "var(--text-primary)",
                  textAlign: "center",
                  boxShadow: "0 20px 40px -10px rgba(212, 175, 55, 0.15)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "200%", background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)", transform: "rotate(30deg)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "-50%", right: "-10%", width: "50%", height: "200%", background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)", transform: "rotate(-30deg)", pointerEvents: "none" }} />
                
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    color: "var(--text-primary)",
                    position: "relative",
                    zIndex: 1
                  }}
                >
                  Ready to Elevate Your Security?
                </h2>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "var(--text-secondary)",
                    marginBottom: "2.5rem",
                    maxWidth: "600px",
                    margin: "0 auto 2.5rem",
                    lineHeight: 1.6,
                    position: "relative",
                    zIndex: 1
                  }}
                >
                  Join thousands of institutions and high-net-worth individuals
                  who trust us to protect their financial future.
                </p>
                <button
                  className="btn-primary"
                  style={{
                    margin: "0 auto",
                    fontSize: "1.1rem",
                    padding: "1rem 2.5rem",
                    borderRadius: "12px",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "0 10px 15px -3px rgba(212, 175, 55, 0.3)"
                  }}
                  onClick={() => handleNav("transfer")}
                >
                  Initiate Secure Transfer <ChevronRight size={20} />
                </button>
              </div>
            </div>
            </ScrollReveal>
          </>
        );
      case "about":
        return (
          <div className="section-container" style={{ padding: "4rem 2rem" }}>
            {/* Header Area */}
            <div style={{ textAlign: "center", marginBottom: "6rem" }}>
              <h2 className="section-title">
                About <span className="text-accent">Trust Transfer</span>
              </h2>
              <p
                className="section-subtitle"
                style={{ maxWidth: "700px", fontSize: "1.15rem" }}
              >
                We are a premier financial institution dedicated to providing
                uncompromising security, speed, and reliability for individuals
                and businesses worldwide.
              </p>
            </div>

            {/* Main Mission Split */}
            <div
              className="split-section"
              style={{ gap: "4rem", marginBottom: "6rem" }}
            >
              <div className="split-content">
                <h3
                  className="mb-4"
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Our Mission
                </h3>
                <p
                  className="mb-4"
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    fontSize: "1.05rem",
                  }}
                >
                  Founded on the principles of absolute trust and uncompromised
                  security, Trust Transfer was built to provide individuals and
                  businesses with a safe haven for their capital.
                </p>
                <p
                  className="mb-4"
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    fontSize: "1.05rem",
                  }}
                >
                  In an increasingly digital world, financial fraud is a growing
                  concern. Our platform leverages military-grade encryption and
                  AI-driven fraud detection to ensure that every transaction you
                  make is completely secure. We believe that your money should
                  move as fast as you do, without ever sacrificing safety.
                </p>
                <button
                  className="btn-primary mt-4"
                  onClick={() => handleNav("contact")}
                >
                  Speak with an Advisor
                </button>
              </div>
              <div
                className="split-image"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  border: "none",
                  background: "transparent",
                }}
              >
                <img
                  src="/bank_building.png"
                  alt="Bank Building"
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                />
              </div>
            </div>

            {/* Core Values Section */}
            <ScrollReveal delay={200}>
              <div
                style={{
                background: "var(--bg-card)",
                padding: "4rem 3rem",
                borderRadius: "24px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: "3rem",
                  color: "var(--text-primary)",
                }}
              >
                Our Core Values
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "2.5rem",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      background: "var(--bg-primary)",
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem",
                      color: "var(--accent)",
                    }}
                  >
                    <Shield size={32} />
                  </div>
                  <h4
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: "0.75rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    Uncompromised Security
                  </h4>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}
                  >
                    Your assets are protected by state-of-the-art encryption and
                    continuous fraud monitoring systems.
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      background: "var(--bg-primary)",
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem",
                      color: "var(--accent)",
                    }}
                  >
                    <Building2 size={32} />
                  </div>
                  <h4
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: "0.75rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    Institutional Trust
                  </h4>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}
                  >
                    We operate with the highest levels of transparency and
                    regulatory compliance globally.
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      background: "var(--bg-primary)",
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem",
                      color: "var(--accent)",
                    }}
                  >
                    <Globe size={32} />
                  </div>
                  <h4
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: "0.75rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    Global Reach
                  </h4>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}
                  >
                    Seamless cross-border transactions connecting you to over
                    150 countries without friction.
                  </p>
                </div>
              </div>
            </div>
            </ScrollReveal>
          </div>
        );
      case "services":
        return (
          <div className="section-container">
            <h2 className="section-title text-center">
              Our <span className="text-accent">Services</span>
            </h2>
            <p className="section-subtitle text-center mb-8">
              Comprehensive financial solutions designed to protect and manage
              your wealth.
            </p>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <Shield size={28} />
                </div>
                <h3 className="service-title">Fraud Protection</h3>
                <p className="service-desc">
                  Real-time monitoring and advanced AI algorithms detect and
                  prevent unauthorized access to your funds before it happens.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <ArrowRightLeft size={28} />
                </div>
                <h3 className="service-title">Secure Asset Transfers</h3>
                <p className="service-desc">
                  Transfer funds globally with complete peace of mind. Our
                  encrypted pipelines ensure your money reaches its destination
                  safely.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <Lock size={28} />
                </div>
                <h3 className="service-title">Escrow Services</h3>
                <p className="service-desc">
                  Engage in high-value transactions securely. We hold funds in a
                  trusted escrow account until all transaction terms are met.
                </p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <Headset size={28} />
                </div>
                <h3 className="service-title">24/7 Priority Support</h3>
                <p className="service-desc">
                  Our dedicated customer service team is available around the
                  clock to assist you with any inquiries or emergency requests.
                </p>
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="section-container" style={{ padding: "4rem 2rem" }}>
            <ScrollReveal>
              <div style={{ textAlign: "center", marginBottom: "6rem" }}>
                <h2 className="section-title">
                  Contact <span className="text-accent">Us</span>
                </h2>
                <p className="section-subtitle" style={{ maxWidth: "600px", margin: "0 auto" }}>
                  Our premium support team is available 24/7. Reach out to us for
                  secure account assistance or VIP service inquiries.
                </p>
              </div>
            </ScrollReveal>

            <div className="split-section" style={{ gap: "4rem", alignItems: "flex-start" }}>
              <div className="split-content">
                <ScrollReveal delay={100}>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "2rem", color: "var(--text-primary)" }}>
                    Get in Touch
                  </h3>
                  <div className="service-card mb-4" style={{ display: "flex", gap: "1.5rem", alignItems: "center", padding: "1.5rem" }}>
                    <div style={{ background: "var(--bg-primary)", padding: "1rem", borderRadius: "12px", color: "var(--accent)" }}>
                      <Phone size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem", color: "var(--text-primary)" }}>
                        Private Client Support
                      </div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                        +1 (800) 123-4567
                      </div>
                    </div>
                  </div>
                  
                  <div className="service-card mb-4" style={{ display: "flex", gap: "1.5rem", alignItems: "center", padding: "1.5rem" }}>
                    <div style={{ background: "var(--bg-primary)", padding: "1rem", borderRadius: "12px", color: "var(--accent)" }}>
                      <Mail size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem", color: "var(--text-primary)" }}>
                        Secure Email
                      </div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                        concierge@trusttransfer.com
                      </div>
                    </div>
                  </div>

                  <div className="service-card" style={{ display: "flex", gap: "1.5rem", alignItems: "center", padding: "1.5rem" }}>
                    <div style={{ background: "var(--bg-primary)", padding: "1rem", borderRadius: "12px", color: "var(--accent)" }}>
                      <MapPin size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem", color: "var(--text-primary)" }}>
                        Global Headquarters
                      </div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                        100 Financial District Blvd, NY
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
              
              <div className="split-content">
                <ScrollReveal delay={300}>
                  <div style={{ background: "var(--bg-card)", padding: "3rem", borderRadius: "24px", border: "1px solid var(--border)", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)" }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem", color: "var(--text-primary)" }}>
                      Send a Secure Message
                    </h3>
                    <form
                      className="contact-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        alert("Secure message dispatched to your dedicated advisor.");
                      }}
                    >
                      <div className="form-group">
                        <label className="input-label">Full Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="John Doe"
                          required
                          style={{ paddingLeft: "1rem" }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="input-label">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="john@example.com"
                          required
                          style={{ paddingLeft: "1rem" }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: "2rem" }}>
                        <label className="input-label">Message</label>
                        <textarea
                          className="form-input"
                          rows="5"
                          placeholder="How can we assist you today?"
                          required
                          style={{ resize: "none", paddingLeft: "1rem", paddingTop: "1rem" }}
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center", padding: "1rem" }}
                      >
                        Transmit Securely <ChevronRight size={18} />
                      </button>
                    </form>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        );
      case "transfer":
        return <TransferForm />;
      default:
        return null;
    }
  };

  return (
    <div className="app-wrapper">
      <div className="bg-glow"></div>
      <nav className="navbar">
        <div className="brand" onClick={() => handleNav("home")}>
          <div className="brand-icon">
            <Building2 color="#0B1120" size={24} />
          </div>
          <span className="brand-title">TRUST TRANSFER</span>
        </div>

        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <button
            className={`nav-link ${activeTab === "home" ? "active" : ""}`}
            onClick={() => handleNav("home")}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeTab === "about" ? "active" : ""}`}
            onClick={() => handleNav("about")}
          >
            About
          </button>
          <button
            className={`nav-link ${activeTab === "services" ? "active" : ""}`}
            onClick={() => handleNav("services")}
          >
            Services
          </button>
          <button
            className={`nav-link ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => handleNav("contact")}
          >
            Contact
          </button>
          <button className="nav-cta" onClick={() => handleNav("transfer")}>
            Secure Transfer
          </button>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <main className="main-content" key={activeTab}>
        <div className="animate-fade-in-up">
          {renderContent()}
        </div>
      </main>

      {/* Global Corporate Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-card)", padding: "4rem 2rem 2rem", marginTop: "auto" }}>
        <div className="section-container" style={{ padding: "0", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
            <div className="brand" onClick={() => handleNav("home")}>
              <div className="brand-icon">
                <Building2 color="#0B1120" size={24} />
              </div>
              <span className="brand-title">TRUST TRANSFER</span>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", flexWrap: "wrap" }}>
              <span style={{ cursor: "pointer" }} onMouseOver={e => e.target.style.color = "var(--accent)"} onMouseOut={e => e.target.style.color = "var(--text-secondary)"}>Privacy Policy</span>
              <span style={{ cursor: "pointer" }} onMouseOver={e => e.target.style.color = "var(--accent)"} onMouseOut={e => e.target.style.color = "var(--text-secondary)"}>Terms of Service</span>
              <span style={{ cursor: "pointer" }} onMouseOver={e => e.target.style.color = "var(--accent)"} onMouseOut={e => e.target.style.color = "var(--text-secondary)"}>Security Whitepaper</span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>
            <p style={{ marginBottom: "1rem" }}>
              Trust Transfer is a financial technology company, not a traditional bank. Banking services are provided by our regulated partner banks globally. 
              Investment and wealth management products are not FDIC insured, are not bank guaranteed, and may lose value. Multi-layered encryption protocols ensure all digital assets are protected.
            </p>
            <p style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <span>© {new Date().getFullYear()} Trust Transfer Global Inc. All rights reserved.</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Lock size={14} /> 256-bit Secure SSL Connection</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
