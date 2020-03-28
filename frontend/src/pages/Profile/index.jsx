import React, {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from "react-icons/fi";

import api from "../../services/api";
import './styles.css'

import logoImg from '../../assets/logo.svg'

function Profile(props) {
  const [incidents, setIncidents] = useState([]);

  const history = useHistory();

  const ongId = localStorage.getItem('ongId');
  const ongName = localStorage.getItem('ongName');

  useEffect(() => {
    api.get('profile', {
      headers: {
        Authorization: ongId
      }
    }).then(res => setIncidents(res.data))
  }, [ongId]);

  async function handleDeleteIncident(id) {
    try {
      await api.delete(`incidents/${id}`,{
        headers: {
          Authorization: ongId
        }
      });

      setIncidents(incidents.filter(incident => incident.id !== id))

    } catch (e) {
      alert('Erro ao deletar o caso, tente novamente.')
    }
  }

  function handleLogout() {
    localStorage.clear();

    history.push('/')
  }

  return (
      <div className="profile-container">
        <header>
          <img src={logoImg} alt="Be The Hero"/>
          <span>Bem vinda, <strong>{ongName}</strong></span>

          <Link to="/incidents/new" className="button">
            Cadastrar novo caso
          </Link>
          <button onClick={handleLogout} type="button">
            <FiPower size={18} color="#e02041" />
          </button>
        </header>

        <h1>Casos cadastrados</h1>

        <ul>
          {
            incidents.map(incident => (
                <li key={incident.id}>
                  <strong>CASO:</strong>
                  <p>{incident.title}</p>

                  <strong>DESCRIÇÂO</strong>
                  <p>{incident.description}</p>

                  <strong>VALOR:</strong>
                  <p>
                    {
                      Intl.NumberFormat('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(incident.value)
                    }
                  </p>

                  <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                    <FiTrash2 size={20} color="#a8a8b3" />
                  </button>
                </li>
            ))
          }
        </ul>
      </div>
  );
}

export default Profile;