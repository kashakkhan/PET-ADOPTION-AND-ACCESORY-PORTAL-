import React, { useState, useEffect } from 'react';
import NearbySearch from './NearbySearch';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import AdminPortal from './AdminPortal';
import AdminLoginPage from './AdminLoginPage';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [adminSession, setAdminSession] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [logoTapCount, setLogoTapCount] = useState(0);
  const fallbackPets = [
    { id: 1, name: 'Max', breed: 'Golden Retriever', age: 3, description: 'Friendly and active.', imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Fully Vaccinated', disease: 'None', ngoName: 'Paws and Claws' },
    { id: 2, name: 'Luna', breed: 'Persian Cat', age: 2, description: 'Loves to sleep.', imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Fully Vaccinated', disease: 'Minor Allergies', ngoName: 'Paws and Claws' },
    { id: 3, name: 'Charlie', breed: 'Beagle', age: 1, description: 'Full of energy!', imageUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Needs booster', disease: 'None', ngoName: 'Pet Centre' },
    { id: 4, name: 'Bella', breed: 'German Shepherd', age: 4, description: 'Protective.', imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Fully Vaccinated', disease: 'None', ngoName: 'Pet Centre' },
    { id: 5, name: 'Milo', breed: 'Labrador', age: 2, description: 'Gentle giant.', imageUrl: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Partially Vaccinated', disease: 'None', ngoName: 'Petify' },
    { id: 6, name: 'Rocky', breed: 'Siberian Husky', age: 2, description: 'Loves snow and running.', imageUrl: 'https://images.unsplash.com/photo-1605568420116-b118b6287b4e?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Fully Vaccinated', disease: 'None', ngoName: 'Petify' },
    { id: 7, name: 'Daisy', breed: 'Bulldog', age: 3, description: 'Lazy but loving.', imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Fully Vaccinated', disease: 'Mild Arthritis', ngoName: 'Paws and Claws' },
    { id: 8, name: 'Simba', breed: 'Poodle', age: 1, description: 'Very playful.', imageUrl: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Fully Vaccinated', disease: 'None', ngoName: 'Pet Centre' },
    { id: 9, name: 'Nala', breed: 'Maine Coon', age: 4, description: 'Majestic and calm.', imageUrl: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Fully Vaccinated', disease: 'None', ngoName: 'Paws and Claws' },
    { id: 10, name: 'Coco', breed: 'Parrot', age: 2, description: 'Smart and talkative.', imageUrl: 'https://images.unsplash.com/photo-1552728089-57105a88c3a1?w=600&h=400&fit=crop', status: 'AVAILABLE', vaccinationStatus: 'Fully Vaccinated', disease: 'None', ngoName: 'Petify' }
  ];
  const petApiUrls = ['http://localhost:8080/api/pets', 'http://localhost:8081/api/pets'];

  // Check for logged in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pawsconnect_user');
    const storedAdminSession = localStorage.getItem('pawsconnect_admin_session') === 'true';
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAdminSession) {
      setAdminSession(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleAdminLogin = ({ adminId, password }) => {
    const expectedAdminId = 'pawsconnectadmin@gmail.com';
    const expectedPassword = 'Paws@Admin#2026';

    if (adminId === expectedAdminId && password === expectedPassword) {
      setAdminSession(true);
      setAdminError('');
      localStorage.setItem('pawsconnect_admin_session', 'true');
      setCurrentPage('admin');
      return { success: true };
    }

    setAdminError('Invalid admin ID or password');
    return { success: false, message: 'Invalid admin ID or password' };
  };

  const handleAdminLogout = () => {
    setAdminSession(false);
    setAdminError('');
    localStorage.removeItem('pawsconnect_admin_session');
    setCurrentPage('home');
  };

  const openAdminLogin = () => {
    setAdminError('');
    setCurrentPage('admin-login');
  };

  const handleSignup = () => {
    const storedUser = localStorage.getItem('pawsconnect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setCurrentPage('dashboard');
  };

  // Fetch pets from Spring Boot backend
  useEffect(() => {
    const fetchPets = async () => {
      for (const url of petApiUrls) {
        try {
          const response = await fetch(url, { credentials: 'include' });
          if (!response.ok) {
            continue;
          }
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setPets(data);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching pets from', url, error);
        }
      }

      setPets(fallbackPets);
      setLoading(false);
    };

    fetchPets();
  }, []);

  const addPetFromAdmin = async (petPayload) => {
    for (const url of petApiUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(petPayload),
          credentials: 'include'
        });

        if (!response.ok) {
          continue;
        }

        const createdPet = await response.json();
        setPets((prev) => [...prev, createdPet]);
        return { success: true };
      } catch (error) {
        console.error('Error creating pet at', url, error);
      }
    }

    const fallbackPet = { ...petPayload, id: Date.now() };
    setPets((prev) => [...prev, fallbackPet]);
    return { success: true };
  };

  const updatePetStatusFromAdmin = async (petId, status) => {
    const statusUrls = petApiUrls.map((url) => `${url}/${petId}/status?status=${status}`);

    for (const url of statusUrls) {
      try {
        const response = await fetch(url, { method: 'PUT', credentials: 'include' });
        if (!response.ok) {
          continue;
        }

        const updatedPet = await response.json();
        setPets((prev) => prev.map((pet) => (pet.id === petId ? updatedPet : pet)));
        return;
      } catch (error) {
        console.error('Error updating status at', url, error);
      }
    }

    setPets((prev) => prev.map((pet) => (pet.id === petId ? { ...pet, status } : pet)));
  };

  const openSchedulingModal = (pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const submitSchedule = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSelectedPet(null);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setCurrentPage('home');
    setLogoTapCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        openAdminLogin();
        return 0;
      }
      return next;
    });
  };

  return (
    <div className="bg-secondary min-h-screen text-accent font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <a href="#" onClick={handleLogoClick} className="flex items-center gap-2">
                <i className="fa-solid fa-paw text-brand text-3xl"></i>
                <span className="font-heading font-extrabold text-2xl text-accent">
                  Paws<span className="text-brand">Connect</span>
                </span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#pets" onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-brand font-medium transition">Find a Pet</a>
              <a href="#ngos" onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-brand font-medium transition">NGOs</a>
              <a href="#about" onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-brand font-medium transition">About Us</a>

              {user ? (
                <>
                  <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className="text-gray-600 hover:text-brand font-medium transition">
                    Dashboard
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full font-medium hover:bg-gray-200 transition">
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setCurrentPage('login')}
                    className="text-gray-600 hover:text-brand font-medium transition">
                    Log In
                  </button>
                  <button 
                    onClick={() => setCurrentPage('signup')}
                    className="bg-brand text-white px-5 py-2 rounded-full font-medium hover:bg-brand-dark transition shadow-lg shadow-brand/30">
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-brand focus:outline-none"
              >
                <i className="fa-solid fa-bars text-2xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#pets" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md">Find a Pet</a>
              <a href="#ngos" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md">NGOs</a>
            </div>
          </div>
        )}
      </nav>

      {currentPage === 'home' ? (
        <>
      {/* Hero Section */}
      <section className="relative bg-brand-light/30 overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto pt-10 pb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-brand/10 text-brand-dark text-sm font-semibold tracking-wider mb-4 border border-brand/20">
                #1 ADOPTION PLATFORM
            </span>
            <h1 className="text-4xl tracking-tight font-heading font-extrabold text-accent sm:text-5xl md:text-6xl mb-6">
              <span className="block">Find your new</span>
              <span className="block text-brand">best friend today.</span>
            </h1>
            <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
              Connect with local NGOs and adopt a pet that needs a loving home. Schedule visits and manage your adoption digitally through PawsConnect.
            </p>
          </div>
        </div>
      </section>

      {/* Pets Grid */}
      <section id="pets" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-extrabold text-accent font-heading">Available Pets</h2>
                    <p className="mt-2 text-gray-600">Waiting for a loving home.</p>
                </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-80 animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-5">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {pets.map(pet => (
                    <div 
                      key={pet.id} 
                      onClick={() => openSchedulingModal(pet)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col group cursor-pointer"
                    >
                        <div className="relative h-56 overflow-hidden bg-gray-100">
                            {pet.imageUrl ? (
                              <img 
                                src={pet.imageUrl} 
                                alt={`${pet.name} - ${pet.breed}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                              />
                            ) : null}
                            <div className={`${pet.imageUrl ? 'hidden' : 'flex'} items-center justify-center h-full bg-brand-light`}>
                              <i className="fa-solid fa-paw text-6xl text-brand opacity-30"></i>
                            </div>
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full shadow text-xs font-bold ${pet.status === 'AVAILABLE' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                                {pet.status.replace('_', ' ')}
                            </div>
                        </div>
                        <div className="p-5 flex-grow flex flex-col justify-between">
                            <div>
                              <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{pet.breed}</div>
                              <h3 className="font-heading font-bold text-accent text-xl mb-2">{pet.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{pet.description} Age: {pet.age} years.</p>
                              <p className="text-xs text-gray-500 mb-4">NGO: {pet.ngoName || 'Unknown NGO'}</p>
                            </div>
                            <button 
                              onClick={() => openSchedulingModal(pet)}
                              className="w-full bg-brand/10 text-brand py-2 rounded-lg font-medium hover:bg-brand hover:text-white transition"
                            >
                                Schedule Visit
                            </button>
                        </div>
                    </div>
                  ))}
              </div>
            )}
        </div>
      </section>

      {/* NGOs / Map View */}
      <NearbySearch />

      <section id="about" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-accent font-heading">About Us</h2>
            <p className="mt-4 text-gray-600 text-lg">
              PawsConnect helps loving families connect with nearby NGOs to adopt rescued animals safely and transparently.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-accent">Our Mission</h3>
              <p className="mt-2 text-gray-600">Make responsible pet adoption simple, trusted, and accessible for everyone.</p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-accent">How We Help</h3>
              <p className="mt-2 text-gray-600">We bring adopters and shelters together with pet listings, visit scheduling, and clear status tracking.</p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-accent">Community First</h3>
              <p className="mt-2 text-gray-600">Every adoption supports local rescue efforts and gives animals the second chance they deserve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Detail & Scheduling Modal */}
      {isModalOpen && selectedPet && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white">
                <div className="relative h-64 sm:h-80 w-full bg-gray-200">
                    {selectedPet.imageUrl ? (
                      <img src={selectedPet.imageUrl} alt={selectedPet.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-brand-light">
                        <i className="fa-solid fa-paw text-6xl text-brand opacity-30"></i>
                      </div>
                    )}
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 transition">
                      <i className="fa-solid fa-times w-5 h-5 flex items-center justify-center"></i>
                    </button>
                    <div className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-full shadow text-sm font-bold ${selectedPet.status === 'AVAILABLE' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {selectedPet.status.replace('_', ' ')}
                    </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <h3 className="text-3xl font-heading font-extrabold text-gray-900" id="modal-title">{selectedPet.name}</h3>
                          <p className="text-lg text-brand font-medium">{selectedPet.breed}</p>
                      </div>
                      <div className="text-right">
                          <span className="block text-xl font-bold text-gray-800">{selectedPet.age} years old</span>
                      </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Health Information</h4>
                          <p className="text-sm text-gray-800 mb-1"><span className="font-semibold">Vaccination Status:</span> {selectedPet.vaccinationStatus || 'Unknown'}</p>
                          <p className="text-sm text-gray-800"><span className="font-semibold">Known Diseases:</span> {selectedPet.disease || 'None'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Shelter</h4>
                          <p className="text-sm text-gray-800"><span className="font-semibold">NGO:</span> {selectedPet.ngoName || 'Unknown NGO'}</p>
                      </div>
                  </div>

                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Schedule a Visit</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      The NGO will review your request and confirm the time to meet {selectedPet.name}.
                    </p>
                    
                    <form id="scheduleForm" onSubmit={submitSchedule}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                            <input type="date" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"/>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Message to NGO</label>
                            <textarea rows="1" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" placeholder="Tell us about your home..."></textarea>
                          </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button type="submit" form="scheduleForm" className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2 bg-brand text-base font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand sm:ml-3 sm:w-auto sm:text-sm">
                  Request Visit
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && selectedPet && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="success-modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeSuccessModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full border border-gray-100 relative">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 shadow-sm">
                  <i className="fa-solid fa-check text-2xl text-green-600"></i>
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-gray-900 mb-2" id="success-modal-title">Thank You!</h3>
                <p className="text-base text-gray-600">
                  Your visit request for <strong>{selectedPet.name}</strong> has been received. 
                  The NGO will shortly contact you through mail or WhatsApp to confirm the details.
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button type="button" onClick={closeSuccessModal} className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2 bg-brand text-base font-medium text-white hover:bg-brand-dark focus:outline-none sm:w-auto sm:text-sm">
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      ) : currentPage === 'signup' ? (
        <SignupPage onSignup={handleSignup} />
      ) : currentPage === 'login' ? (
        <LoginPage onLogin={handleLogin} />
      ) : currentPage === 'dashboard' && user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : currentPage === 'admin-login' ? (
        <AdminLoginPage
          onAdminLogin={handleAdminLogin}
          onBack={() => setCurrentPage('home')}
          errorMessage={adminError}
        />
      ) : currentPage === 'admin' && adminSession ? (
        <AdminPortal
          pets={pets}
          onAddPet={addPetFromAdmin}
          onUpdatePetStatus={updatePetStatusFromAdmin}
          onBack={() => setCurrentPage('home')}
          onAdminLogout={handleAdminLogout}
        />
      ) : (
        <div className="flex-grow flex items-center justify-center py-20 text-2xl font-bold text-gray-500">
           Coming Soon
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 mt-20">
        <p>&copy; 2026 PawsConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
