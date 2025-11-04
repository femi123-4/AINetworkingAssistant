import React from 'react';
import './askAi.css'
import { useState } from 'react';

function AskAi(){
    // State to hold all user input values
    const [values, setValues] = useState({
        background: '',
        goal: '',
        audience: '',
        platform: '',
        tone: 'professional',
        prior: 'no',
        help: ''
    })

    // State to store the final formatted output string
    const [combinedText, setCombinedText] = useState('');
    // State to control whether the modal/popup is visible
    const [submitted, setSubmitted] = useState(false);
    // State to store AI-generated advice
    const [aiAdvice, setAiAdvice] = useState('');
    // State to track loading status
    const [isLoading, setIsLoading] = useState(false);
    // State to track errors
    const [error, setError] = useState('');

    // Function to update form state as the user types/selects
    const handleChanges = (e) => {
        // Update the specific field based on the input name and value
        setValues({...values, [e.target.name]:e.target.value})
    }

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setIsLoading(true); // Show loading state
        setError(''); // Clear any previous errors
        setAiAdvice(''); // Clear previous advice

        // Format the collected input into a nicely structured string
        const formatted = 
        `Who are you? - Background: ${values.background}. \n` +
        `What do you want to achieve? - Goal: ${values.goal}. \n` +
        `Who are you talking to? - Audience: ${values.audience}.\n` +
        `Where is this happening? - Platform: ${values.platform}.\n` +
        `Preferred tone/style? - Tone: ${values.tone}.\n` +
        `Have you interacted before? - Prior Interaction: ${values.prior}.\n` +
        `What do you need help with? - Help Needed: ${values.help}. `;

        // Save the formatted message
        setCombinedText(formatted);
        console.log(formatted); // Optional: log output for debugging
        
        // Determine the advice type based on what help they need
        let adviceType = 'networking_prep'; // default
        const helpLower = values.help.toLowerCase();
        if (helpLower.includes('interview')) {
            adviceType = 'interview_prep';
        } else if (helpLower.includes('email') || helpLower.includes('follow-up')) {
            adviceType = 'email_draft';
        }

        // Send to backend and get AI advice
        try {
            const response = await fetch("http://127.0.0.1:5000/generate-advice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    text: formatted,
                    type: adviceType
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response from backend:", data);
            
            if (data.status === 'success') {
                setAiAdvice(data.advice);
                setSubmitted(true); // Show the modal with AI advice
            } else {
                setError(data.error || 'Failed to generate advice');
            }
        } catch (error) {
            console.error("Error sending to backend:", error);
            setError(`Connection error: ${error.message}. Make sure the Flask backend is running on port 5000.`);
        } finally {
            setIsLoading(false); // Hide loading state
        }
    };

    const closeModal = () => {
        setSubmitted(false); // Hides the pop up output
        setAiAdvice(''); // Clear the AI advice
    };

    const clearError = () => {
        setError(''); // Clear error message
    };

    return(
        <div className="ai-assistant-container">
            <h1>AI Networking Assistant</h1>
            <p className="subtitle">Get personalized networking advice powered by AI</p>

            <form id="networkingForm" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="background">Who are you? *</label>
                    <textarea 
                        id="background" 
                        name="background" 
                        value={values.background}
                        onChange={(e) => handleChanges(e)} 
                        placeholder="E.g. I'm a junior business major at Stanford University with an interest in marketing and brand strategy..."
                        required
                        rows="3"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="goal">What do you want to achieve? *</label>
                    <textarea 
                        id="goal" 
                        name="goal" 
                        value={values.goal}
                        onChange={(e) => handleChanges(e)} 
                        placeholder="E.g. I want to build connections and find internship opportunities in tech companies..."
                        required
                        rows="3"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="audience">Who are you talking to? *</label>
                    <textarea 
                        id="audience" 
                        name="audience" 
                        value={values.audience}
                        onChange={(e) => handleChanges(e)} 
                        placeholder="E.g. Tech recruiters, software engineers, hiring managers..."
                        required
                        rows="2"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="platform">Where is this happening? *</label>
                    <input 
                        type="text" 
                        id="platform" 
                        name="platform" 
                        value={values.platform}
                        onChange={(e) => handleChanges(e)} 
                        placeholder="E.g. Career Fair, LinkedIn, email, coffee chat..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tone">Preferred tone/style? *</label>
                    <select id="tone" name="tone" value={values.tone} onChange={(e) => handleChanges(e)}>
                        <option value="professional">Professional</option>
                        <option value="confident">Confident</option>
                        <option value="friendly">Friendly</option>
                        <option value="casual">Casual</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="prior">Have you interacted before? *</label>
                    <select id="prior" name="prior" value={values.prior} onChange={(e) => handleChanges(e)}>
                        <option value="no">No, these are new connections</option>
                        <option value="yes">Yes, I've interacted before</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="help">What do you need help with? *</label>
                    <textarea 
                        id="help"  
                        name="help" 
                        value={values.help}
                        onChange={(e) => handleChanges(e)} 
                        placeholder="E.g. Elevator pitch, conversation starters, follow-up email templates, interview preparation..."
                        required
                        rows="3"
                    ></textarea>
                    <small className="help-text">
                        💡 Tip: Mention "interview" for interview prep, "email" for email drafts, or describe your networking needs
                    </small>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Generating AI Advice...
                        </>
                    ) : (
                        '✨ Generate AI Networking Advice'
                    )}
                </button>
            </form>

            {/* Error message display */}
            {error && (
                <div className="error-message">
                    <div className="error-content">
                        <strong>⚠️ Error:</strong> {error}
                    </div>
                    <button className="close-error" onClick={clearError}>×</button>
                </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
                <div className="loading-indicator">
                    <div className="loading-content">
                        <div className="loading-spinner"></div>
                        <p>🤖 AI is analyzing your information and generating personalized advice...</p>
                        <small>This may take a few seconds</small>
                    </div>
                </div>
            )}

            {/* AI Output Modal */}
            {submitted && aiAdvice && (
                <div className="ai-output-backdrop" onClick={closeModal}>
                    <div className="ai-output-card" onClick={(e) => e.stopPropagation()}>
                        <h2>🎯 Your AI-Generated Networking Advice</h2>
                        
                        {/* Display user's input context */}
                        <div className="user-context">
                            <h3>📋 Your Context:</h3>
                            <div className="context-content">
                                {combinedText.split('\n').map((line, idx) => (
                                    <p key={idx}>{line}</p>
                                ))}
                            </div>
                        </div>

                        {/* Display AI-generated advice */}
                        <div className="ai-advice">
                            <h3>💡 AI Recommendations:</h3>
                            <div className="advice-content">
                                {aiAdvice.split('\n').map((paragraph, idx) => (
                                    paragraph.trim() && <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="close-btn" onClick={closeModal}>Close</button>
                            <button 
                                className="copy-btn" 
                                onClick={() => {
                                    navigator.clipboard.writeText(aiAdvice);
                                    alert('Advice copied to clipboard!');
                                }}
                            >
                                📋 Copy Advice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ); 
};

export default AskAi;