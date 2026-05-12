import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Montée à 100 utilisateurs
    { duration: '1m', target: 500 },     // Montée à 500 utilisateurs
    { duration: '1m', target: 500 },     // Maintien à 500
    { duration: '30s', target: 0 },      // Descente
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],    // 95% des requêtes < 500ms
    http_req_failed: ['rate<0.01'],      // Taux d'erreur < 1%
  },
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
  const payload = JSON.stringify({
    firstName: `Test${__VU}`,
    lastName: `User${__ITER}`,
    email: `test${__VU}${__ITER}@example.com`,
    phone: '0612345678',
    position: 'Testeur',
    experience: 3,
    skills: ['k6', 'Testing'],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/candidates`, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(1);
}