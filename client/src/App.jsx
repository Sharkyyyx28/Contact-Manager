import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import './App.css'; // Importing the standard CSS file

const API_URL = 'http://localhost:5000/api/contacts';

function App() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = contacts.filter(c => 
      c.name.toLowerCase().includes(lowerTerm) || 
      c.email.toLowerCase().includes(lowerTerm)
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(API_URL);
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      closeModal();
      fetchContacts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this contact?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchContacts();
    }
  };

  const openEditModal = (contact) => {
    setEditingId(contact._id);
    setFormData({ name: contact.name, email: contact.email, phone: contact.phone });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : '??';
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>Contacts <span className="highlight">Manager</span></h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus /> Add Contact
        </button>
      </header>

      {/* Search */}
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search contacts..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Card Grid */}
      <div className="grid">
        {filteredContacts.map(contact => (
          <div key={contact._id} className="card">
            <div className="card-header">
              <div className="avatar">{getInitials(contact.name)}</div>
              <div>
                <h3>{contact.name}</h3>
                <span className="badge">Contact</span>
              </div>
            </div>
            
            <div className="card-body">
              <p><FiMail /> {contact.email}</p>
              <p><FiPhone /> {contact.phone}</p>
            </div>

            <div className="card-footer">
              <button className="icon-btn edit" onClick={() => openEditModal(contact)}>
                <FiEdit2 />
              </button>
              <button className="icon-btn delete" onClick={() => handleDelete(contact._id)}>
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={closeModal}><FiX /></button>
            <h2>{editingId ? 'Edit Contact' : 'New Contact'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <div className="input-wrapper">
                  <FiPhone className="input-icon" />
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary full-width">
                {editingId ? 'Save Changes' : 'Create Contact'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;