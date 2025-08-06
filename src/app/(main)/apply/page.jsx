"use client";

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { db, storage } from '../../firebaseConfig.js'; // Adjust path if needed, assuming storage is exported
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ChevronRight, User, Mail, Calendar, Clock, Tool, Star, Briefcase, CheckSquare, FileText, Heart, Check, X, File } from 'lucide-react';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const MAX_WORDS = 150;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function InternshipApplication() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      age: '',
      email: '',
      phone: '',
    },
    basics: {
      location: '',
      school: '',
      availability: '',
      length: '',
      role: '',
      sponsorship: '',
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
      project1: { description: '', date: '', tools: '' },
      project2: { description: '', date: '', tools: '' },
      project3: { description: '', date: '', tools: '' },
      personalTools: '',
    },
    logistics: {
      constraints: '',
      nda: '',
      limitations: '',
      reference: '',
    },
    why: '',
    resumeFile: null,
    resumeUrl: '',
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

  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const validateStep = (currentStep) => {
    const errors = {};
    if (currentStep === 1) {
      if (!formData.personal.firstName.trim()) errors.firstName = 'First name is required';
      if (!formData.personal.lastName.trim()) errors.lastName = 'Last name is required';
      if (!formData.personal.age.trim()) errors.age = 'Age is required';
      if (!formData.personal.email.trim()) errors.email = 'Email is required';
    } else if (currentStep === 2) {
      if (!formData.basics.location.trim()) errors.location = 'Location is required';
      if (!formData.basics.school.trim()) errors.school = 'School/major is required';
      if (!formData.basics.availability.trim()) errors.availability = 'Availability is required';
      if (!formData.basics.length.trim()) errors.length = 'Internship length is required';
      if (!formData.basics.role) errors.role = 'Role selection is required';
      if (!formData.basics.sponsorship) errors.sponsorship = 'Sponsorship status is required';
      if (!formData.resumeFile) errors.resume = 'Resume PDF is required';
    } else if (currentStep === 3) {
      skillAreas.forEach(area => {
        if (!formData.skills[area.key].rating) errors[`${area.key}_rating`] = 'Rating required';
      });
    } else if (currentStep === 4) {
      if (formData.excites.length === 0) errors.excites = 'Select at least one';
    } else if (currentStep === 5) {
      if (!formData.showAndTell.project1.description.trim() && !formData.showAndTell.project2.description.trim()) errors.projects = 'At least 2 projects required';
    } else if (currentStep === 6) {
      if (!formData.logistics.nda) errors.nda = 'NDA comfort required';
    } else if (currentStep === 7) {
      const whyValue = typeof formData.why === 'string' ? formData.why : '';
      if (!whyValue.trim()) errors.why = 'Your why is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'why') {
      if (countWords(value) <= MAX_WORDS) {
        setFormData({ ...formData, why: value });
      }
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

  const handleProjectChange = (projectKey, subField, value) => {
    if (subField === 'description') {
      if (countWords(value) > MAX_WORDS) return;
    }
    setFormData({
      ...formData,
      showAndTell: {
        ...formData.showAndTell,
        [projectKey]: {
          ...formData.showAndTell[projectKey],
          [subField]: value,
        },
      },
    });
    if (validationErrors.projects) {
      setValidationErrors({ ...validationErrors, projects: '' });
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

  const validatePDF = (file) => {
    return new Promise((resolve, reject) => {
      if (file.type !== 'application/pdf') {
        reject('Please upload a PDF file.');
      }
      if (file.size > MAX_FILE_SIZE) {
        reject('File size exceeds 5MB limit.');
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target.result.slice(0, 4));
        const header = String.fromCharCode(...arr);
        if (header !== '%PDF') {
          reject('Invalid PDF file.');
        } else {
          resolve();
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await validatePDF(file);
        setFormData({ ...formData, resumeFile: file });
        setError(null);
        if (validationErrors.resume) {
          setValidationErrors({ ...validationErrors, resume: '' });
        }
      } catch (err) {
        setError(err);
        e.target.value = '';
      }
    }
  };

  const uploadResume = async () => {
    if (!formData.resumeFile || !storage) {
      console.warn('No resume file or storage not initialized');
      return '';
    }
    const fileRef = storageRef(storage, `resumes/${Date.now()}_${formData.resumeFile.name}`);
    try {
      const snapshot = await uploadBytes(fileRef, formData.resumeFile);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
  };

  const nextStep = async () => {
    if (!validateStep(step)) return;
    if (step === 7) {
      try {
        let resumeUrl = formData.resumeUrl;
        if (formData.resumeFile && storage) {
          resumeUrl = await uploadResume();
          // Update formData with the new resumeUrl
          setFormData(prev => ({ ...prev, resumeUrl }));
        }
        // Create a new object excluding resumeFile
        const dataToSubmit = { ...formData };
        delete dataToSubmit.resumeFile; // Remove the File object
        await addDoc(collection(db, 'internshipApplications'), dataToSubmit);
        setStep(8); // Success step
      } catch (err) {
        setError('Failed to submit application: ' + err.message);
      }
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const steps = ['Personal Info', 'Basics', 'Skills', 'Excites', 'Show & Tell', 'Logistics', 'Your Why'];

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

        {step <= 7 && (
          <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
            {step === 1 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                {[
                  { id: 'firstName', label: 'First Name', icon: User, placeholder: 'e.g., John' },
                  { id: 'lastName', label: 'Last Name', icon: User, placeholder: 'e.g., Doe' },
                  { id: 'age', label: 'Age', icon: User, placeholder: 'e.g., 22', type: 'number' },
                  { id: 'email', label: 'Email', icon: Mail, placeholder: 'e.g., john@example.com' },
                  { id: 'phone', label: 'Phone (optional)', icon: Mail, placeholder: 'e.g., 123-456-7890' },
                ].map(field => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={field.type || 'text'}
                        id={field.id}
                        value={formData.personal[field.id]}
                        onChange={(e) => handleInputChange('personal', field.id, e.target.value)}
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
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                    What role are you applying for?
                  </label>
                  <select
                    id="role"
                    value={formData.basics.role}
                    onChange={(e) => handleInputChange('basics', 'role', e.target.value)}
                    className={`w-full py-2 bg-[#0A0A0A] border rounded text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                      validationErrors.role ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <option value="">Select a role</option>
                    <option value="Film Intern">Intern (Select if applying for internship not listed below)</option>
                    <option value="Film Intern">Film Intern</option>
                    <option value="Social Media Intern">Social Media Intern</option>
                  </select>
                  {validationErrors.role && <p className="text-sm text-red-400 mt-1">{validationErrors.role}</p>}
                </div>
                <div>
                  <label htmlFor="sponsorship" className="block text-sm font-medium text-gray-300 mb-2">
                    Will you now or in the future require sponsorship for employment (e.g., H1B visa)?
                  </label>
                  <select
                    id="sponsorship"
                    value={formData.basics.sponsorship}
                    onChange={(e) => handleInputChange('basics', 'sponsorship', e.target.value)}
                    className={`w-full py-2 bg-[#0A0A0A] border rounded text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                      validationErrors.sponsorship ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {validationErrors.sponsorship && <p className="text-sm text-red-400 mt-1">{validationErrors.sponsorship}</p>}
                </div>
                {[
                  { id: 'location', label: 'Current Location', icon: User, placeholder: 'e.g., New York' },
                  { id: 'school', label: 'School/major & grad year (if any)', icon: Mail, placeholder: 'e.g., MIT / EE / 2026' },
                  { id: 'availability', label: 'Weekly availability & preferred start date', icon: Calendar, placeholder: 'e.g., 20 hours/week, starting Sept 2025' },
                  { id: 'length', label: 'Internship length you have in mind', icon: Clock, placeholder: 'e.g., 3 months' },
                ].map(field => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Resume (PDF only)
                  </label>
                  <div className="relative">
                    <File className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="file"
                      id="resume"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className={`w-full pl-10 py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                        validationErrors.resume ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                  </div>
                  {validationErrors.resume && <p className="text-sm text-red-400 mt-1">{validationErrors.resume}</p>}
                  {formData.resumeFile && <p className="text-sm text-gray-400 mt-1">{formData.resumeFile.name}</p>}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                <p className="text-gray-300 text-center">Rank your experience with each from 1-5 (1 being never touched it in my life and 5 being expert)</p>
                {skillAreas.map(area => (
                  <div key={area.key} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2 col-span-1">
                      {area.label}
                    </label>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Rating (1-5)</label>
                      <select
                        value={formData.skills[area.key].rating}
                        onChange={(e) => handleSkillChange(area.key, 'rating', e.target.value)}
                        className={`w-full py-2 bg-[#0A0A0A] border rounded text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                          validationErrors[`${area.key}_rating`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                      >
                        <option value="">Select</option>
                        {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}</option>)}
                      </select>
                      {validationErrors[`${area.key}_rating`] && <p className="text-sm text-red-400 mt-1">{validationErrors[`${area.key}_rating`]}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Tools/Experiences</label>
                      <input
                        type="text"
                        value={formData.skills[area.key].tools}
                        onChange={(e) => handleSkillChange(area.key, 'tools', e.target.value)}
                        className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600"
                        placeholder={`e.g., ${area.examples}`}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                <h3 className="text-lg font-medium text-white">What Actually Excites You?</h3>
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

            {step === 5 && (
              <motion.div variants={staggerContainer} className="space-y-6">
                {['project1', 'project2', 'project3'].map((projectKey, index) => (
                  <div key={projectKey}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{`Project ${index + 1}${index === 2 ? ' (optional)' : ''} (Your role + hardest problem, 150 words max, links welcome)`}</label>
                    <input
                      type="text"
                      placeholder="e.g., Jan 2023 - May 2023"
                      value={formData.showAndTell[projectKey].date}
                      onChange={(e) => handleProjectChange(projectKey, 'date', e.target.value)}
                      className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600 mb-2"
                    />
                    <textarea
                      value={formData.showAndTell[projectKey].description}
                      onChange={(e) => handleProjectChange(projectKey, 'description', e.target.value)}
                      className={`w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                        validationErrors.projects && index < 2 ? 'border-red-500' : 'border-gray-600'
                      }`}
                      rows={4}
                    />
                    <p className="text-sm text-gray-400 mt-1">{countWords(formData.showAndTell[projectKey].description)} / 150 words</p>
                    <input
                      type="text"
                      placeholder="e.g., SolidWorks, 3D printer"
                      value={formData.showAndTell[projectKey].tools}
                      onChange={(e) => handleProjectChange(projectKey, 'tools', e.target.value)}
                      className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600 mt-2"
                    />
                  </div>
                ))}
                {validationErrors.projects && <p className="text-sm text-red-400 mt-1">{validationErrors.projects}</p>}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Any tools/space you already have (e.g., shop access, Adobe CC, HubSpot)</label>
                  <input
                    type="text"
                    value={formData.showAndTell.personalTools}
                    onChange={(e) => handleInputChange('showAndTell', 'personalTools', e.target.value)}
                    className="w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] border-gray-600"
                    placeholder="e.g., 3D printer, Figma"
                  />
                </div>
              </motion.div>
            )}

            {step === 6 && (
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

            {step === 7 && (
              <motion.div variants={staggerContainer} className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Why does Ampereon get you pumped and what do you hope to own or learn here? (150 words max)</label>
                <textarea
                  value={formData.why || ''}
                  onChange={(e) => handleInputChange('why', '', e.target.value)}
                  className={`w-full py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                    validationErrors.why ? 'border-red-500' : 'border-gray-600'
                  }`}
                  rows={6}
                />
                <p className="text-sm text-gray-400 mt-1">{countWords(formData.why)} / 150 words</p>
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
                {step === 7 ? 'Submit Application' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <motion.div variants={fadeUpVariants} className="text-center">
            <h2 className="text-2xl font-light mb-4">Application Submitted!</h2>
            <p className="text-gray-400">Thanks for applying. We'll be in touch soon.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}