import React, { useState } from "react";
import { PremiumButton } from "./components/PremiumButton";
import "./App.css";

type RiskLevel = "verde" | "amarillo" | "rojo";

function calcularCuotaMensual(monto: number, tasaAnual: number, meses: number) {
  if (!monto || !tasaAnual || !meses) return 0;
  const r = tasaAnual / 100 / 12;
  const cuota = (monto * r) / (1 - Math.pow(1 + r, -meses));
  return Math.round(cuota * 100) / 100;
}

function calcularRiesgo(porcentajeIngreso: number): RiskLevel {
  if (porcentajeIngreso <= 25) return "verde";
  if (porcentajeIngreso <= 35) return "amarillo";
  return "rojo";
}

const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};


// En PremiumButton handleClick:
trackEvent('premium_click', { precio: price });

const App: React.FC = () => {
  const [pais, setPais] = useState<"AR" | "ES" | "OTRO">("AR");
  const [ingreso, setIngreso] = useState<number>(0);
  const [deudaActual, setDeudaActual] = useState<number>(0);
  const [monto, setMonto] = useState<number>(100000);
  const [plazo, setPlazo] = useState<number>(24);
  const [tasa, setTasa] = useState<number>(80);
  const [cuota, setCuota] = useState<number | null>(null);
  const [porcentaje, setPorcentaje] = useState<number | null>(null);
  const [riesgo, setRiesgo] = useState<RiskLevel | null>(null);

  const onCalcular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingreso || !monto || !plazo || !tasa) return;
    const cuotaNueva = calcularCuotaMensual(monto, tasa, plazo);
    const totalCuota = deudaActual + cuotaNueva;
    const porcentajeIngreso = Math.round((totalCuota / ingreso) * 100);
    const nivelRiesgo = calcularRiesgo(porcentajeIngreso);

    trackEvent('premium_click', { precio: 9.99 });
    trackEvent('simulacion_completada', { 
      riesgo: nivelRiesgo,
      cuota: totalCuota,
      porcentaje: porcentajeIngreso 
    });
    setCuota(cuotaNueva);
    setPorcentaje(porcentajeIngreso);
    setRiesgo(nivelRiesgo);
  };

  const labelRiesgo =
    riesgo === "verde"
      ? "Zona saludable"
      : riesgo === "amarillo"
      ? "Zona de cuidado"
      : "Zona de riesgo";

  const colorRiesgo =
    riesgo === "verde" ? "#22c55e" : riesgo === "amarillo" ? "#eab308" : "#ef4444";

  return (
    <div className="page">
      <div className="card">
        <h1>¿Te conviene sacar este crédito?</h1>
        <p className="subtitle">
          Completá tus datos básicos y te mostramos un semáforo de tu situación.
        </p>

        <form onSubmit={onCalcular} className="form">
          <div className="field">
            <label>País</label>
            <select
              value={pais}
              onChange={(e) => setPais(e.target.value as any)}
            >
              <option value="AR">Argentina</option>
              <option value="ES">España</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div className="field">
            <label>Ingreso mensual (neto)</label>
            <input
              type="number"
              min={0}
              value={ingreso || ""}
              onChange={(e) => setIngreso(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Cuotas que ya pagás por mes (deudas actuales)</label>
            <input
              type="number"
              min={0}
              value={deudaActual || ""}
              onChange={(e) => setDeudaActual(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Monto que querés pedir</label>
            <input
              type="number"
              min={0}
              value={monto || ""}
              onChange={(e) => setMonto(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Plazo (meses)</label>
            <input
              type="number"
              min={3}
              max={84}
              value={plazo || ""}
              onChange={(e) => setPlazo(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Tasa anual estimada (%)</label>
            <input
              type="number"
              min={0}
              value={tasa || ""}
              onChange={(e) => setTasa(Number(e.target.value))}
            />
          </div>

          <button type="submit" className="button">
            Ver mi situación
          </button>
        </form>

        {cuota !== null && porcentaje !== null && riesgo && (
          <div className="resultBox">
            <h2>Tu situación con este crédito</h2>
            <div className="badge" style={{ backgroundColor: colorRiesgo }}>
              {labelRiesgo}
            </div>
            <p className="resultText">
              Cuota nueva estimada: <strong>{cuota.toLocaleString()}</strong>
            </p>
            <p className="resultText">
              Total de cuotas (actuales + nueva):{" "}
              <strong>{(deudaActual + cuota).toLocaleString()}</strong>
            </p>
            <p className="resultText">
              Porcentaje de tu ingreso destinado a deudas:{" "}
              <strong>{porcentaje}%</strong>
            </p>
            <small className="disclaimer">
              Esto es una estimación, no una oferta vinculante.
            </small>
{riesgo && (
  <div className="premium-section">
    <h3 className="premium-title">¿Querés un análisis más completo?</h3>
    <p className="premium-text">
      Por solo <strong>€9,99</strong> te mandamos por email:
    </p>
    <ul className="premium-features">
      <li>Comparación con 15 bancos españoles</li>
      <li>Probabilidad de aprobación estimada</li>
      <li>Plan de pago personalizado</li>
      <li>Alertas cuando bajen las tasas</li>
    </ul>
    <PremiumButton
      price={9.99}
      label="Informe Premium de Créditos"
      description="Análisis completo + alertas personalizadas"
    />
    <small className="premium-disclaimer">
      Pago seguro con Stripe. Cancelación inmediata si no te convence.
    </small>
  </div>
)}

          </div>
        )}
      </div>
    </div>
  );
};

export default App;
