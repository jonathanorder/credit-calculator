export const trackEvent = (eventName: string, params?: Record<string, any>) => {
   console.log('🚀 TRACK:', eventName, params); // ← DEBUG TEMPORAL
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};