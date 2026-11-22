import { useId } from "react";
import AppIcon from "../ui/AppIcon";
import { paymentMethods, demoPaymentAmount, demoPaymentCurrency } from "../../data/paymentMethods";

function CardBrands() {
  return (
    <span className="payment-card-brands">
      <img src="/images/payments/visa.png" alt="Visa" width="52" height="17" />
      <img src="/images/payments/mastercard.svg" alt="Mastercard" width="48" height="37" />
    </span>
  );
}

function PaymentDemo({ method, onChange, final = false, disabled = false }) {
  const id = useId();
  const selected = paymentMethods.find((item) => item.id === method);

  if (final) {
    return (
      <section className="payment-demo-final" aria-labelledby={`${id}-title`}>
        <span className="dashboard-icon"><AppIcon name="shield" /></span>
        <span className="payment-demo-badge">Demo only</span>
        <h3 id={`${id}-title`}>This is not a real payment</h3>
        <p>No money will be charged, no invoice will be sent, and no payment details are collected.</p>
        <dl className="payment-demo-summary">
          <div><dt>Selected method</dt><dd>{selected?.name || "Not selected"} (demo)</dd></div>
          <div><dt>Example amount</dt><dd>{demoPaymentCurrency} {demoPaymentAmount}</dd></div>
          <div><dt>Amount charged</dt><dd>{demoPaymentCurrency} 0</dd></div>
        </dl>
        <p className="payment-demo-booking-note">Confirming below creates your appointment only. Payment is not processed or recorded.</p>
      </section>
    );
  }

  return (
    <section className="payment-demo" aria-labelledby={`${id}-title`}>
      <div className="payment-demo-heading">
        <h3 id={`${id}-title`}>Choose a payment method</h3>
        <span className="payment-demo-badge">Demo checkout</span>
      </div>
      <p className="payment-demo-intro">Explore the payment options. This preview uses test details only.</p>
      <fieldset className="payment-methods" disabled={disabled}>
        <legend className="visually-hidden">Payment method</legend>
        {paymentMethods.map((item) => (
          <label key={item.id} className={`payment-method ${method === item.id ? "is-selected" : ""}`}>
            <input type="radio" name={`${id}-payment-method`} value={item.id} checked={method === item.id} onChange={() => onChange(item.id)} />
            <span className={`payment-method-icon payment-method-${item.id}`}>
              {item.id === "vipps" ? <img src="/images/payments/vipps.svg" alt="" width="36" height="36" /> : <AppIcon name={item.icon} />}
            </span>
            <span className="payment-method-text"><strong>{item.name}</strong><small>{item.description}</small>{item.id === "card" && <CardBrands />}</span>
          </label>
        ))}
      </fieldset>

      <div className={`payment-preview payment-preview-${method}`}>
        {method === "vipps" && <>
          <div className="payment-provider-name payment-vipps-heading"><img src="/images/payments/vipps.svg" alt="" width="44" height="44" />Vipps <span>preview</span></div>
          <p>In a connected checkout, you would approve the payment in the Vipps app.</p>
          <label className="form-label" htmlFor={`${id}-phone`}>Demo mobile number</label>
          <input className="form-control" id={`${id}-phone`} value="000 00 000" readOnly />
          <p className="form-text">No app will open and no payment request will be sent.</p>
        </>}
        {method === "card" && <>
          <div className="payment-provider-name payment-card-heading"><div>Card payment <span>preview</span></div><CardBrands /></div>
          <div className="payment-test-card" aria-hidden="true"><AppIcon name="card" /><span>DEMO CARD</span><strong>•••• •••• •••• 4242</strong></div>
          <div className="app-form-grid">
            <div className="app-form-field-wide"><label className="form-label" htmlFor={`${id}-card`}>Test card number</label><input id={`${id}-card`} className="form-control" value="4242 4242 4242 4242" readOnly /></div>
            <div><label className="form-label" htmlFor={`${id}-expiry`}>Expiry</label><input id={`${id}-expiry`} className="form-control" value="12/30" readOnly /></div>
            <div><label className="form-label" htmlFor={`${id}-cvc`}>Security code</label><input id={`${id}-cvc`} className="form-control" value="•••" readOnly /></div>
          </div>
          <p className="form-text">These are fixed demo values. Do not enter real card details.</p>
        </>}
        {method === "invoice" && <>
          <div className="payment-provider-name">Invoice <span>preview</span></div>
          <dl className="payment-demo-summary">
            <div><dt>Invoice reference</dt><dd>DEMO-0001</dd></div>
            <div><dt>Payment terms</dt><dd>14 days (example)</dd></div>
          </dl>
          <p className="form-text">An actual invoice would be arranged by the clinic. No invoice will be created or sent by this demo.</p>
        </>}
        {method === "clinic" && <>
          <div className="payment-provider-name">Pay at the clinic <span>preview</span></div>
          <p>In a real booking flow, you would arrange payment with reception when you arrive.</p>
          <p className="form-text">This selection is a visual demonstration and is not sent to the clinic.</p>
        </>}
        <div className="payment-example-total"><span>Example appointment fee</span><strong>{demoPaymentCurrency} {demoPaymentAmount}</strong></div>
        <p className="form-text mb-0">Illustrative amount only. This is not a clinic price or a request for payment.</p>
      </div>
    </section>
  );
}

export default PaymentDemo;
