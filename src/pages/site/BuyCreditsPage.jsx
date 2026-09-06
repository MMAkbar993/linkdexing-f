import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import PageIntro from "../../components/site/PageIntro";
import { company, packages, pricing, checkout } from "../../content/site";

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const num = (n) => n.toLocaleString("en-US");

export default function BuyCreditsPage({ user }) {
  const [selected, setSelected] = useState(packages[2].credits);
  const [email, setEmail] = useState(user?.email || "");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState("");

  const pack = useMemo(
    () => packages.find((p) => p.credits === selected),
    [selected]
  );
  const totalCredits = pack.credits + (pack.bonus || 0);
  const checkoutReady = Boolean(checkout.paypalUrl);

  const applyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCoupon(code);
    toast.info(`Coupon ${code} will be applied at checkout.`);
  };

  const proceed = (e) => {
    e.preventDefault();
    const account = email.trim();
    if (!account) {
      toast.error("Enter the email address on your Linkdexing account.");
      return;
    }

    if (checkoutReady) {
      const q = new URLSearchParams({
        email: account,
        credits: String(pack.credits),
        amount: String(pack.price),
        ...(coupon ? { coupon } : {}),
      });
      window.location.assign(`${checkout.paypalUrl}?${q.toString()}`);
      return;
    }

    // Online checkout is not connected yet (V2, Feature 1). Until it is,
    // hand the order to support by email so nobody hits a dead end.
    const subject = `Credit purchase: ${num(pack.credits)} links (${money(
      pack.price
    )})`;
    const body = [
      `Linkdexing account: ${account}`,
      `Package: ${num(pack.credits)} links credit${
        pack.bonus ? ` (+${num(pack.bonus)} bonus)` : ""
      }`,
      `Amount: ${money(pack.price)}`,
      coupon ? `Coupon: ${coupon}` : null,
      "",
      "Please send me a PayPal payment link for this package.",
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.assign(
      `mailto:${company.supportEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
    toast.info(
      "We've opened an email to support with your order. They'll reply with a PayPal link."
    );
  };

  return (
    <>
      <PageIntro
        eyebrow="Buy credits"
        title="Buy link credits."
        lede={`1 credit = 1 link submission, at $${pricing.perCreditUsd.toFixed(
          2
        )} per link. Pick a package, pay through PayPal, and the credits are added to your account. They never expire.`}
      />

      <section className="section-tight">
        <div className="wrap">
          {checkout.indiaUrl && (
            <div className="notice">
              Paying from India?{" "}
              <a href={checkout.indiaUrl}>
                Buy credits with UPI, net banking, cards or wallets
              </a>{" "}
              instead of PayPal.
            </div>
          )}

          <form className="checkout" onSubmit={proceed}>
            <div
              className="packages"
              role="radiogroup"
              aria-label="Choose a package"
            >
              {packages.map((p) => {
                const active = p.credits === selected;
                return (
                  <button
                    type="button"
                    key={p.credits}
                    role="radio"
                    aria-checked={active}
                    className={`package${active ? " is-selected" : ""}`}
                    onClick={() => setSelected(p.credits)}
                  >
                    <span className="radio" aria-hidden="true" />
                    <span>
                      <b>
                        {num(p.credits)} links credit
                        {p.bonus && (
                          <span className="bonus">+{p.bonusPct}% free</span>
                        )}
                      </b>
                      <small>
                        Submit up to {num(p.credits)} links
                        {p.bonus
                          ? `, plus ${num(p.bonus)} extra credits free.`
                          : "."}
                      </small>
                    </span>
                    <span className="amt">{money(p.price)}</span>
                  </button>
                );
              })}
            </div>

            <aside className="summary">
              <h3>Your order</h3>

              <div className="field">
                <label htmlFor="account-email">
                  Linkdexing account email
                </label>
                <input
                  id="account-email"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="coupon">Coupon code</label>
                <div className="coupon">
                  <input
                    id="coupon"
                    type="text"
                    className="form-control"
                    placeholder="Optional"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="lines">
                <div className="line">
                  <span>{num(pack.credits)} links credit</span>
                  <span>{money(pack.price)}</span>
                </div>
                {pack.bonus && (
                  <div className="line">
                    <span>Bonus credits</span>
                    <span>+{num(pack.bonus)}</span>
                  </div>
                )}
                {coupon && (
                  <div className="line">
                    <span>Coupon</span>
                    <span>{coupon}</span>
                  </div>
                )}
                <div className="line total">
                  <span>Total</span>
                  <span>{money(pack.price)}</span>
                </div>
              </div>

              <button type="submit" className="btn-solid btn-lg btn-block">
                Proceed to PayPal
              </button>

              <p className="muted fine">
                {checkoutReady
                  ? `Payments are processed by PayPal. ${num(
                      totalCredits
                    )} credits will be added to the account above once the payment clears.`
                  : "Online checkout is being connected. For now this sends your order to support by email and they'll reply with a PayPal link."}
              </p>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
}
