const WHATSAPP_NUMBER = "16722245167";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function WhatsAppBubble() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-transform bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] start-[max(1.5rem,env(safe-area-inset-left,0px))]"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.381L1.054 31.2l6.023-1.937A15.89 15.89 0 0 0 16.004 32C24.826 32 32 24.822 32 16.004 32 7.176 24.826 0 16.004 0zm9.302 22.602c-.388 1.094-1.937 2.003-3.14 2.267-.825.177-1.9.318-5.524-1.188-4.637-1.926-7.623-6.627-7.856-6.934-.222-.307-1.87-2.49-1.87-4.749 0-2.26 1.183-3.37 1.604-3.83.388-.425 1.03-.615 1.645-.615.198 0 .376.01.536.018.46.02.691.047.994.768.378.9 1.3 3.168 1.412 3.4.115.231.222.536.075.843-.14.314-.264.454-.496.72-.231.264-.45.467-.682.752-.214.248-.454.513-.19.979.264.46 1.175 1.937 2.523 3.138 1.733 1.543 3.193 2.023 3.647 2.247.348.173.762.14.999-.107.222-.29.498-.772.779-1.249.198-.34.45-.38.758-.264.314.107 1.987.937 2.327 1.107.34.173.567.26.649.404.08.14.08.825-.307 1.919z" />
      </svg>
    </a>
  );
}
