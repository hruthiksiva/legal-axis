import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

type FormEvent = React.FormEvent<HTMLFormElement>;

const specializationOptions = [
  'Criminal Law', 'Corporate Law', 'Family Law', 'Intellectual Property',
  'Labor Law', 'Property Law', 'Tax Law', 'Cyber Law'
];

const educationOptions = [
  'LLB', 'LLM', 'BA LLB', 'BBA LLB', 'PhD in Law', 'Diploma in Cyber Law'
];

const EditLawyer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    rating: '',
    languages: '',
    barAssociation: '',
    bio: ''
  });

  const [specialization, setSpecialization] = useState<string[]>([]);
  const [education, setEducation] = useState<string[]>([]);

  const [selectedSpec, setSelectedSpec] = useState('');
  const [selectedEdu, setSelectedEdu] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        if (!id) throw new Error('Invalid lawyer ID');

        const lawyerDoc = await getDoc(doc(db, 'users', id));
        if (!lawyerDoc.exists()) throw new Error('Lawyer not found');

        const data = lawyerDoc.data();

        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          experience: String(data.experience || ''),
          rating: String(data.rating || ''),
          languages: (data.languages || []).join(', '),
          barAssociation: data.barAssociation || '',
          bio: data.bio || ''
        });

        setSpecialization(data.specialization || []);
        setEducation(data.education || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const updatedData = {
        ...formData,
        experience: Number(formData.experience),
        rating: Number(formData.rating),
        specialization,
        education,
        languages: formData.languages.split(',').map((l) => l.trim()),
        userType: 'lawyer'
      };

      await updateDoc(doc(db, 'users', id), updatedData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to update lawyer profile.');
      console.error(err);
    }
  };

  const addItem = (type: 'spec' | 'edu') => {
    if (type === 'spec' && selectedSpec && !specialization.includes(selectedSpec)) {
      setSpecialization([...specialization, selectedSpec]);
      setSelectedSpec('');
    }
    if (type === 'edu' && selectedEdu && !education.includes(selectedEdu)) {
      setEducation([...education, selectedEdu]);
      setSelectedEdu('');
    }
  };

  const removeItem = (type: 'spec' | 'edu', item: string) => {
    if (type === 'spec') {
      setSpecialization(specialization.filter((i) => i !== item));
    } else {
      setEducation(education.filter((i) => i !== item));
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Edit Lawyer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[['Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Languages (comma-separated)', 'languages'], ['Experience (in years)', 'experience'], ['Rating (1–5)', 'rating'], ['Bar Association', 'barAssociation']].map(([label, name]) => (
          <input
            key={name}
            type="text"
            name={name}
            placeholder={label}
            value={(formData as any)[name]}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-sm"
            required
          />
        ))}

        <div>
          <label className="block mb-1 font-medium">Specialization</label>
          <div className="flex space-x-2">
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Select specialization</option>
              {specializationOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button type="button" onClick={() => addItem('spec')} className="bg-blue-500 text-white px-3 rounded">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {specialization.map((item) => (
              <span key={item} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {item}{' '}
                <button type="button" onClick={() => removeItem('spec', item)} className="ml-1 text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Education</label>
          <div className="flex space-x-2">
            <select
              value={selectedEdu}
              onChange={(e) => setSelectedEdu(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Select education</option>
              {educationOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button type="button" onClick={() => addItem('edu')} className="bg-blue-500 text-white px-3 rounded">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {education.map((item) => (
              <span key={item} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {item}{' '}
                <button type="button" onClick={() => removeItem('edu', item)} className="ml-1 text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full border p-2 rounded text-sm"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Update Lawyer
        </button>
      </form>
    </div>
  );
};

export default EditLawyer;


