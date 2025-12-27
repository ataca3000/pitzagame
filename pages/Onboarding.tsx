import React, { useState } from 'react';
import { Wifi, Newspaper, Rocket, ArrowRight, X, Zap } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Monetize Your Connection",
    description: "Turn your unused WiFi bandwidth into rewards. Our decentralized network runs in the background while you sleep.",
    icon: <Wifi size={64} className="text-neon-cyan" />,
    color: "from-cyan-500/20 to-blue-600/20",
    borderColor: "border-neon-cyan"
  },
  {
    id: 2,
    title: "AI-Curated Intel",
    description: "Stay ahead with the Galaxy Feed. Read AI-generated news on Tech & Innovation. Engage to earn extra balance.",
    icon: <Newspaper size={64} className="text-neon-green" />,
    color: "from-green-500/20 to-emerald-600/20",
    borderColor: "border-neon-green"
  },
  {
    id: 3,
    title: "Missions & Digital Items",
    description: "Complete daily ops, watch ads, and recruit pilots to unlock rare badges and maximize your earning rate.",
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
    setTimeout(onComplete, 500); // Allow exit animation to play
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] bg-gradient-to-br ${step.color} transition-all duration-1000`}></div>
      </div>

      <div className="relative w-full max-w-md px-6">
        <div className={`bg-surface border ${step.borderColor} rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors duration-500`}>
          
          {/* Skip Button */}
          <button 
            onClick={handleFinish}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-xs font-mono font-bold tracking-widest z-20"
          >
            SKIP_INTRO
          </button>

          {/* Content */}
          <div className="flex flex-col items-center text-center relative z-10 pt-4">
            <div className="mb-8 p-6 bg-black/40 rounded-full border border-gray-800 shadow-xl relative group">
               <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse-fast"></div>
               <div className="transform transition-transform duration-500 group-hover:scale-110">
                 {step.icon}
               </div>
            </div>

            <h2 className="text-2xl font-display font-black text-white mb-4 leading-tight">
              {step.title}
            </h2>
            
            <p className="text-gray-400 leading-relaxed mb-8">
              {step.description}
            </p>

            {/* Progress Dots */}
            <div className="flex gap-2 mb-8">
              {ONBOARDING_STEPS.map((s, idx) => (
                <div 
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-white' : 'w-2 bg-gray-700'}`}
                />
              ))}
            </div>

            {/* Action Button */}
            <button
              onClick={handleNext}
              className={`group relative w-full py-4 rounded-xl font-bold font-display uppercase tracking-widest text-black transition-all transform active:scale-95 overflow-hidden
                ${currentStep === 0 ? 'bg-neon-cyan hover:bg-cyan-300' : ''}
                ${currentStep === 1 ? 'bg-neon-green hover:bg-green-300' : ''}
                ${currentStep === 2 ? 'bg-neon-pink hover:bg-pink-300' : ''}
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {currentStep === ONBOARDING_STEPS.length - 1 ? 'Start Mission' : 'Next Step'}
                {currentStep === ONBOARDING_STEPS.length - 1 ? <Zap size={20} /> : <ArrowRight size={20} />}
              </div>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};