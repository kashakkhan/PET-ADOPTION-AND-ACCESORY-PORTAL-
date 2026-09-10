import React, { useMemo, useState } from 'react';

const AdminPortal = ({ pets, onAddPet, onUpdatePetStatus, onBack, onAdminLogout }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    imageUrl: '',
    vaccinationStatus: '',
    disease: '',
    status: 'AVAILABLE'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const availableCount = useMemo(() => pets.filter((pet) => pet.status === 'AVAILABLE').length, [pets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      age: Number(formData.age)
    };

    const result = await onAddPet(payload);

    if (!result.success) {
      setError(result.message);
    } else {
      setFormData({
        name: '',
        breed: '',
        age: '',
        description: '',
        imageUrl: '',
        vaccinationStatus: '',
        disease: '',
        status: 'AVAILABLE'
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-secondary min-h-screen text-accent font-sans pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-heading font-extrabold">Admin Portal</h1>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full font-medium hover:bg-gray-200 transition">Back to Home</button>
            <button onClick={onAdminLogout} className="bg-red-100 text-red-700 px-5 py-2 rounded-full font-medium hover:bg-red-200 transition">Admin Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="text-sm text-gray-500">Total Animals</div>
            <div className="text-3xl font-bold mt-1">{pets.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="text-sm text-gray-500">Available</div>
            <div className="text-3xl font-bold mt-1 text-green-600">{availableCount}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="text-sm text-gray-500">Not Available</div>
            <div className="text-3xl font-bold mt-1 text-amber-600">{pets.length - availableCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Animal</h2>
          {error ? <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">{error}</div> : null}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={formData.name} onChange={handleChange} required placeholder="Name" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="breed" value={formData.breed} onChange={handleChange} required placeholder="Breed" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="age" type="number" min="0" value={formData.age} onChange={handleChange} required placeholder="Age" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <select name="status" value={formData.status} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="AVAILABLE">Available</option>
              <option value="ADOPTED">Not Available</option>
            </select>
            <input name="vaccinationStatus" value={formData.vaccinationStatus} onChange={handleChange} placeholder="Vaccination Status" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="disease" value={formData.disease} onChange={handleChange} placeholder="Disease" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2" />
            <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Description" className="px-4 py-2 border border-gray-300 rounded-lg md:col-span-2" rows="3" />
            <button disabled={isSubmitting} type="submit" className="bg-brand text-white py-2 px-5 rounded-lg font-medium hover:bg-brand-dark transition disabled:opacity-60 md:col-span-2">
              {isSubmitting ? 'Adding...' : 'Add Animal'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-4">Manage Animal Availability</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm">
                  <th className="py-2 pr-2">Name</th>
                  <th className="py-2 pr-2">Breed</th>
                  <th className="py-2 pr-2">Age</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => {
                  const isAvailable = pet.status === 'AVAILABLE';
                  return (
                    <tr key={pet.id} className="border-b border-gray-100">
                      <td className="py-3 pr-2 font-medium">{pet.name}</td>
                      <td className="py-3 pr-2">{pet.breed}</td>
                      <td className="py-3 pr-2">{pet.age}</td>
                      <td className="py-3 pr-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {isAvailable ? 'Available' : 'Not Available'}
                        </span>
                      </td>
                      <td className="py-3">
                        <button onClick={() => onUpdatePetStatus(pet.id, isAvailable ? 'ADOPTED' : 'AVAILABLE')} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition">
                          Mark {isAvailable ? 'Not Available' : 'Available'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
