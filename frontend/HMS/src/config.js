const getBackendUrl = () => {
  // Try to get port from environment or localStorage
  const backendPort = localStorage.getItem('backendPort') || '5000';
  return `http://localhost:${backendPort}`;
};

export const config = {
  apiUrl: getBackendUrl(),
  setBackendPort: (port) => {
    localStorage.setItem('backendPort', port);
  }
};

export default config;
