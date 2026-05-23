// Import useState hook from react
import { useState } from 'react';
// Import ReactQuill from the new package
import ReactQuill from 'react-quill-new';
// Import ReactQuill styles from the new package
import 'react-quill-new/dist/quill.snow.css';
// Import the database functions from the services folder
import { createIdea, updateIdea } from '../services/database';
// Import the explainIdea function from the AI services
import { explainIdea } from '../services/ai';

// Define the predefined colors array
const PREDEFINED_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b',
  '#06b6d4', '#14b8a6', '#84cc16', '#eab308', '#f97316', '#a855f7', '#db2777'
];

// Define the IdeaForm component that accepts idea to edit, success callback, and cancel callback
const IdeaForm = ({ ideaToEdit, onSuccess, onCancel }) => {
// Initialize the title state with the idea's title or an empty string
  const [title, setTitle] = useState(ideaToEdit ? ideaToEdit.title : '');
// Initialize the description state with the idea's description or an empty string
  const [description, setDescription] = useState(ideaToEdit ? ideaToEdit.description : '');
// Initialize the color state
  const [color, setColor] = useState(ideaToEdit?.color || PREDEFINED_COLORS[0]);
// Initialize the emoji state
  const [emoji, setEmoji] = useState(ideaToEdit?.emoji || '💡');
// Initialize the tags state (join array to comma-separated string)
  const [tags, setTags] = useState(ideaToEdit && ideaToEdit.tags ? ideaToEdit.tags.join(', ') : '');
// Initialize the loading state as false
  const [loading, setLoading] = useState(false);
// Track focus state for quill wrapper styling
  const [quillFocused, setQuillFocused] = useState(false);
// Initialize the error validation message state to empty string
  const [error, setError] = useState('');
  // Initialize the AI loading state to false
  const [aiLoading, setAiLoading] = useState(false);

// Create a function to handle form submission
  const handleSubmit = async (e) => {
// Prevent the default form submission behavior
    e.preventDefault();
// Return early if title is empty
    if (!title || !title.trim()) {
// Set the error message for missing title
      setError('Please enter an idea title.');
// Exit the submission function early
      return;
// Close the title check block
    }
// Return early if description is empty or default empty HTML paragraph
    if (!description || description === '<p><br></p>' || !description.replace(/<[^>]+>/g, '').trim()) {
// Set the error message for missing description
      setError('Please enter a description for your idea.');
// Exit the submission function early
      return;
// Close the description check block
    }
// Clear any active error message since validation passed
    setError('');
// Set the loading state to true
    setLoading(true);
    
// Convert comma-separated tags string to an array, trim whitespace, and filter empty strings
    const rawTagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
// Create a new set using lowercase tag values to find unique tags
    const uniqueTagsSet = new Set();
// Create a list of unique tags while maintaining original casing if preferred
    const tagsArray = [];
// Loop through raw tag inputs to deduplicate case-insensitively
    rawTagsArray.forEach(tag => {
// Get lowercase representation
      const lower = tag.toLowerCase();
// Check if set already has lowercase version
      if (!uniqueTagsSet.has(lower)) {
// Add lowercase version to set
        uniqueTagsSet.add(lower);
// Push original tag to result array
        tagsArray.push(tag);
// Close if statement
      }
// Close forEach loop
    });

// Try to save the idea
    try {
// Check if an idea is being edited
      if (ideaToEdit) {
// Update the existing idea
        await updateIdea(ideaToEdit.id, { title, description, color, emoji, tags: tagsArray });
// Else execute the block for creating a new idea
      } else {
// Create a new idea
        await createIdea({ title, description, color, emoji, tags: tagsArray });
// Close the if-else statement
      }
// Call the onSuccess callback to close the form and refresh data
      onSuccess();
// Catch any errors
    } catch (error) {
// Log the error to the console
      console.error(error);
// Execute the finally block
    } finally {
// Set the loading state to false
      setLoading(false);
// Close the try-catch-finally block
    }
// Close the handleSubmit function definition
  };

  // Define a function to explain the idea using AI
  const handleAIExplain = async () => {
    // Return early if the title is empty or only whitespace
    if (!title || !title.trim()) {
      // Set the validation error message for missing title
      setError('Please enter an idea title first so the AI can explain it.');
      // Exit the function early
      return;
      // Close the validation check
    }
    // Clear any existing validation errors
    setError('');
    // Set AI loading state to true
    setAiLoading(true);
    // Begin API call execution block
    try {
      // Invoke the AI explain service passing title, tags, and description
      const explanation = await explainIdea(title, tags, description);
      // Update the description field with the returned AI explanation
      setDescription(explanation);
      // Catch any execution errors
    } catch (err) {
      // Set the error state with the message from the caught error
      setError(err.message || 'Failed to generate explanation. Please try again.');
      // Close try-catch block and enter finally block
    } finally {
      // Reset AI loading state to false
      setAiLoading(false);
      // Close finally block
    }
    // Close the handleAIExplain function
  };

// Define Quill modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ]
  };

