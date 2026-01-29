
import { trackEvent } from "../utils/analytics"; 

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
  const handleClick = () => {
     trackEvent('premium_button_click', { 
        precio: price,
        label 
      });
    const checkoutUrl = "https://buy.stripe.com/test_4gM7sM3sV3evd6x3ltdnW01";
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
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


