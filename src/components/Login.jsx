
// Import the signInWithPopup function from the Firebase auth module
import { signInWithPopup } from 'firebase/auth';
// Import the auth instance and googleProvider from the local firebase service
import { auth, googleProvider } from '../services/firebase';

// Define the Login component
const Login = () => {

// Define the asynchronous function to handle Google login
  const handleGoogleLogin = async () => {
// Try to authenticate the user
    try {
// Call signInWithPopup with the auth instance and Google provider
      await signInWithPopup(auth, googleProvider);
// Catch any errors that occur during login
    } catch (error) {
// Log the error to the console for debugging
      console.error('Error signing in with Google:', error);
// Alert the user that login failed
      alert('Failed to sign in with Google. Please try again.');
// Close the try-catch block
    }
// Close the handleGoogleLogin function
  };

// Return the JSX for the Login component
  return (
// Wrap the login view in a flex container centered on the screen
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
// Render a styled card to contain the login elements
      <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '450px', width: '100%' }}>
// Display the application title with a gradient text style
        <h1 style={{ marginBottom: '1rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Idea Shelf</h1>
// Provide a subtitle instructing the user to sign in
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '18px' }}>Sign in to capture and structure your thoughts.</p>
// Render the login button
        <button 
// Add classes to the button
          className="btn btn-primary" 
// Handle the click event by calling the handleGoogleLogin function
          onClick={handleGoogleLogin}
// Set the button to span the full width of the card
          style={{ width: '100%' }}
        >
// Set the button label text
          Sign in with Google
// Close the button tag
        </button>
// Close the card division
      </div>
// Close the outer container division
    </div>
  );
// Close the Login component definition
};

// Export the Login component as the default export
export default Login;