// Return the JSX for the IdeaForm component
  return (
    // Form element using the new compact form class
    <form onSubmit={handleSubmit} className="card animate-fade-in idea-form-compact">
      {/* Compact heading for form title displaying edit/create state dynamically */}
      <h2 className="form-title">{ideaToEdit ? 'Edit Idea' : 'Create New Idea'}</h2>
      {/* Check if error state has message */}
      {error && (
        // Render error banner container
        <div 
          // Set key for React mapping
          key="error-banner"
          // Style error banner container inline
          style={{ 
            // Text color matches danger theme
            color: 'var(--danger-color)', 
            // Background is semi-transparent red
            backgroundColor: 'rgba(186, 26, 26, 0.1)', 
            // Spacing inside the banner
            padding: '0.75rem 1rem', 
            // Rounded corners for banner shape
            borderRadius: '12px', 
            // Margin bottom to space it from the form fields
            marginBottom: '1.5rem', 
            // Medium weight text
            fontWeight: 500, 
            // Smaller readable font size
            fontSize: '0.875rem', 
            // Thin red border accent
            border: '1px solid rgba(186, 26, 26, 0.2)', 
            // Align text left
            textAlign: 'left' 
          }}
        >
          {/* Display validation error text */}
          {error}
        {/* Close error banner division */}
        </div>
      )}
      {/* Responsive form layout grid container */}
      <div className="form-grid">
        {/* Left column containing primary input fields */}
        <div className="form-column-left">
          {/* Group for title and emoji input fields */}
          <div className="form-group">
            {/* Input label for title field */}
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Title</label>
            {/* Flex row containing title input and emoji input */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Title text input field */}
              <input type="text" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Idea title..." required />
              {/* Emoji input field with custom styles and max length */}
              <input type="text" className="input" style={{ width: '80px', textAlign: 'center', fontSize: '1.5rem', padding: '0.5rem' }} maxLength="2" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
            {/* Close flex row */}
            </div>
          {/* Close title and emoji form group */}
          </div>
          {/* Form group for tag inputs */}
          <div className="form-group">
            {/* Label for tags input */}
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tags (comma separated)</label>
            {/* Tags text input field */}
            <input type="text" className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. personal, work, app idea" />
          {/* Close tags form group */}
          </div>
          {/* Form group for color selector */}
          <div className="form-group-color">
            {/* Label for color selection */}
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Color</label>
            {/* Flex container for predefined colors list */}
            <div className="color-picker-container">
              {/* Loop through predefined colors list and render selection buttons */}
              {PREDEFINED_COLORS.map(c => (
                /* Predefined color choice button with color-specific styling and accessibility label */
                <button key={c} type="button" onClick={() => setColor(c)} className="color-btn" aria-label={`Select color ${c}`} style={{ backgroundColor: c, border: color === c ? '3px solid white' : '2px solid transparent', boxShadow: color === c ? `0 0 0 2px ${c}` : 'none', cursor: 'pointer', transform: color === c ? 'scale(1.1)' : 'scale(1)' }} />
              /* Close map iteration loop and return values */
              ))}
            {/* Close color picker flex container */}
            </div>
          {/* Close color form group */}
          </div>
        {/* Close left column division */}
        </div>
        {/* Right column containing rich description text editor */}
        <div className="form-column-right">
          {/* Form group wrapper to stretch content vertically */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Flex container for label and AI explanation button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* Label for description input */}
              <label style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Description</label>
              {/* Button to explain idea using AI */}
              <button
                // Set the HTML button type to button to prevent form submission
                type="button"
                // Apply class names dynamically including loading state
                className={`btn-ai-explain ${aiLoading ? 'loading' : ''}`}
                // Bind click event to handleAIExplain handler function
                onClick={handleAIExplain}
                // Disable button when AI or form is loading
                disabled={aiLoading}
              // Close button properties
              >
                {/* Check if AI explanation is loading */}
                {aiLoading ? (
                  // React Fragment containing loading content
                  <>
                    {/* Shimmering spark emoji indicator */}
                    <span className="spark-spinner">✨</span>
                    {/* Spacing label for progress */}
                    <span>Explaining...</span>
                  {/* Close React Fragment */}
                  </>
                ) : (
                  // React Fragment containing default content
                  <>
                    {/* Spark emoji indicating intelligence feature */}
                    <span className="spark-emoji">✨</span>
                    {/* Button text label */}
                    <span>Explain with AI</span>
                  {/* Close React Fragment */}
                  </>
                )}
              {/* Close button */}
              </button>
            {/* Close flex container division */}
            </div>
            {/* Wrapper container for tracking focus states */}
            <div className={quillFocused ? 'quill-focus' : ''} onFocus={() => setQuillFocused(true)} onBlur={() => setQuillFocused(false)}>
              {/* ReactQuill text editor component with modules and placeholder */}
              <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} placeholder="Describe your idea..." />
            {/* Close focus wrapper division */}
            </div>
          {/* Close vertical stretch form group division */}
          </div>
        {/* Close right column division */}
        </div>
      {/* Close grid container */}
      </div>
      {/* Layout container for cancel and submit action buttons */}
      <div className="form-actions">
        {/* Form cancel click action button */}
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        {/* Form submit action button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {/* Render saving label if loading is true, else Save Idea */}
          {loading ? 'Saving...' : 'Save Idea'}
        {/* Close save button */}
        </button>
      {/* Close actions container */}
      </div>
    {/* Close form container */}
    </form>
  // Close return expression
  );
// Close the IdeaForm component definition
};

// Export the IdeaForm component as the default export
export default IdeaForm;
