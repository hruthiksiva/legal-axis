import { useState, type FormEvent } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const specializationOptions = [
  'Criminal Law',
  'Family Law',
  'Corporate Law',
  'Civil Law',
  'Intellectual Property',
  'Employment Law',
  'Property Law',
  'Tax Law'
];

const educationOptions = [
  'LLB',
  'LLM',
  'BA LLB',
  'BBA LLB',
  'BCom LLB',
  'PhD in Law',
  'Diploma in Cyber Law',
  'Diploma in Taxation Law'
];

const AddLawyer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: [] as string[],
    experience: '',
    rating: '',
    phone: '',
    education: '',
    languages: '',
    barAssociation: '',
    bio: ''
  });

  const [showSpecDropdown, setShowSpecDropdown] = useState(false);
  const [showEduDropdown, setShowEduDropdown] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationSelect = (spec: string) => {
    if (!formData.specialization.includes(spec)) {
      setFormData((prev) => ({
        ...prev,
        specialization: [...prev.specialization, spec]
      }));
    }
    setShowSpecDropdown(false);
  };

  const handleRemoveSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((s) => s !== spec)
    }));
  };

  const handleEducationSelect = (edu: string) => {
    setFormData((prev) => ({
      ...prev,
      education: edu
    }));
    setShowEduDropdown(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const lawyer = {
        ...formData,
        experience: Number(formData.experience),
        rating: Number(formData.rating),
        userType: 'lawyer',
        languages: formData.languages.split(',').map((l) => l.trim())
      };
      await addDoc(collection(db, 'users'), lawyer);
      setSuccess('Lawyer added successfully!');
      setFormData({
        name: '',
        email: '',
        specialization: [],
        experience: '',
        rating: '',
        phone: '',
        education: '',
        languages: '',
        barAssociation: '',
        bio: ''
      });
      setError('');
    } catch (err) {
      setError('Failed to add lawyer.');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add New Lawyer</h2>
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Text Inputs */}
        {[
          ['Name', 'name'],
          ['Email', 'email'],
          ['Phone', 'phone'],
          ['Languages Spoken (comma-separated)', 'languages'],
          ['Experience (years)', 'experience'],
          ['Rating (1-5)', 'rating'],
          ['Bar Association', 'barAssociation'],
        ].map(([label, name]) => (
          <div key={name}>
            <input
              type="text"
              name={name}
              placeholder={label}
              value={(formData as any)[name]}
              onChange={handleChange}
              className="w-full border p-2 rounded text-sm"
              required
            />
          </div>
        ))}

        {/* Specialization Tag Selector */}
        <div>
          <label className="block text-sm mb-1 font-medium">Specializations</label>
          <div
            className="border p-2 rounded text-sm bg-white cursor-pointer"
            onClick={() => setShowSpecDropdown(!showSpecDropdown)}
          >
            {formData.specialization.length === 0 ? (
              <span className="text-gray-400">Select Specializations</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialization(spec)}
                      className="ml-1 text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {showSpecDropdown && (
            <div className="border mt-1 rounded shadow-md bg-white absolute z-10 w-60 max-h-40 overflow-auto">
              {specializationOptions.map((spec) => (
                <div
                  key={spec}
                  onClick={() => handleSpecializationSelect(spec)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {spec}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education Dropdown */}
        <div className="relative">
          <label className="block text-sm mb-1 font-medium">Education</label>
          <div
            onClick={() => setShowEduDropdown(!showEduDropdown)}
            className="w-full border p-2 rounded text-sm bg-white cursor-pointer"
          >
            {formData.education || 'Select Education'}
          </div>
          {showEduDropdown && (
            <div className="absolute border mt-1 rounded shadow-md bg-white z-10 w-full max-h-40 overflow-auto">
              {educationOptions.map((edu) => (
                <div
                  key={edu}
                  onClick={() => handleEducationSelect(edu)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {edu}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bio */}
        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full border p-2 rounded text-sm"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Add Lawyer
        </button>
      </form>
    </div>
  );
};

export default AddLawyer;



