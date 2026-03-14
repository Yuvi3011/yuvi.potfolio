"use client";

import { useState, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin, Github, Twitter, Send, CheckCircle2 } from 'lucide-react';

const contactMethods = [
  {
    name: "Email",
    icon: Mail,
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "group-hover:border-cyan-500/50"
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    value: "linkedin.com/in/yuvraj",
    href: "https://linkedin.com",
    color: "from-blue-600/20 to-indigo-600/20",
    border: "group-hover:border-blue-500/50"
  },
  {
    name: "GitHub",
    icon: Github,
    value: "github.com/yuvraj",
    href: "https://github.com",
    color: "from-neutral-500/20 to-neutral-700/20",
    border: "group-hover:border-neutral-400/50"
  },
  {
    name: "Twitter",
    icon: Twitter,
    value: "@yuvraj_dev",
    href: "https://twitter.com",
    color: "from-sky-400/20 to-blue-500/20",
    border: "group-hover:border-sky-400/50"
  }
];

function TiltCard({ method, index }: { method: { name: string, icon: React.ElementType, value: string, href: string, color: string, border: string }, index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useMotionTemplate`${mouseYSpring}deg`;
  const rotateY = useMotionTemplate`${mouseXSpring}deg`;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct * 20); // max rotation 10deg
    y.set(yPct * -20);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = method.icon;

  return (
    <motion.a
      ref={ref}
      href={method.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative group block p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-colors duration-300 ${method.border} hover:bg-white/10`}
    >
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)`
        }}
      />
      
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${method.color} border border-white/10`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-white font-medium text-lg">{method.name}</h4>
          <p className="text-white/50 text-sm">{method.value}</p>
        </div>
      </div>
    </motion.a>
  );
}

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    
    // Simulate network request
    setTimeout(() => {
      setFormState('sent');
      
      // Reset form after a while
      setTimeout(() => {
        setFormState('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center py-32 px-4 md:px-8 z-20 overflow-hidden">
      
      {/* Background Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10 blur-xl"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
            Got an Idea? <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic">Let&apos;s Talk.</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl font-light">
            Whether you have a project in mind or just want to chat about tech, I&apos;m always open to new connections.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Panel: Contact Info */}
          <div className="flex flex-col gap-4" style={{ perspective: "1000px" }}>
            {contactMethods.map((method, index) => (
              <TiltCard key={method.name} method={method} index={index} />
            ))}
          </div>

          {/* Right Panel: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
          >
            {/* Paper Plane Animation Container */}
            <AnimatePresence>
              {formState === 'sending' && (
                <motion.div
                  initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                  animate={{ 
                    x: [0, 200, 500, 800], 
                    y: [0, -100, -300, -500],
                    rotate: [0, 15, 45, 45],
                    scale: [1, 1.2, 0.8, 0],
                    opacity: [1, 1, 0.8, 0]
                  }}
                  transition={{ duration: 1.5, ease: "easeIn" }}
                  className="absolute z-50 pointer-events-none"
                  style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
                >
                  <Send className="w-16 h-16 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)] fill-blue-400/20" />
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              
              {/* Name Input */}
              <div className="relative">
                <motion.label 
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focusedField === 'name' || formValues.name ? 'text-blue-400 text-xs top-2' : 'text-white/40 text-base top-4'
                  }`}
                >
                  Name
                </motion.label>
                <input
                  type="text"
                  required
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <motion.label 
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focusedField === 'email' || formValues.email ? 'text-blue-400 text-xs top-2' : 'text-white/40 text-base top-4'
                  }`}
                >
                  Email
                </motion.label>
                <input
                  type="email"
                  required
                  value={formValues.email}
                  onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"
                />
              </div>

              {/* Message Input */}
              <div className="relative">
                <motion.label 
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focusedField === 'message' || formValues.message ? 'text-blue-400 text-xs top-2' : 'text-white/40 text-base top-4'
                  }`}
                >
                  Message
                </motion.label>
                <textarea
                  required
                  rows={4}
                  value={formValues.message}
                  onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formState !== 'idle'}
                className="relative group w-full p-[1px] rounded-xl overflow-hidden mt-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-70 group-hover:opacity-100 object-cover rounded-xl transition-opacity duration-300" />
                <div className="relative flex items-center justify-center gap-2 bg-black/50 backdrop-blur-md rounded-xl py-4 transition-colors group-hover:bg-black/20">
                  {formState === 'idle' && (
                    <>
                      <span className="text-white font-medium">Send Message</span>
                      <Send className="w-4 h-4 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                  {formState === 'sending' && (
                    <span className="text-white font-medium animate-pulse">Sending...</span>
                  )}
                  {formState === 'sent' && (
                    <>
                      <span className="text-white font-medium">Message Sent!</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
