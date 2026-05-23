// Import useState and useEffect hooks from react
import { useState, useEffect } from 'react';
// Import drag and drop components
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// Import the database functions from the services folder
import { getIdeas, deleteIdea, updateIdeaOrder, updateIdea } from '../services/database';

// Define a function to highlight text in plain string
const highlightText = (text, query) => {
  // Return original text if query is empty
  if (!query) return text;
  // Convert query to lower case
  const lowerQuery = query.toLowerCase();
  // Find query index in text content
  const index = text.toLowerCase().indexOf(lowerQuery);
  // Return original if no match
  if (index === -1) return text;
  
  // Split the text based on matching query
  const parts = [];
  // Keep track of search cursor position
  let lastIndex = 0;
  // Find match index
  let matchIndex = text.toLowerCase().indexOf(lowerQuery, lastIndex);
  // While match is found
  while (matchIndex !== -1) {
    // Push preceding text part
    parts.push(text.substring(lastIndex, matchIndex));
    // Push match part wrapped in highlight styling
    parts.push(
      <mark key={matchIndex} style={{ backgroundColor: 'rgba(245, 158, 11, 0.3)', color: 'inherit' }}>
        {text.substring(matchIndex, matchIndex + query.length)}
      </mark>
    );
    // Update last index cursor position
    lastIndex = matchIndex + query.length;
    // Find next match index
    matchIndex = text.toLowerCase().indexOf(lowerQuery, lastIndex);
  }
  // Push remaining text part
  parts.push(text.substring(lastIndex));
  // Return elements array
  return parts;
};

// Define a function to highlight matches inside an HTML string safely
const highlightHTML = (html, query) => {
  // Check if the html input is null, undefined, or empty
  if (!html) {
    // Return an empty string as a safe fallback
    return '';
    // Close the html check block
  }
  // Return original HTML if query is empty
  if (!query) return html;
  // Create temporary container element
  const div = document.createElement('div');
  // Set inner HTML of container
  div.innerHTML = html;
  
  // Create a recursive text node highlighter
  const highlightNode = (node) => {
    // Check if it is a text node
    if (node.nodeType === Node.TEXT_NODE) {
      // Get text content
      const text = node.textContent;
      // Convert query to lower case
      const lowerQuery = query.toLowerCase();
      // Find query index in text content
      const index = text.toLowerCase().indexOf(lowerQuery);
      // If query is found in text content
      if (index !== -1) {
        // Create document fragment
        const fragment = document.createDocumentFragment();
        // Keep track of search cursor position
        let lastIndex = 0;
        // Loop to find all occurrences in the text node
        let matchIndex = text.toLowerCase().indexOf(lowerQuery, lastIndex);
        // While match is found
        while (matchIndex !== -1) {
          // Append preceding text
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
          // Create mark element
          const mark = document.createElement('mark');
          // Add custom background highlighting styles
          mark.style.backgroundColor = 'rgba(245, 158, 11, 0.3)';
          // Add custom color highlighting styles
          mark.style.color = 'inherit';
          // Set text content to exact match case
          mark.textContent = text.substring(matchIndex, matchIndex + query.length);
          // Append mark element to fragment
          fragment.appendChild(mark);
          // Update last index cursor position
          lastIndex = matchIndex + query.length;
          // Find next match index
          matchIndex = text.toLowerCase().indexOf(lowerQuery, lastIndex);
        }
        // Append remaining text
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        // Replace original node with fragment
        node.parentNode.replaceChild(fragment, node);
      }
      // Else if node has children, recurse into them
    } else if (node.hasChildNodes()) {
      // Loop over children array from end to start to handle replacements safely
      const children = Array.from(node.childNodes);
      // Loop through all child nodes
      for (const child of children) {
        // Recursively highlight child nodes
        highlightNode(child);
      }
    }
  };
  
  // Highlight container children nodes
  highlightNode(div);
  // Return the highlighted HTML string
  return div.innerHTML;
};

