"use client";

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { db } from '../../firebaseConfig.js'; // Adjust path if needed
import { collection, addDoc } from 'firebase/firestore';
import { ChevronRight, User, Mail, Calendar, Clock, Tool, Star, Briefcase, CheckSquare, FileText, Heart, Check, X } from 'lucide-react';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function InternshipApplication() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    basics: {
      location: '',
      school: '',
      availability: '',
      length: '',
      lookingFor: '',
    },
    skills: {
      mechanical: { rating: '', tools: '' },
      electronics: { rating: '', tools: '' },
      firmware: { rating: '', tools: '' },
      robotics: { rating: '', tools: '' },
      backend: { rating: '', tools: '' },
      mobile: { rating: '', tools: '' },
      marketing: { rating: '', tools: '' },
      content: { rating: '', tools: '' },
      growth: { rating: '', tools: '' },
      bizops: { rating: '', tools: '' },
      supply: { rating: '', tools: '' },
      fundraising: { rating: '', tools: '' },
    },
    excites: [],
    showAndTell: {
      project1: '',
      project2: '',
      project3: '',
      tools: '',
    },
    logistics: {
      constraints: '',
      nda: '',
      limitations: '',
      reference: '',
    },
    why: '',
  });

  const stepRef = useRef(null);
  const isInView = useInView(stepRef, { once: true });

  const skillAreas = [
    { key: 'mechanical', label: 'Mechanical design & prototyping', examples: 'CAD, 3-D print, tolerance, DFM' },
    { key: 'electronics', label: 'Electronics & PCB', examples: 'KiCad/Altium, solder, debug, safety' },
    { key: 'firmware', label: 'Firmware / embedded', examples: 'C/C++, STM32, RTOS, drivers' },
    { key: 'robotics', label: 'Robotics / controls', examples: 'motion, PID, kinematics' },
    { key: 'backend', label: 'Backend / data', examples: 'Node/Python, APIs, AWS, SQL' },
    { key: 'mobile', label: 'Mobile / UX', examples: 'React Native/Flutter, Figma' },
    { key: 'marketing', label: 'Digital marketing', examples: 'paid ads, SEO, email, analytics' },
    { key: 'content', label: 'Content & social', examples: 'short-form video, X/TikTok, writing' },
    { key: 'growth', label: 'Growth & community', examples: 'referral loops, beta programs' },
    { key: 'bizops', label: 'BizOps & finance', examples: 'cost modeling, projections, grants' },
    { key: 'supply', label: 'Supply-chain & ops', examples: 'vendors, BOMs, logistics' },
    { key: 'fundraising', label: 'Fundraising / pitch', examples: 'deck design, investor research' },
  ];

  const exciteOptions = [
    'Industrial design & enclosures',
    'Motor control & motion planning',
    'Power electronics & safety certs',
    'Firmware for sensors/actuators',
    'Backend scheduling algorithms',
    'Mobile-app polish & onboarding',
    'TikTok/Instagram/X content & memes',
    'SEO, email flows, paid search',
    'Community building / beta program',
    'Partnerships & channel sales',
    'Grant writing & pitch decks',
    'Manufacturing supply chain & QA',
  ];

  const validateStep = (currentStep) => {
    const errors = {};
    if (currentStep === 1) {
      if (!formData.basics.location.trim()) errors.location = 'Location is required';
      if (!formData.basics.school.trim()) errors.school = 'School/major is required';
      if (!formData.basics.availability.trim()) errors.availability = 'Availability is required';
      if (!formData.basics.length.trim()) errors.length = 'Internship length is required';
      if (!formData.basics.lookingFor.trim()) errors.lookingFor = 'Preference is required';
    } else if (currentStep === 2) {
      skillAreas.forEach(area => {
        if (!formData.skills[area.key].rating) errors[`${area.key}_rating`] = 'Rating required';
      });
    } else if (currentStep === 3) {
      if (formData.excites.length === 0) errors.excites = 'Select at least one';
    } else if (currentStep === 4) {
      if (!formData.showAndTell.project1.trim() && !formData.showAndTell.project2.trim()) errors.projects = 'At least 2 projects required';
    } else if (currentStep === 5) {
      if (!formData.logistics.nda) errors.nda = 'NDA comfort required';
    } else if (currentStep === 6) {
      const whyValue = typeof formData.why === 'string' ? formData.why : '';
      if (!whyValue.trim()) errors.why = 'Your why is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'why') {
      setFormData({
        ...formData,
        why: value || '',
      });
    } else {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: value || '' },
      });
    }
    if (validationErrors[field] || validationErrors[section]) {
      setValidationErrors({ ...validationErrors, [field]: '', [section]: '' });
    }
  };

  const handleSkillChange = (key, field, value) => {
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [key]: { ...formData.skills[key], [field]: value },
      },
    });
    const errorKey = `${key}_${field}`;
    if (validationErrors[errorKey]) {
      setValidationErrors({ ...validationErrors, [errorKey]: '' });
    }
  };

  const handleCheckboxChange = (option) => {
    setFormData({
      ...formData,
      excites: formData.excites.includes(option)
        ? formData.excites.filter(o => o !== option)
        : [...formData.excites, option],
    });
    if (validationErrors.excites) {
      setValidationErrors({ ...validationErrors, excites: '' });
    }
  };

  const nextStep = async () => {
    if (!validateStep(step)) return;
    if (step === 6) {
      try {
        await addDoc(collection(db, 'internshipApplications'), formData);
        setStep(7); // Success step
      } catch (err) {
        setError('Failed to submit application');
      }
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const steps = ['Basics', 'Skills', 'Excites', 'Show & Tell', 'Logistics', 'Your Why'];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-16">
      <motion.div
        className="max-w-4xl mx-auto px-6"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div ref={stepRef} className="mb-16" variants={fadeUpVariants}>
          <div className="flex items-center justify-between mb-8 flex-wrap">
            {steps.map((label, index) => (
              <div key={index} className="flex flex-col items-center min-w-[100px] mb-4">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium ${
                  step > index + 1 ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : step === index + 1 ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-gray-600 text-gray-400'
                }`}>
                  {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`mt-2 text-sm text-center ${step >= index + 1 ? 'text-white' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-px bg-gray-800 relative">
            <div className="h-px bg-[#D4AF37] transition-all duration-500" style={{ width: `${((step - 1) / steps.length) * 100}%` }} />
          </div>
        </motion.div>

        <motion.div variants={fadeUpVariants} className="text-center mb-8">
          <h1 className="text-3xl font-light mb-4">Ampereon Internship Application</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Thanks for your interest! We’re a tiny, scrappy crew building hardware, software, and a brand all at once. Fill out the form below to apply.</p>
        </motion.div>

        {step <= 6 && (
          <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
            {step === 1 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                {[
                  { id: 'location', label: 'Location & time-zone', icon: User, placeholder: 'e.g., New York, EST' },
                  { id: 'school', label: 'School/major & grad year (if any)', icon: Mail, placeholder: 'e.g., MIT / EE / 2026' },
                  { id: 'availability', label: 'Weekly availability & preferred start date', icon: Calendar, placeholder: 'e.g., 20 hours/week, starting Sept 2025' },
                  { id: 'length', label: 'Internship length you have in mind', icon: Clock, placeholder: 'e.g., 3 months' },
                  { id: 'lookingFor', label: 'Looking for school credit, stipend, or paid role?', icon: Tool, placeholder: 'e.g., paid role' },
                ].map(field => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      {field.icon ? (
                        <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      ) : (
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">?</span>
                      )}
                      <input
                        type="text"
                        id={field.id}
                        value={formData.basics[field.id]}
                        onChange={(e) => handleInputChange('basics', field.id, e.target.value)}
                        className={`w-full pl-10 py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                          validationErrors[field.id] ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder={field.placeholder}
                      />
                    </div>
                    {validationErrors[field.id] && <p className="text-sm text-red-400 mt-1">{validationErrors[field.id]}</p>}
                  </div>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                {skillAreas.map(area => (
                  <div key={area.key} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2 col-span-1">
                      {area.label}
                    </label>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Rating (0-5)</label>
                      <select
                        value={formData.skills[area.key].rating}
                        onChange={(e) => handleSkillChange(area.key, 'rating', e.target.value)}
                        className={`w-full py-2 bg-[#0A0A0A] border rounded text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                          validationErrors[`${area.key}_rating`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                      >
                        <option value="">Select</option>
                        {[0,1,2,3,4,5].map(num => <option key={num} value={num}>{num}</option>)}
                      </select>
                      {validationErrors[`${area.key}_rating`] && <p className="text-sm text-red-400 mt-1">{validationErrors[`${area.key}_rating`]}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Tools/Experiences ({area.examples})</label>
                      <input
                        type="text"
                        value={formData.skills[area.key].tools}
                        onChange={(e) => handleSkillChange(area.key, 'tools', e.target.value)}
                        className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600"
                        placeholder="e.g., SolidWorks, soldering iron"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                <p className="text-gray-300">Check all that apply:</p>
                {exciteOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.excites.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="form-checkbox text-[#D4AF37]"
                    />
                    <span className="text-gray-300">{option}</span>
                  </label>
                ))}
                {validationErrors.excites && <p className="text-sm text-red-400 mt-1">{validationErrors.excites}</p>}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project 1 (Your role + hardest problem, 2-3 sentences, links welcome)</label>
                  <textarea
                    value={formData.showAndTell.project1}
                    onChange={(e) => handleInputChange('showAndTell', 'project1', e.target.value)}
                    className={`w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                      validationErrors.projects ? 'border-red-500' : 'border-gray-600'
                    }`}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project 2</label>
                  <textarea
                    value={formData.showAndTell.project2}
                    onChange={(e) => handleInputChange('showAndTell', 'project2', e.target.value)}
                    className={`w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                      validationErrors.projects ? 'border-red-500' : 'border-gray-600'
                    }`}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project 3 (optional)</label>
                  <textarea
                    value={formData.showAndTell.project3}
                    onChange={(e) => handleInputChange('showAndTell', 'project3', e.target.value)}
                    className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600"
                    rows={4}
                  />
                </div>
                {validationErrors.projects && <p className="text-sm text-red-400 mt-1">{validationErrors.projects}</p>}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Any tools/space you already have (e.g., shop access, Adobe CC, HubSpot)</label>
                  <input
                    type="text"
                    value={formData.showAndTell.tools}
                    onChange={(e) => handleInputChange('showAndTell', 'tools', e.target.value)}
                    className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600"
                    placeholder="e.g., 3D printer, Figma"
                  />
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time constraints (classes, job, etc.)?</label>
                  <input
                    type="text"
                    value={formData.logistics.constraints}
                    onChange={(e) => handleInputChange('logistics', 'constraints', e.target.value)}
                    className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600"
                    placeholder="e.g., Classes Mon-Wed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Comfortable signing an NDA and working in private repos/Notion?</label>
                  <select
                    value={formData.logistics.nda}
                    onChange={(e) => handleInputChange('logistics', 'nda', e.target.value)}
                    className={`w-full py-2 bg-[#0A0A0A] border rounded text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                      validationErrors.nda ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {validationErrors.nda && <p className="text-sm text-red-400 mt-1">{validationErrors.nda}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Any hardware / lab-safety limitations?</label>
                  <input
                    type="text"
                    value={formData.logistics.limitations}
                    onChange={(e) => handleInputChange('logistics', 'limitations', e.target.value)}
                    className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600"
                    placeholder="e.g., No access to high voltage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reference (optional): someone who’s seen you build or ship.</label>
                  <input
                    type="text"
                    value={formData.logistics.reference}
                    onChange={(e) => handleInputChange('logistics', 'reference', e.target.value)}
                    className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600"
                    placeholder="e.g., Prof. Smith, smith@email.com"
                  />
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">In 4–6 sentences, why does Ampereon get you pumped and what do you hope to own or learn here?</label>
                <textarea
                  value={formData.why || ''}
                  onChange={(e) => handleInputChange('why', '', e.target.value)}
                  className={`w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                    validationErrors.why ? 'border-red-500' : 'border-gray-600'
                  }`}
                  rows={6}
                />
                {validationErrors.why && <p className="text-sm text-red-400 mt-1">{validationErrors.why}</p>}
              </motion.div>
            )}

            {error && <p className="text-red-400 mt-4">{error}</p>}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="py-3 px-6 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={nextStep}
                className="py-3 px-6 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors ml-auto"
              >
                {step === 6 ? 'Submit Application' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <motion.div variants={fadeUpVariants} className="text-center">
            <h2 className="text-2xl font-light mb-4">Application Submitted!</h2>
            <p className="text-gray-400">Thanks for applying. We'll be in touch soon.</p>
          </motion.div>
        )}

        <motion.div variants={fadeUpVariants} className="mt-16">
          <h2 className="text-2xl font-light mb-4">About Ampereon</h2>
          <p className="text-gray-300 mb-4">
            Ampereon is building an automatic, hands-free home EV charging add-on that clips onto the Level-2 charger people already own. A magnetic rail-arm docks the cable for them; our software schedules charging at the cheapest, battery-friendly hours.
          </p>
          <h3 className="text-xl font-light mb-2">Traction (July 2025)</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Functional prototype; final tuning + firmware polish in progress.</li>
            <li>5 paid pre-orders secured; lining up a 100-unit pilot then a 1,000-unit run.</li>
            <li>Early price $99.99 → $124.99 → $149 (+$2/mo optimization sub after the first 1k units).</li>
            <li>Roadmap: pilot reliability, app v1, UL/File certs, utility-rate integrations, and a crowdfunding push.</li>
          </ul>
          <p className="text-gray-300 mt-4">
            We’re equal parts hardware nerds, code junkies, and growth hackers. If that mix sounds fun, we look forward to your application!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}