'use client';

import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Shield, Truck, HeartHandshake } from 'lucide-react';

const PricingPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(212,175,55,0.03)_50%,transparent_100%)] animate-pulse" />
      </div>

      {/* Hero Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8">
            <Zap className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-medium text-[#D4AF37]">Premium EV Charging</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extralight mb-8 leading-[0.9] tracking-tight">
            Effortless
            <span className="block font-light bg-gradient-to-r from-[#D4AF37] via-[#D4AF37] to-[#D4AF37] bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the future of EV charging with Ampereon's Ace—where luxury meets sustainability
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            
            {/* Order Option */}
            <div
              className="group relative"
              onMouseEnter={() => setHoveredCard('order')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-10 border border-white/10 group-hover:border-[#D4AF37]/50 transition-all duration-700">
                  <div className="absolute top-0 right-6 -translate-y-1/2">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] px-4 py-2 rounded-full shadow-xl">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold text-black">Recommended</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-3xl font-light mb-4">Complete Experience</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Get the full Ace system with AI optimization included. Most customers keep AmplifyAI for the enhanced experience.
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-extralight text-[#D4AF37]">$224</span>
                    <span className="text-xl text-slate-400 line-through">$249</span>
                  </div>
                  <div className="text-slate-400 mb-1">One-time payment</div>
                  <div className="text-[#D4AF37] text-sm font-medium">+ $3.49/month for AmplifyAI (cancel anytime)</div>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    'Complete Ace charging system',
                    'AI-optimized charging schedules',
                    'Real-time analytics & monitoring',
                    'Premium mobile app experience',
                    'Priority customer support',
                    '2-year comprehensive warranty'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#D4AF37]" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#D4AF37]/25 transition-all duration-300 transform hover:-translate-y-1">
                  Order Complete System
                </button>
                
                <p className="text-xs text-slate-500 text-center mt-4">
                  Subscription can be cancelled after purchase
                </p>
              </div>
            </div>

            {/* Reserve Option */}
            <div
              className="group relative"
              onMouseEnter={() => setHoveredCard('reserve')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-10 border border-white/10 group-hover:border-white/30 transition-all duration-700">
                <div className="mb-8">
                  <h3 className="text-3xl font-light mb-4">Secure Your Spot</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Reserve your place in our limited production run with a minimal deposit. Perfect for early adopters.
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-extralight text-white">$5</span>
                  </div>
                  <div className="text-slate-400 mb-1">Refundable deposit</div>
                  <div className="text-slate-500 text-sm">Pay remaining balance when ready</div>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    'Priority production queue',
                    'Exclusive early access',
                    'Flexible payment schedule',
                    'Full refund available',
                    'Add AmplifyAI later',
                    'Same warranty coverage'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                  Reserve Your Ace
                </button>
              </div>
            </div>
          </div>

          {/* AmplifyAI Add-on */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-10 border border-[#D4AF37]/30">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/5 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 rounded-full mb-4">
                    <Zap className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm font-medium text-[#D4AF37]">AI Enhancement</span>
                  </div>
                  <h3 className="text-3xl font-light mb-4">AmplifyAI Subscription</h3>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Unlock the full potential of your Ace with AI-driven optimization and advanced analytics
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-4xl font-extralight text-[#D4AF37]">$3.49</span>
                      <span className="text-slate-400">/month</span>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        'Predictive charging optimization',
                        'Energy cost minimization',
                        'Battery health insights',
                        'Usage pattern analysis'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-[#D4AF37]" />
                          <span className="text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button className="w-full py-4 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-semibold rounded-xl hover:bg-gradient-to-r hover:from-[#D4AF37]/30 hover:to-[#D4AF37]/30 transition-all duration-300">
                      Add AI Enhancement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, text: '30-day guarantee' },
              { icon: Truck, text: 'Free WA shipping' },
              { icon: HeartHandshake, text: 'Expert support' },
              { icon: Zap, text: '2-year warranty' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-slate-400 group-hover:text-[#D4AF37]" />
                </div>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-extralight mb-6 leading-tight">
            Ready to
            <span className="block font-light bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] bg-clip-text text-transparent">
              Transform
            </span>
            Your Drive?
          </h2>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of forward-thinking drivers who've already made the switch to intelligent charging
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#D4AF37]/25 transition-all duration-300 transform hover:-translate-y-1 min-w-[280px]">
              Order Complete System
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm min-w-[200px]">
              Reserve for $5
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;