import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RopFFJO2VOQiS5bPDDh7KKtwozJZEer9WZ8VSfVyHyvfbjjTMYMeqjRgFapT2qpYm24W1sHUc4sQmfPnc4Ev2U300YrhvBVqP");



interface PremiumButtonProps {
  price: number;
  label: string;
  description: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  price,
  label,
  description,
}) => {
  const handleClick = async () => {
    // Stripe Checkout Link (creás este link en Stripe Dashboard)
    const checkoutUrl = "https://buy.stripe.com/test_4gM7sM3sV3evd6x3ltdnW01"; // ← CAMBIAR por tu link
    window.open(checkoutUrl, "_blank");
  };

  return (
    <button onClick={handleClick} className="premium-button">
      <div className="premium-info">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>
      <div className="premium-price">€{price.toFixed(2)}</div>
    </button>
  );
};
