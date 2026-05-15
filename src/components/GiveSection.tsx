import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Copy, Check, CreditCard, Landmark } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { useLanguage } from "@/lib/language";
import { siteConfig } from "@/lib/siteConfig";

type GiveType = "tithe" | "offering" | "donation";
type CheckoutMethod = "ideal" | "card";
type ServerStatus = "missing" | "test" | "live" | "unknown" | null;
type CheckoutNotice = "success" | "cancelled" | "unverified" | null;
type CheckoutReturnState = "success" | "cancelled";
type VerifiedCheckoutDetails = {
  donorName: string;
  givingType: GiveType;
};

const content = {
  en: {
    eyebrow: "Support Our Ministry",
    title: "Give Generously",
    intro:
      "Choose an amount and give securely in a few clicks.",
    primaryMethods: ["iDEAL", "Cards"],
    backupMethods: ["SEPA bank transfer", "International bank transfer"],
    open: "Give Online",
    supportNote:
      "Donors in the Netherlands can use iDEAL, while donors abroad can use card payment. Bank transfer stays available for SEPA and international giving.",
    simpleIntro: "Choose your gift, enter the amount, and select one payment method.",
    detailsStep: "1. Giving details",
    paymentStep: "2. Payment method",
    amountHelp: "Choose a quick amount or enter your own.",
    idealSummary: "Use iDEAL for a direct online bank payment.",
    cardSummary: "Use card payment if you are giving from abroad.",
    bankTransferSummary: "Use bank transfer if you prefer to pay manually.",
    referenceLabel: "Payment reference",
    steps: [
      {
        number: "01",
        title: "Choose your giving",
        description: "Select tithe, offering, or donation in the next step.",
      },
      {
        number: "02",
        title: "Pay online",
        description: "Pay with iDEAL or card.",
      },
      {
        number: "03",
        title: "Bank transfer",
        description: "Use SEPA or international transfer if you prefer.",
      },
    ],
    verse:
      '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7',
    modalTitle: "Online Giving",
    blessing: "\"God will surely bless the fruits of your labour in Jesus' Name\"",
    checkoutCancelled: "Checkout was cancelled. You can try again or use bank transfer below.",
    checkoutTitle: "Online checkout",
    checkoutDescription:
      "Choose bank payment with iDEAL to select your bank and continue through the bank redirect flow.",
    bankTitle: "Bank transfer",
    bankDescription:
      "Works well for SEPA and international transfers using the church IBAN below.",
    onlineBankTitle: "Online bank payment",
    onlineBankDescription:
      "Choose your bank on the next payment page, complete the payment, and you will be redirected back to the website.",
    cardTitle: "Online card payment",
    cardDescription:
      "Use this option for international cards if you do not want the Dutch bank redirect flow.",
    selectType: "Gift type",
    giveOptions: {
      tithe: {
        label: "Tithe",
        description: "Give your faithful tithe unto the Lord",
      },
      offering: {
        label: "Offering",
        description: "Sow a seed offering into God's Kingdom",
      },
      donation: {
        label: "Donation",
        description: "Support the ministry with a generous gift",
      },
    },
    name: "Your Name (optional)",
    namePlaceholder: "Enter your name",
    amount: "Amount (EUR)",
    transferTo: "Transfer to",
    accountName: "Account Name",
    iban: "IBAN",
    copyIban: "Copy IBAN",
    copied: "Copied!",
    referencePrefix: "Please use",
    referenceSuffix: "as your payment reference.",
    confirmTransfer: "Confirm Bank Transfer",
    startIdealCheckout: "Give with iDEAL",
    startCardCheckout: "Give by Card",
    startingIdealCheckout: "Opening iDEAL...",
    startingCardCheckout: "Opening card payment...",
    secureNote: "Secure online giving is processed by Stripe. Bank transfer is available below.",
    missingCheckoutTitle:
      "Online checkout is not configured on the server yet. Add the payment key to enable iDEAL, cards, and wallets.",
    missingCheckoutBody: "Online payment is not available right now. Please use the IBAN below.",
    testMode:
      "Online payments are currently running in test mode. Use test payment details until you switch to live mode.",
    verifyingPayment: "Verifying your payment...",
    verificationFailed:
      "We could not verify your payment yet. If your bank or card was charged, please contact the church so we can confirm it.",
    successTitle: "God Bless You!",
    successBody: "Thank you for your generous",
    successTail: "Your seed is sown into good soil and will produce an abundant harvest.",
    successPayment: "Your online payment was completed successfully.",
    close: "Close",
    invalidAmount: "Please enter a valid amount",
    paymentFailed: "Payment failed to start",
    networkError: "Network error starting payment. Please try bank transfer or contact the church.",
  },
  nl: {
    eyebrow: "Ondersteun Onze Bediening",
    title: "Geef Royaal",
    intro:
      "Kies een bedrag en geef veilig in een paar klikken.",
    primaryMethods: ["iDEAL", "Kaarten"],
    backupMethods: ["SEPA-bankoverschrijving", "Internationale bankoverschrijving"],
    open: "Online Geven",
    supportNote:
      "Gevers in Nederland kunnen iDEAL gebruiken, terwijl gevers uit het buitenland met kaart kunnen betalen. Bankoverschrijving blijft beschikbaar voor SEPA en internationale giften.",
    simpleIntro: "Kies uw gift, vul het bedrag in en selecteer een betaalmethode.",
    detailsStep: "1. Gegevens van uw gift",
    paymentStep: "2. Betaalmethode",
    amountHelp: "Kies een snel bedrag of vul zelf een bedrag in.",
    idealSummary: "Gebruik iDEAL voor een directe online bankbetaling.",
    cardSummary: "Gebruik kaartbetaling als u vanuit het buitenland geeft.",
    bankTransferSummary: "Gebruik bankoverschrijving als u liever handmatig betaalt.",
    referenceLabel: "Betalingskenmerk",
    steps: [
      {
        number: "01",
        title: "Kies uw gift",
        description: "Selecteer in de volgende stap tiende, offer of donatie.",
      },
      {
        number: "02",
        title: "Betaal online",
        description: "Betaal met iDEAL of kaart.",
      },
      {
        number: "03",
        title: "Bankoverschrijving",
        description: "Gebruik SEPA of internationale overschrijving als u dat liever doet.",
      },
    ],
    verse:
      '"Laat ieder geven wat hij zich in zijn hart heeft voorgenomen, niet met tegenzin of uit dwang, want God heeft een blijmoedige gever lief." - 2 Korinthe 9:7',
    modalTitle: "Online Geven",
    blessing: "\"God zal zeker de vrucht van uw arbeid zegenen in Jezus' Naam\"",
    checkoutCancelled: "De betaling is geannuleerd. U kunt het opnieuw proberen of het IBAN hieronder gebruiken.",
    checkoutTitle: "Online checkout",
    checkoutDescription:
      "Kies bankbetaling met iDEAL om uw bank te selecteren en verder te gaan via de bankomleiding.",
    bankTitle: "Bankoverschrijving",
    bankDescription:
      "Werkt goed voor SEPA- en internationale overschrijvingen via het IBAN van de kerk hieronder.",
    onlineBankTitle: "Online bankbetaling",
    onlineBankDescription:
      "Kies op de volgende betaalpagina uw bank, rond de betaling af en u wordt daarna teruggestuurd naar de website.",
    cardTitle: "Online kaartbetaling",
    cardDescription:
      "Gebruik deze optie voor internationale kaarten als u de Nederlandse bankomleiding niet wilt gebruiken.",
    selectType: "Soort gift",
    giveOptions: {
      tithe: {
        label: "Tiende",
        description: "Geef uw trouwe tiende aan de Heer",
      },
      offering: {
        label: "Offer",
        description: "Zaai een offergave in Gods Koninkrijk",
      },
      donation: {
        label: "Donatie",
        description: "Ondersteun de bediening met een vrijgevig geschenk",
      },
    },
    name: "Uw Naam (optioneel)",
    namePlaceholder: "Voer uw naam in",
    amount: "Bedrag (EUR)",
    transferTo: "Overmaken naar",
    accountName: "Rekeningnaam",
    iban: "IBAN",
    copyIban: "IBAN Kopieren",
    copied: "Gekopieerd!",
    referencePrefix: "Gebruik alstublieft",
    referenceSuffix: "als betalingskenmerk.",
    confirmTransfer: "Bevestig Bankoverschrijving",
    startIdealCheckout: "Geef met iDEAL",
    startCardCheckout: "Geef met Kaart",
    startingIdealCheckout: "iDEAL openen...",
    startingCardCheckout: "Kaartbetaling openen...",
    secureNote: "Veilig online geven wordt verwerkt via Stripe. Bankoverschrijving staat hieronder.",
    missingCheckoutTitle:
      "Online checkout is nog niet op de server ingesteld. Voeg de betaalsleutel toe om iDEAL, kaarten en wallets te activeren.",
    missingCheckoutBody: "Online betalen is nu niet beschikbaar. Gebruik het IBAN hieronder.",
    testMode:
      "Online betalingen draaien momenteel in testmodus. Gebruik test-betaalgegevens totdat u overschakelt naar live-modus.",
    verifyingPayment: "Uw betaling wordt gecontroleerd...",
    verificationFailed:
      "Uw betaling kon nog niet worden bevestigd. Neem contact op met de kerk als het bedrag wel van uw bankrekening of kaart is afgeschreven.",
    successTitle: "God Zegene U!",
    successBody: "Dank u voor uw vrijgevige",
    successTail: "Uw zaad is gezaaid in goede grond en zal een overvloedige oogst voortbrengen.",
    successPayment: "Uw online betaling is succesvol voltooid.",
    close: "Sluiten",
    invalidAmount: "Voer een geldig bedrag in",
    paymentFailed: "Betaling kon niet worden gestart",
    networkError: "Netwerkfout bij het starten van de betaling. Probeer bankoverschrijving of neem contact op met de kerk.",
  },
} as const;

