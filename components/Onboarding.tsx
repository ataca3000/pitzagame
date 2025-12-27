
import React, { useState } from 'react';
import { Lock, Newspaper, Rocket, ArrowRight, Zap, Database, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Bóveda Cuántica Segura",
    description: "Bienvenido a NeuralNode. Tu bóveda personal acumula recompensas pasivas mientras exploras el ecosistema. Mantén tu sesión activa para maximizar el crecimiento.",
    icon: <Lock size={64} className="text-neon-cyan" />,
    color: "from-cyan-500/20 to-blue-600/20",
    borderColor: "border-neon-cyan"
  },
  {
    id: 2,
    title: "Intel Curada por IA",
    description: "Mantente al día con el Feed de Noticias generado por nuestra IA (ARIA). Interactúa con el contenido para ganar Unidades (U) directamente a tu billetera.",
    icon: <Newspaper size={64} className="text-neon-green" />,
    color: "from-green-500/20 to-emerald-600/20",
    borderColor: "border-neon-green"
  },
  {
    id: 3,
    title: "Misiones y Recompensas",
    description: "Completa operaciones diarias, mira contenido patrocinado y escala en el ranking para desbloquear tu Bóveda y retirar tus beneficios.",
    icon: <Rocket size={64} className="text-neon-pink" />,
    color: "from-pink-500/20 to-purple-600/20",
    borderColor: "border-neon-pink"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(onComplete, 500); 
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] bg-gradient-to-br ${step.color} transition-all duration-1000`}></div>
      </div>

      <div className="relative w-full max-w-md px-6">
        <div className={`bg-[#0F172A] border ${step.borderColor} rounded-[45px] p-10 shadow-2xl relative overflow-hidden transition-colors duration-500`}>
          
          <button 
            onClick={handleFinish}
            className="absolute top-6 right-8 text-gray-500 hover:text-white transition-colors text-[10px] font-mono font-bold tracking-widest z-20"
          >
            SALTAR_INTRO
          </button>

          <div className="flex flex-col items-center text-center relative z-10 pt-4">
            <div className="mb-8 p-8 bg-black/40 rounded-full border border-gray-800 shadow-xl relative group">
               <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
               <div className="transform transition-transform duration-500 group-hover:scale-110">
                 {step.icon}
               </div>
            </div>

            <h2 className="text-2xl font-display font-black text-white mb-4 leading-tight italic uppercase tracking-tighter">
              {step.title}
            </h2>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {step.description}
            </p>

            <div className="flex gap-2 mb-10">
              {ONBOARDING_STEPS.map((s, idx) => (
                <div 
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-10 bg-white' : 'w-2 bg-gray-700'}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className={`group relative w-full py-5 rounded-[25px] font-black font-display uppercase tracking-widest text-black transition-all transform active:scale-95 overflow-hidden
                ${currentStep === 0 ? 'bg-neon-cyan' : ''}
                ${currentStep === 1 ? 'bg-neon-green' : ''}
                ${currentStep === 2 ? 'bg-neon-pink' : ''}
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {currentStep === ONBOARDING_STEPS.length - 1 ? 'Iniciar Protocolo' : 'Siguiente Paso'}
                {currentStep === ONBOARDING_STEPS.length - 1 ? <Zap size={20} /> : <ArrowRight size={20} />}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
