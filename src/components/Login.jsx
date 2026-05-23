
// Define the Login component that accepts an onLogin prop
const Login = ({ onLogin }) => {

// Return the JSX for the Login component
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '450px', width: '100%' }}>
        <h1 style={{ marginBottom: '1rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Idea Shelf</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '18px' }}>Sign in to capture and structure your thoughts.</p>
        <button 
// Add classes to the button
          className="btn btn-primary" 
// Handle the click event by calling the onLogin function with a mock user
          onClick={() => onLogin({ name: 'Test User', email: 'test@example.com' })}
// Add full width
          style={{ width: '100%' }}
        >
          Mock Google Sign-In
        </button>
      </div>
    </div>
  );
// Close the Login component definition
};

// Export the Login component as the default export
export default Login;