const normalizeGiveType = (value: unknown): GiveType => {
  if (value === "tithe" || value === "offering" || value === "donation") {
    return value;
  }

  return "donation";
};

const GiveSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState(false);
  const [selectedType, setSelectedType] = useState<GiveType>("tithe");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [processingMethod, setProcessingMethod] = useState<CheckoutMethod | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatus>(null);
  const [submitted, setSubmitted] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState<CheckoutNotice>(null);
  const [paymentError, setPaymentError] = useState("");
  const [verifyingCheckout, setVerifyingCheckout] = useState(false);
  const [verifiedCheckout, setVerifiedCheckout] = useState<VerifiedCheckoutDetails | null>(null);
  const { language } = useLanguage();
  const copy = content[language];
  const selectedOption = copy.giveOptions[selectedType];
  const confirmedType = verifiedCheckout?.givingType ?? selectedType;
  const confirmedOption = copy.giveOptions[confirmedType];
  const confirmedName = verifiedCheckout?.donorName || name;
  const transferReference = `${selectedOption.label}${name ? ` - ${name}` : ""}`;

  const copyIban = () => {
    navigator.clipboard.writeText(siteConfig.giving.ibanCompact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    setVerifiedCheckout(null);
    setCheckoutNotice(null);
    setSubmitted(true);
  };

  const buildReturnUrl = (paymentState: CheckoutReturnState) => {
    const url = new URL(window.location.href);
    if (paymentState) {
      url.searchParams.set("payment", paymentState);
    }
    return url.toString();
  };

  const handleStripeCheckout = async (checkoutMethod: CheckoutMethod) => {
    const value = Number(amount || 0);
    if (!value || value <= 0) {
      window.alert(copy.invalidAmount);
      return;
    }

    setCheckoutNotice(null);
    setPaymentError("");
    setVerifiedCheckout(null);
    setProcessingMethod(checkoutMethod);
    try {
      const res = await fetch(apiUrl("/create-checkout-session"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: value,
          currency: "eur",
          checkoutMethod,
          givingType: selectedType,
          donorName: name || "Anonymous",
          description: `${selectedType} - ${name || "Anonymous"}`,
          locale: language,
          success_url: buildReturnUrl("success"),
          cancel_url: buildReturnUrl("cancelled"),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data?.error || data?.message || copy.paymentFailed;
        console.error("Server error creating checkout session:", data);
        setPaymentError(message);
        return;
      }

      if (data.url) {
        window.location.assign(data.url);
      } else {
        console.error("Unexpected server response:", data);
        setPaymentError(data?.error || copy.paymentFailed);
      }
    } catch (err) {
      console.error("Network or unexpected error starting payment:", err);
      setPaymentError(copy.networkError);
    } finally {
      setProcessingMethod(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    fetch(apiUrl("/status"))
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data && data.stripe) setServerStatus(data.stripe);
        else setServerStatus("unknown");
      })
      .catch(() => {
        if (!mounted) return;
        setServerStatus("missing");
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const url = new URL(window.location.href);
    const paymentState = url.searchParams.get("payment");
    const sessionId = url.searchParams.get("session_id");

    if (paymentState !== "success" && paymentState !== "cancelled") {
      return () => {
        mounted = false;
      };
    }

    url.searchParams.delete("payment");
    url.searchParams.delete("session_id");
    window.history.replaceState({}, document.title, url.toString());

    if (paymentState === "cancelled") {
      setVerifyingCheckout(false);
      setVerifiedCheckout(null);
      setCheckoutNotice("cancelled");
      setSubmitted(false);

      return () => {
        mounted = false;
      };
    }

    if (!sessionId) {
      setVerifyingCheckout(false);
      setVerifiedCheckout(null);
      setCheckoutNotice("unverified");
      setSubmitted(false);

      return () => {
        mounted = false;
      };
    }

    setVerifyingCheckout(true);
    setCheckoutNotice(null);

    fetch(apiUrl(`/checkout-session-status?session_id=${encodeURIComponent(sessionId)}`))
      .then(async (response) => ({
        ok: response.ok,
        data: await response.json().catch(() => ({})),
      }))
      .then(({ ok, data }) => {
        if (!mounted) return;

        if (!ok || !data?.verified) {
          setVerifiedCheckout(null);
          setCheckoutNotice("unverified");
          setSubmitted(false);
          return;
        }

        const givingType = normalizeGiveType(data.givingType);
        const donorName =
          typeof data.donorName === "string" && data.donorName !== "Anonymous"
            ? data.donorName.slice(0, 100)
            : "";

        setSelectedType(givingType);
        setVerifiedCheckout({ donorName, givingType });
        setCheckoutNotice("success");
        setSubmitted(true);
      })
      .catch(() => {
        if (!mounted) return;
        setVerifiedCheckout(null);
        setCheckoutNotice("unverified");
        setSubmitted(false);
      })
      .finally(() => {
        if (!mounted) return;
        setVerifyingCheckout(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const resetGiveForm = () => {
    setSubmitted(false);
    setCheckoutNotice(null);
    setPaymentError("");
    setVerifyingCheckout(false);
    setVerifiedCheckout(null);
    setName("");
    setAmount("");
    setSelectedType("tithe");
  };

  return (
    <section id="give" className="py-24 bg-navy-gradient" aria-labelledby="give-heading">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">{copy.eyebrow}</p>
            <h2 id="give-heading" className="mb-6 font-display text-3xl font-bold text-primary-foreground md:text-5xl">
              {copy.title}
            </h2>
            <div className="mx-auto mb-8 h-1 w-20 bg-gold-gradient" />
            <p className="text-lg leading-relaxed text-primary-foreground/70">
              {copy.intro}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gold/25 bg-primary-foreground p-5 shadow-navy md:p-7">
            {!submitted ? (
              <div className="space-y-5">
                {verifyingCheckout && (
                  <div className="rounded-lg border border-navy/10 bg-navy/5 p-3 text-sm text-navy/70">
                    {copy.verifyingPayment}
                  </div>
                )}

                {checkoutNotice === "cancelled" && (
                  <div className="rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-navy/75">
                    {copy.checkoutCancelled}
                  </div>
                )}

                {checkoutNotice === "unverified" && !verifyingCheckout && (
                  <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-900">
                    {copy.verificationFailed}
                  </div>
                )}

                {paymentError && (
                  <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-900">
                    {paymentError}
                  </div>
                )}

                <div>
                  <label htmlFor="give-amount" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-navy/60">
                    {copy.amount}
                  </label>
                  <div className="flex overflow-hidden rounded-xl border border-navy/15 bg-white focus-within:border-gold">
                    <span className="flex items-center border-r border-navy/10 px-4 text-xl font-bold text-navy/70">EUR</span>
                    <input
                      id="give-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.slice(0, 10))}
                      placeholder="0.00"
                      className="min-w-0 flex-1 px-4 py-4 text-3xl font-bold text-navy-dark outline-none placeholder:text-navy/25"
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {["10", "25", "50", "100"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`rounded-lg border py-2 text-sm font-bold transition-all ${
                          amount === val
                            ? "border-gold bg-gold text-navy-dark"
                            : "border-navy/10 bg-navy/5 text-navy/70 hover:border-gold/50"
                        }`}
                      >
                        EUR {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-navy/60">
                    {copy.selectType}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(copy.giveOptions) as GiveType[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedType(option)}
                        className={`rounded-lg border px-2 py-3 text-sm font-bold transition-all ${
                          selectedType === option
                            ? "border-gold bg-gold/20 text-navy-dark"
                            : "border-navy/10 bg-white text-navy/65 hover:border-gold/50"
                        }`}
                      >
                        {copy.giveOptions[option].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="give-name" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-navy/60">
                    {copy.name}
                  </label>
                  <input
                    id="give-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 100))}
                    placeholder={copy.namePlaceholder}
                    className="w-full rounded-xl border border-navy/15 px-4 py-3 text-navy-dark outline-none transition-colors placeholder:text-navy/35 focus:border-gold"
                  />
                </div>

                <button
                  onClick={() => handleStripeCheckout("ideal")}
                  disabled={processingMethod !== null || serverStatus === "missing" || verifyingCheckout}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gold-gradient px-6 py-4 text-base font-black uppercase tracking-wider text-navy-dark transition-all hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CreditCard className="h-5 w-5" />
                  {processingMethod === "ideal" ? copy.startingIdealCheckout : copy.startIdealCheckout}
                </button>
                <p className="text-center text-xs text-navy/50">{copy.secureNote}</p>

                <button
                  onClick={() => handleStripeCheckout("card")}
                  disabled={processingMethod !== null || serverStatus === "missing" || verifyingCheckout}
                  className="w-full rounded-xl border border-navy/10 bg-navy/5 px-6 py-3 text-sm font-bold uppercase tracking-wider text-navy transition-all hover:bg-navy/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingMethod === "card" ? copy.startingCardCheckout : copy.startCardCheckout}
                </button>

                <div className="rounded-xl border border-navy/10 bg-navy/5 p-4">
                  <div className="flex items-start gap-3">
                    <Landmark className="mt-1 h-5 w-5 shrink-0 text-navy/60" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-navy-dark">{copy.bankTitle}</p>
                      <p className="mt-1 font-mono text-sm font-semibold tracking-[0.08em] text-navy/80">
                        {siteConfig.giving.ibanDisplay}
                      </p>
                      <p className="mt-1 text-xs text-navy/55">
                        {copy.referenceLabel}: {transferReference}
                      </p>
                    </div>
                    <button
                      onClick={copyIban}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy transition-all hover:border-gold/50"
                      aria-label={copied ? copy.copied : copy.copyIban}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? copy.copied : copy.copyIban}
                    </button>
                  </div>
                </div>

                {serverStatus === "missing" && (
                  <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-900">
                    {copy.missingCheckoutBody}
                  </div>
                )}

                {serverStatus === "test" && (
                  <div className="rounded-lg border border-navy/10 bg-navy/5 p-3 text-sm text-navy/65">
                    {copy.testMode}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 py-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
                  <Check className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-display text-2xl font-bold text-navy-dark">
                  {copy.successTitle}
                </h3>
                <p className="text-sm leading-relaxed text-navy/65">
                  {copy.successBody} {confirmedOption.label}
                  {confirmedName ? `, ${confirmedName}` : ""}. {copy.successTail}
                </p>
                {checkoutNotice === "success" && (
                  <p className="text-xs font-bold uppercase tracking-wider text-navy/45">
                    {copy.successPayment}
                  </p>
                )}
                <button
                  onClick={resetGiveForm}
                  className="rounded-lg bg-gold-gradient px-8 py-3 text-sm font-bold uppercase tracking-wider text-navy-dark transition-all hover:shadow-gold"
                >
                  {copy.close}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GiveSection;
