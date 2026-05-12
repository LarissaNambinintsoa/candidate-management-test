import React, { useState } from 'react';
import CandidateList from './components/CandidateList';
import CandidateForm from './components/CandidateForm';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleSuccess = () => {
    setShowForm(false);
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="App">
      <h1>📋 Gestion des Candidats</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '📋 Voir la liste' : '➕ Ajouter un candidat'}
        </button>
      </div>

      {showForm ? (
        <div className="form-container">
          <CandidateForm onSuccess={handleSuccess} />
        </div>
      ) : (
        <CandidateList key={refresh} />
      )}
    </div>
  );
}

export default App;