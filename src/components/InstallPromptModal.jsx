import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, CheckCircle, QrCode, Share2 } from 'lucide-react';
import { sensoryAudio } from '../utils/audio';

export default function InstallPromptModal({ onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    sensoryAudio.playSparkle();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions
      alert('Para instalar:\n- No Android: toque nos 3 pontinhos do Chrome e escolha "Instalar aplicativo".\n- No iPhone: toque em Compartilhar no Safari e escolha "Adicionar à Tela de Início".');
    }
  };

  const copyAppUrl = () => {
    sensoryAudio.playPop();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 hover:bg-slate-200 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-sky-600 font-extrabold text-xs uppercase tracking-wider mb-2">
          <Download size={18} />
          <span>Como Baixar e Instalar o App</span>
        </div>

        <h3 className="text-xl font-black text-slate-800 mb-2">
          NeuroRotina no seu Celular ou Tablet
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          O app é um <strong>PWA (Progressive Web App)</strong> nativo. Ele roda sem precisar de loja da Google/Apple e pode ser baixado direto no aparelho dos visitantes e jurados da feira!
        </p>

        {/* Direct Install Button */}
        <button
          onClick={handleInstallClick}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 active:scale-95 text-white font-black text-sm shadow-xl shadow-sky-200 transition flex items-center justify-center gap-3 mb-6"
        >
          <Download size={20} />
          {isInstalled ? 'App Já Instalado no Dispositivo' : 'Instalar Agora com 1 Clique'}
        </button>

        {/* Step-by-step guide for judges/visitors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-black text-xs text-slate-800 mb-2">
              <Smartphone size={16} className="text-emerald-500" />
              No Android (Chrome)
            </div>
            <ol className="text-[11px] text-slate-600 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Abra o link no navegador <strong>Chrome</strong></li>
              <li>Toque no menu <strong>(3 pontinhos)</strong></li>
              <li>Toque em <strong>"Instalar aplicativo"</strong> ou "Adicionar à tela inicial"</li>
            </ol>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-black text-xs text-slate-800 mb-2">
              <Smartphone size={16} className="text-sky-500" />
              No iPhone / iPad (Safari)
            </div>
            <ol className="text-[11px] text-slate-600 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Abra o link no <strong>Safari</strong></li>
              <li>Toque no botão <strong>Compartilhar</strong> (ícone com seta para cima)</li>
              <li>Role e toque em <strong>"Adicionar à Tela de Início"</strong></li>
            </ol>
          </div>
        </div>

        {/* Share Link for the booth */}
        <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <QrCode size={18} className="text-sky-600 shrink-0" />
            <span className="text-xs font-bold text-sky-800 truncate">
              Link de Demonstração para a Feira
            </span>
          </div>
          <button
            onClick={copyAppUrl}
            className="text-xs font-black text-sky-700 bg-white hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0"
          >
            {copiedLink ? (
              <>
                <CheckCircle size={14} className="text-emerald-600" /> Copiado!
              </>
            ) : (
              <>
                <Share2 size={14} /> Copiar Link
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          💡 Para a feira: basta imprimir um QR Code com este link para os jurados apontarem a câmera e instalarem na hora!
        </p>
      </div>
    </div>
  );
}
