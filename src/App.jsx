// Import the useState and useEffect hooks from react
import { useState, useEffect } from 'react'
// Import the Firebase authentication methods
import { onAuthStateChanged, signOut } from 'firebase/auth'
// Import the local Firebase auth instance
import { auth } from './services/firebase'
// Import the Login component
import Login from './components/Login'
// Import the IdeaList component
import IdeaList from './components/IdeaList'
// Import the IdeaForm component
import IdeaForm from './components/IdeaForm'
// Import the main CSS file
import './index.css'

// Define the App component
function App() {
// Initialize the user state to null
  const [user, setUser] = useState(null)
// Initialize the auth loading state to true
  const [authLoading, setAuthLoading] = useState(true)
// Initialize the editingIdea state to null
  const [editingIdea, setEditingIdea] = useState(null)
// Initialize the showForm state to false
  const [showForm, setShowForm] = useState(false)
// Initialize a key for forcing IdeaList to remount to refresh data
  const [refreshKey, setRefreshKey] = useState(0)
// Initialize the search query state
  const [searchQuery, setSearchQuery] = useState('')
// Initialize the archive filter state
  const [showArchived, setShowArchived] = useState(false)
// Initialize the dark mode state from local storage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
// Return the parsed value from local storage or false
    return localStorage.getItem('idea_shelf_dark_mode') === 'true'
// Close the initialization function
  })

// Use effect to apply dark mode class to html element
  useEffect(() => {
// Check if dark mode is enabled
    if (isDarkMode) {
// Add the dark class to the document element
      document.documentElement.classList.add('dark')
// Else execute the block for light mode
    } else {
// Remove the dark class from the document element
      document.documentElement.classList.remove('dark')
// Close the if-else statement
    }
// Save the preference to local storage
    localStorage.setItem('idea_shelf_dark_mode', isDarkMode)
// Add isDarkMode to the dependency array
  }, [isDarkMode])

// Use effect to listen for Firebase authentication state changes
  useEffect(() => {
// Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
// Set the user state to the current Firebase user
      setUser(currentUser)
// Set authentication loading to false once the initial check is complete
      setAuthLoading(false)
// Close the subscription callback
    })
// Cleanup the subscription when the component unmounts
    return () => unsubscribe()
// Provide an empty dependency array to run only on mount
  }, [])

// Define an asynchronous function to handle logout
  const handleLogout = async () => {
// Try to sign out
    try {
// Call Firebase signOut
      await signOut(auth)
// Catch any errors
    } catch (error) {
// Log logout errors
      console.error('Error signing out:', error)
// Close the try-catch block
    }
// Close the handleLogout function
  }

// Define a function to start editing an idea
  const handleEdit = (idea) => {
// Set the idea to be edited
    setEditingIdea(idea)
// Show the form
    setShowForm(true)
// Close the handleEdit function
  }

// Define a function to handle successful form submission
  const handleFormSuccess = () => {
// Hide the form
    setShowForm(false)
// Clear the editing idea
    setEditingIdea(null)
// Increment the refresh key to force IdeaList to refetch data
    setRefreshKey(prev => prev + 1)
// Close the handleFormSuccess function
  }

// Define a function to handle form cancellation
  const handleFormCancel = () => {
// Hide the form
    setShowForm(false)
// Clear the editing idea
    setEditingIdea(null)
// Close the handleFormCancel function
  }

// Check if authentication is still loading
  if (authLoading) {
// Return a loading spinner or message while checking auth state
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
// Close the loading check
  }

// Return the JSX for the App component
  return (
    <>
      {!user ? (
        <Login />
      ) : (
        // Main container wrapper for authenticated layout
        <div className="container">
          {/* Render header element conditionally if showForm is false */}
          {!showForm && (
            <header className="header">
              {/* Header bar container using the responsive class */}
              <div className="header-bar">
                {/* Welcome text with styling classes */}
                <span className="header-welcome">Welcome, {user.displayName || user.email || 'User'}</span>
                {/* Header actions container */}
                <div className="header-actions">
                  {/* Theme toggle button element */}
                  <button className="btn-header" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle dark mode">
                    {/* Display text dynamically based on theme */}
                    {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                  {/* Close theme toggle button */}
                  </button>
                  {/* Logout button styled with header class */}
                  <button className="btn-header" onClick={handleLogout}>Logout</button>
                {/* Close header actions division */}
                </div>
              {/* Close header bar division */}
              </div>
              {/* Use React fragment to group header text elements */}
              <>
                {/* App title heading */}
                <h1>Idea Shelf</h1>
                {/* App description subtitle */}
                <p>Capture and structure your ideas.</p>
              {/* Close React fragment */}
              </>
            {/* Close header element */}
            </header>
          )}

          {/* Add conditional styling to center the main content vertically when form is open */}
          <main style={showForm ? { display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 40px)', justifyContent: 'center' } : {}}>
            {showForm ? (
              <IdeaForm 
// Pass the idea to edit
                ideaToEdit={editingIdea} 
// Pass the success handler
                onSuccess={handleFormSuccess} 
// Pass the cancel handler
                onCancel={handleFormCancel} 
              />
            ) : (
              <>
                {/* Responsive container for search and action buttons */}
                <div className="search-actions-container">
                  <input 
                    // Set input type to text for search
                    type="text" 
                    // Add input and search responsive classes
                    className="input search-input" 
                    // Set placeholder text
                    placeholder="Search ideas or tags..." 
                    // Bind value to searchQuery state
                    value={searchQuery}
                    // Update state on change
                    onChange={(e) => setSearchQuery(e.target.value)}
                    // Style the search bar
                    style={{ paddingLeft: '1.5rem', borderRadius: '999px' }}
                  />
                  {/* Group for action buttons layout */}
                  <div className="actions-group">
                    <button 
                      // Toggle the archive filter
                      className={`btn ${showArchived ? 'btn-primary' : 'btn-ghost'}`} 
                      // Add click handler
                      onClick={() => setShowArchived(!showArchived)}
                      // Style to maintain circular/pill shape
                      style={{ borderRadius: '999px' }}
                    >
                      {/* Show label dynamically */}
                      {showArchived ? '📂 Archived' : '📁 Active'}
                    </button>
                    <button 
                      // Add primary button styling
                      className="btn btn-primary" 
                      // Click handler to open form
                      onClick={() => setShowForm(true)}
                    >
                      <span 
                        // Emoji spacing margin
                        style={{ marginRight: '8px' }}
                      >
                        ✨
                      </span> 
                      Add New Idea
                    </button>
                  {/* Close actions-group */}
                  </div>
                {/* Close search-actions-container */}
                </div>
                 <IdeaList 
// Pass the refresh key to force remount on updates
                  key={refreshKey} 
// Pass the edit handler
                  onEdit={handleEdit} 
// Pass the search query for filtering
                  searchQuery={searchQuery}
// Pass the archive filter
                  showArchived={showArchived}
                  // Pass a callback function to handle tag click filtering
                  onTagClick={setSearchQuery}
// Pass a refresh trigger to allow IdeaList to refresh data without remounting completely if needed
                  onRefresh={() => setRefreshKey(prev => prev + 1)}
                />
              </>
            )}
          </main>
        </div>
      )}
    </>
  )
// Close the App component definition
}

// Export the App component as default
export default App
