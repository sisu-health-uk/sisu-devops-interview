import React, { useState } from 'react';

const SignIn: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/test');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
      console.log('API Response:', data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error making API call:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <p>This is the Sign In component.</p>
      <button onClick={handleTestApiCall} disabled={loading}>
        {loading ? 'Calling API...' : 'Test Backend API'}
      </button>
      {apiResponse && (
        <div>
          <h3>API Response:</h3>
          <pre>{apiResponse}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: 'red' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default SignIn;