// Define the IdeaList component that accepts onEdit, searchQuery, showArchived, onRefresh, and onTagClick props
const IdeaList = ({ onEdit, searchQuery = '', showArchived = false, onRefresh, onTagClick }) => {
// Initialize the ideas state with an empty array
  const [ideas, setIdeas] = useState([]);
// Initialize the loading state as true
  const [loading, setLoading] = useState(true);
// Initialize the state for the idea to delete
  const [ideaToDelete, setIdeaToDelete] = useState(null);
// Initialize the state for the idea to archive
  const [ideaToArchive, setIdeaToArchive] = useState(null);

// Create a function to fetch the ideas from the database
  const fetchIdeas = async () => {
// Set the loading state to true
    setLoading(true);
// Try to fetch ideas
    try {
// Call the getIdeas function from the database service
      const data = await getIdeas();
// Update the ideas state with the fetched data
      setIdeas(data);
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
// Close the fetchIdeas function definition
  };

// Use the useEffect hook to fetch ideas on component mount
  useEffect(() => {
// Set a timeout to defer fetchIdeas to run after current render cycle
    const timer = setTimeout(() => {
// Call the fetchIdeas function
      fetchIdeas();
// Use a zero millisecond delay
    }, 0);
// Return cleanup function to clear the timeout
    return () => clearTimeout(timer);
// Add an empty dependency array to run only once
  }, []);

// Create a function to handle the delete button click
  const handleDeleteClick = (id) => {
// Set the ideaToDelete state to show the modal
    setIdeaToDelete(id);
// Close the handleDeleteClick function
  };

// Create a function to cancel the deletion
  const cancelDelete = () => {
// Clear the ideaToDelete state to hide the modal
    setIdeaToDelete(null);
// Close the cancelDelete function
  };

// Create a function to confirm and execute the deletion
  const confirmDelete = async () => {
// Return early if there is no idea to delete
    if (!ideaToDelete) return;
// Try to delete the idea
    try {
// Call the deleteIdea function from the database service
      await deleteIdea(ideaToDelete);
// Update the ideas state by filtering out the deleted idea
      setIdeas(ideas.filter(idea => idea.id !== ideaToDelete));
// Catch any errors
    } catch (error) {
// Log the error to the console
      console.error(error);
// Execute the finally block
    } finally {
// Clear the ideaToDelete state to hide the modal
      setIdeaToDelete(null);
// Close the try-catch-finally block
    }
// Close the confirmDelete function definition
  };
  
// Create a function to handle the archive button click
  const handleArchiveClick = (idea) => {
    // Set the ideaToArchive state to show the modal
    setIdeaToArchive(idea);
    // Close the handleArchiveClick function
  };

// Create a function to confirm and execute archiving/unarchiving
  const confirmToggleArchive = async (idea) => {
    // Use the passed idea or fallback to the ideaToArchive state
    const targetIdea = idea || ideaToArchive;
    // Return early if no target idea exists
    if (!targetIdea) return;
    // Try to execute the update
    try {
      // Update the archived status in the database
      await updateIdea(targetIdea.id, { archived: !targetIdea.archived });
      // Check if onRefresh callback is provided
      if (onRefresh) {
        // Call the onRefresh callback
        onRefresh();
        // Else execute the block for manual refresh
      } else {
        // Manually fetch the ideas
        await fetchIdeas();
        // Close the if-else block
      }
      // Catch any errors
    } catch (error) {
      // Log the error to the console
      console.error(error);
      // Execute the finally block to clean up state
    } finally {
      // Reset the ideaToArchive state to hide the modal
      setIdeaToArchive(null);
      // Close the try-catch-finally block
    }
    // Close the confirmToggleArchive function
  };

// Create a function to cancel archiving
  const cancelArchive = () => {
    // Clear the ideaToArchive state to hide the modal
    setIdeaToArchive(null);
    // Close the cancelArchive function
  };

// Create a function to handle drag end
  const onDragEnd = async (result) => {
// Return early if dropped outside a valid droppable
    if (!result.destination) return;
    
// Create a new array from the current ideas state
    const items = Array.from(ideas);
    
// Calculate indices in the filtered view vs the overall array
// Get the ID of the dragged item
    const draggedId = result.draggableId;
// Get the ID of the item at the destination index in the filtered view
    const destinationItemInFilteredView = filteredIdeas[result.destination.index];
// If dropping to the exact same spot, do nothing
    if (result.source.index === result.destination.index) return;

// Find the absolute indices in the full `ideas` array
    const absoluteSourceIndex = items.findIndex(i => i.id === draggedId);
    let absoluteDestinationIndex = items.findIndex(i => i.id === destinationItemInFilteredView?.id);
    
// Check if the absolute destination index is not found in the list
    if (absoluteDestinationIndex === -1) {
// Set the destination to the very end of the items array
      absoluteDestinationIndex = items.length;
// Close the if statement block
    }

// Remove the item from its original position
    const [reorderedItem] = items.splice(absoluteSourceIndex, 1);
// Insert the item into its new position
    items.splice(absoluteDestinationIndex, 0, reorderedItem);
    
// Optimistically update the local state
    setIdeas(items);
    
// Try to update the backend
    try {
// Call the updateIdeaOrder service with the new ordered array of IDs
      await updateIdeaOrder(items.map(item => item.id));
// Catch any errors
    } catch (error) {
// Log the error
      console.error('Failed to save order', error);
// Rollback state could go here
// Close the try-catch block
    }
// Close the onDragEnd function
  };

// Filter ideas based on the search query and archive state
  const filteredIdeas = ideas.filter(idea => {
// First filter by archive status
    if (showArchived && !idea.archived) return false;
// Also filter active ones
    if (!showArchived && idea.archived) return false;

// Return true if there is no search query
    if (!searchQuery) return true;
// Convert query to lowercase
    const q = searchQuery.toLowerCase();
// Check if title matches
    const matchesTitle = idea.title.toLowerCase().includes(q);
// Check if description matches (strip HTML for searching)
    const plainTextDescription = idea.description.replace(/<[^>]+>/g, '').toLowerCase();
// check if plain description matches
    const matchesDescription = plainTextDescription.includes(q);
// Check if tags match
    const matchesTags = idea.tags?.some(tag => tag.toLowerCase().includes(q));
// Return true if any field matches
    return matchesTitle || matchesDescription || matchesTags;
// Close the filter function
  });

// Check if the component is loading
  if (loading) {
// Return a loading message
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading ideas...</div>;
// Close the if statement
  }

// Return the JSX for the IdeaList component
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="ideas" type="card" direction="vertical">
          {(provided) => (
            <div 
              // Spread droppable props
              {...provided.droppableProps} 
              // Assign innerRef
              ref={provided.innerRef} 
              // Add responsive flex column layout for stable drag-and-drop
              style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'stretch' }}
            >
              {filteredIdeas.map((idea, index) => (
                <Draggable key={idea.id} draggableId={idea.id} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      // Assign innerRef
                      ref={provided.innerRef} 
                      // Spread draggable props
                      {...provided.draggableProps} 
                      // Spread drag handle props to allow dragging from anywhere on the card
                      {...provided.dragHandleProps}
                      // Apply classes
                      className={`card ${snapshot.isDragging ? 'dragging' : 'animate-fade-in'}`} 
                      // Apply styles, merging with draggable styles
                      style={{ 
                        // Set display flex
                        display: 'flex', 
                        // Set flex direction
                        flexDirection: 'column', 
                        // Add colored top border accent matching the idea color
                        borderTop: `4px solid ${idea.color || 'var(--primary-color)'}`,
                        // Set cursor style based on dragging state
                        cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                        // Scale slightly if dragging
                        transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
                        // Boost z-index if dragging
                        zIndex: snapshot.isDragging ? 100 : 1,
                        // Box shadow if dragging
                        boxShadow: snapshot.isDragging ? '0 10px 30px rgba(0,0,0,0.1)' : 'none',
                        // Set touch-action none for mobile touch optimization
                        touchAction: 'none',
                        // Merge with provided styles
                        ...provided.draggableProps.style 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '24px', margin: 0 }}>
                          <div 
                            // Add styling for the emoji circular container
                            style={{ fontSize: '1.5rem', background: idea.color || 'var(--surface-color)', padding: '0.5rem', borderRadius: '50%', border: `1px solid ${idea.color || 'var(--border-color)'}`, width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {idea.emoji || '💡'}
                          {/* Close container */}
                          </div>
                          {/* Render highlighted title */}
                          {highlightText(idea.title, searchQuery)}
                        </h3>
                      </div>
                      
                      {/* Render rich text safely */}
                      <div 
                        // Set className to card-description for layout and word-wrapping
                        className="card-description"
                        // Render description with query highlights
                        dangerouslySetInnerHTML={{ __html: highlightHTML(idea.description, searchQuery) }}
                      // Close the division tag
                      />
                      
                      {idea.tags && idea.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                          {idea.tags.map(tag => (
                            // Render clickable tag pill element
                            <span 
                              key={tag} 
                              // Apply tag styling class
                              className="tag"
                              // Prevent drag triggers and set search query
                              onClick={(e) => {
                                // Stop event propagation to prevent drag starting on click
                                e.stopPropagation();
                                // Set search query to this tag
                                if (onTagClick) onTagClick(tag);
                              }}
                            >
                              #{tag}
                            {/* Close tag span container */}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Left-align the idea card action buttons horizontally and use dynamic border color variable */}
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        {/* Archive or unarchive button */}
                        <button className="btn btn-ghost" onClick={() => handleArchiveClick(idea)}>
                          {/* Display toggle text only without emoji */}
                          {idea.archived ? 'Unarchive' : 'Archive'}
                        {/* Close button */}
                        </button>
                        <button className="btn btn-ghost" onClick={() => onEdit(idea)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDeleteClick(idea.id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {filteredIdeas.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem', background: 'var(--surface-color)', borderRadius: '24px', backdropFilter: 'blur(32px)' }}>
                  <span style={{ fontSize: '3rem' }}>{showArchived ? '📦' : '✨'}</span>
                  <h3 style={{ marginTop: '1rem' }}>No ideas found</h3>
                  <p style={{ marginTop: '0.5rem' }}>
                    {searchQuery ? 'Try adjusting your search query.' : (showArchived ? 'You have no archived ideas.' : 'Click "Add New Idea" to capture your first thought.')}
                  </p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {ideaToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(4px)' }} onClick={cancelDelete}></div>
          <div className="card animate-fade-in" style={{ position: 'relative', zIndex: 1001, maxWidth: '400px', width: '90%', textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ marginBottom: '1rem', fontSize: '24px' }}>Confirm Deletion</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Are you sure you want to delete this idea? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Check if ideaToArchive state is active */}
      {ideaToArchive && (
        <div 
          // Overlay container styling
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div 
            // Blur backdrop background
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(4px)' }} 
            // Click handler to cancel
            onClick={cancelArchive}
          ></div>
          <div 
            // Modal card container class
            className="card animate-fade-in" 
            // Card styling
            style={{ position: 'relative', zIndex: 1001, maxWidth: '400px', width: '90%', textAlign: 'center', padding: '3rem 2rem' }}
          >
            {/* Modal icon */}
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {/* Display dynamic icon */}
              {ideaToArchive.archived ? '📤' : '📥'}
            </div>
            {/* Modal heading */}
            <h2 style={{ marginBottom: '1rem', fontSize: '24px' }}>
              {/* Display dynamic heading */}
              {ideaToArchive.archived ? 'Confirm Unarchive' : 'Confirm Archive'}
            </h2>
            {/* Modal description text */}
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {/* Display dynamic description */}
              {ideaToArchive.archived 
                ? 'Are you sure you want to unarchive this idea? It will be moved to the Active tab.' 
                : 'Are you sure you want to archive this idea? It will be moved to the Archive tab.'}
            </p>
            <div 
              // Action buttons container style
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
            >
              {/* Cancel button */}
              <button className="btn btn-ghost" onClick={cancelArchive}>Cancel</button>
              {/* Confirm button */}
              <button className="btn btn-primary" onClick={() => confirmToggleArchive()}>
                {/* Display dynamic button label */}
                {ideaToArchive.archived ? 'Yes, Unarchive' : 'Yes, Archive'}
              </button>
              {/* Close buttons container */}
            </div>
            {/* Close card container */}
          </div>
          {/* Close overlay container */}
        </div>
      )}
    </>
  );
// Close the IdeaList component definition
};

// Export the IdeaList component as the default export
export default IdeaList;
