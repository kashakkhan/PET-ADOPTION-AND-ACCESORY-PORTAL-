import React, { useState } from 'react';

const SignupPage = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    livingSituation: '',
    hasAllergies: false,
    idFile: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    
    setFormData({
      ...formData,
      [name]: val
    });

    // Real-time validation
    if (name === 'phone') {
      if (val && !validatePhone(val)) {
        setErrors(prev => ({ ...prev, phone: 'Phone must be exactly 10 digits' }));
      } else {
        setErrors(prev => {
          const newErr = { ...prev };
          delete newErr.phone;
          return newErr;
        });
      }
    }

    if (name === 'password' || name === 'confirmPassword') {
      const relatedField = name === 'password' ? 'confirmPassword' : 'password';
      const isMatch = name === 'password' ? val === formData.confirmPassword : val === formData.password;
      
      if (val && formData[relatedField] && !isMatch) {
        setErrors(prev => ({ ...prev, passwordMatch: 'Passwords do not match' }));
      } else {
        setErrors(prev => {
          const newErr = { ...prev };
          delete newErr.passwordMatch;
          return newErr;
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.phone || errors.passwordMatch) {
      alert("Please fix the validation errors before submitting.");
      return;
    }
    // Save to local storage for demo login
    localStorage.setItem('pawsconnect_user', JSON.stringify({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName
    }));
    
    alert("Signup successful!");
    if (onSignup) {
      onSignup();
    }
  };

  return (
    <div className="bg-secondary min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      
      {/* Glassmorphic Container: white, 80% opacity, backdrop-blur */}
      <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 max-w-4xl w-full text-accent">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-extrabold tracking-tight">Become an Adopter</h2>
          <p className="mt-2 text-sm text-gray-500">Join PawsConnect to find your new best friend.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: First Name | Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-brand focus:border-brand outline-none transition" 
                placeholder="Jane" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-brand focus:border-brand outline-none transition" 
                placeholder="Doe" />
            </div>
          </div>

          {/* Row 2: Email | Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-brand focus:border-brand outline-none transition" 
                placeholder="jane@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                className={`w-full px-4 py-2 bg-transparent border rounded-lg outline-none transition ${errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-brand focus:border-brand'}`} 
                placeholder="1234567890" />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* Row 3: Full Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Address</label>
            <input type="text" name="address" required value={formData.address} onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-brand focus:border-brand outline-none transition" 
              placeholder="123 Rescue Lane, Apt 4, Pet City, NY 10001" />
          </div>

          {/* Row 4: Password | Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange}
                  className={`w-full px-4 py-2 bg-transparent border rounded-lg outline-none transition ${errors.passwordMatch ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-brand focus:border-brand'}`} 
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                  className={`w-full px-4 py-2 bg-transparent border rounded-lg outline-none transition ${errors.passwordMatch ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-brand focus:border-brand'}`} 
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                </button>
              </div>
              {errors.passwordMatch && <p className="mt-1 text-xs text-red-500">{errors.passwordMatch}</p>}
            </div>
          </div>

          <hr className="border-gray-200 my-8"/>

          {/* Row 5: The Visitor Section */}
          <div className="mb-4">
            <h3 className="text-lg font-heading font-bold mb-4">The Visitor Section</h3>
            
            <div className="space-y-6">
              {/* Identification Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Government ID Proof (Required for NGO visits)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
                    <div className="flex text-sm justify-center text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-brand hover:text-brand-dark focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="idFile" type="file" className="sr-only" onChange={handleChange} required />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    {formData.idFile && <p className="text-sm font-bold text-green-600 mt-2">File selected: {formData.idFile.name}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                 {/* Household Info */}
                <div>
                  <label className="block text-sm font-medium mb-1">Living Situation</label>
                  <select name="livingSituation" required value={formData.livingSituation} onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-brand focus:border-brand outline-none transition">
                    <option value="" disabled>Select an option</option>
                    <option value="apartment">Apartment</option>
                    <option value="house_yard">House with Yard</option>
                    <option value="no_outdoor">No Outdoor Space</option>
                  </select>
                </div>

                {/* Safety Toggle */}
                <div className="flex items-center justify-between md:justify-start md:space-x-8 pt-4 md:pt-0">
                  <span className="text-sm font-medium">Allergies to Animals?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="hasAllergies" className="sr-only peer" checked={formData.hasAllergies} onChange={handleChange} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                    <span className="ml-3 text-sm font-medium text-gray-600">{formData.hasAllergies ? 'Yes' : 'No'}</span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4">
            <button type="submit" 
              className="w-full bg-brand text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-[#E05A3A] hover:shadow-xl transition-all duration-200 outline-none focus:ring-4 focus:ring-brand/30">
              Complete Sign Up
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SignupPage;
