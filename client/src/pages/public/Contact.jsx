import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceRequired: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${API_URL}/leads`, {
        ...formData,
        source: 'Website'
      });
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '', email: '', phone: '', company: '', serviceRequired: '', message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-card p-8 rounded-2xl border border-slate-700 shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
        <p className="text-slate-400 mb-8">Fill out the form below and our team will contact you shortly.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all" placeholder="john@example.com" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all" placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all" placeholder="Acme Inc." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Service Required *</label>
            <select required name="serviceRequired" value={formData.serviceRequired} onChange={handleChange} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all appearance-none">
              <option value="" disabled>Select a service</option>
              <option value="Consulting">Consulting</option>
              <option value="Implementation">Implementation</option>
              <option value="Support">Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
            <textarea required name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all" placeholder="How can we help you?"></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-electric-blue hover:bg-blue-600 text-white font-semibold py-4 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : (
              <>
                Send Message <Send size={20} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
