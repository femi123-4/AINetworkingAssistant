from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.5-flash')

# System prompts for different networking scenarios
PROMPTS = {
    'networking_prep': """You are an expert networking coach. The user has provided detailed information about their networking situation.

Based on their information:
- Background: Who they are and their interests
- Goal: What they want to achieve
- Audience: Who they're talking to
- Platform: Where the interaction is happening (e.g., Career Fair, LinkedIn, email)
- Tone: Their preferred communication style (confident/friendly/professional/casual)
- Prior Interaction: Whether they've connected with these people before
- Help Needed: Specific areas where they need assistance

User's Complete Context:
{text}

Please provide comprehensive, personalized networking advice that includes:
1. A tailored elevator pitch (30-60 seconds) based on their background and goals
2. 3-5 specific conversation starters appropriate for their audience and platform
3. Key talking points they should emphasize given their background
4. Tips for making meaningful connections in their specific context
5. A follow-up strategy (what to say/do after the initial interaction)
6. Common pitfalls to avoid in their situation

Make sure your advice matches their preferred tone and takes into account whether this is a first-time or follow-up interaction.""",
    
    'interview_prep': """You are an experienced career coach. The user has provided detailed information about their interview preparation needs.

Based on their information:
- Background: Who they are and their experience
- Goal: What position/opportunity they're pursuing
- Audience: Who will be interviewing them
- Platform: Interview format (in-person, video call, phone, etc.)
- Tone: Their preferred communication style
- Prior Interaction: Whether they've spoken with the company/interviewer before
- Help Needed: Specific interview preparation needs

User's Complete Context:
{text}

Please provide comprehensive interview preparation advice including:
1. A strong opening introduction that highlights their background effectively
2. 5-7 compelling answers to common interview questions tailored to their experience
3. 3-5 insightful questions they should ask the interviewer
4. Strategies to showcase their relevant skills and experience
5. Tips for addressing potential weaknesses or gaps
6. Platform-specific advice (e.g., video call best practices if applicable)
7. Follow-up actions after the interview

Ensure the advice matches their preferred tone and considers any prior interactions they've mentioned.""",
    
    'email_draft': """You are a professional communication expert. The user needs help drafting a networking or professional email.

Based on their information:
- Background: Who they are
- Goal: What they want to accomplish with this email
- Audience: Who they're writing to
- Platform: Email context (cold email, LinkedIn, follow-up, etc.)
- Tone: Preferred writing style (confident/friendly/professional/casual)
- Prior Interaction: Whether they've communicated with the recipient before
- Help Needed: Type of email needed (introduction, follow-up, request, etc.)

User's Complete Context:
{text}

Please provide:
1. A complete email draft with:
   - Compelling subject line
   - Professional greeting
   - Strong opening that establishes connection/context
   - Clear body explaining their background and purpose
   - Specific call-to-action
   - Professional closing
2. Alternative subject line options (2-3)
3. Tips for personalizing the email further
4. Best timing/follow-up strategy
5. Common mistakes to avoid

The email should match their preferred tone while remaining professional and appropriate for their audience.""",
    
    'general': """You are an AI networking assistant. The user has provided information about their networking needs.

User has shared:
- Background: Their professional/academic identity
- Goal: What they want to achieve
- Audience: Who they need to connect with
- Platform: Where/how they're networking
- Tone: Their preferred communication style
- Prior Interaction: Their relationship history with the audience
- Help Needed: What specific assistance they need

User's Complete Context:
{text}

Please provide:
1. Analysis of their situation and networking approach
2. Personalized strategies based on their specific context
3. Actionable next steps they can take immediately
4. Resources or techniques relevant to their platform/audience
5. Long-term networking advice for their goals

Tailor all advice to their background, goals, and preferred tone."""
}

@app.route('/')
def index():
    return jsonify({
        'status': 'running',
        'message': 'AI Networking Assistant Backend',
        'endpoints': ['/process-text', '/generate-advice']
    })

@app.route('/process-text', methods=['POST'])
def process_text():
    """Simple endpoint to receive and acknowledge text"""
    try:
        data = request.get_json()
        combined_text = data.get('combinedText', '')
        
        if not combined_text:
            return jsonify({
                "error": "No text provided",
                "status": "error"
            }), 400
        
        print("Received from frontend:\n", combined_text)
        
        return jsonify({
            "message": "Text received successfully",
            "status": "success",
            "received_length": len(combined_text)
        })
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/generate-advice', methods=['POST'])
def generate_advice():
    """Generate AI advice using Gemini API"""
    try:
        data = request.get_json()
        user_text = data.get('text', '')
        advice_type = data.get('type', 'general')  # networking_prep, interview_prep, email_draft, general
        
        if not user_text:
            return jsonify({
                "error": "No text provided",
                "status": "error"
            }), 400
        
        # Get appropriate prompt
        prompt_template = PROMPTS.get(advice_type, PROMPTS['general'])
        prompt = prompt_template.format(text=user_text)
        
        print(f"Processing {advice_type} request...")
        
        # Generate content with Gemini
        response = model.generate_content(prompt)
        
        return jsonify({
            "status": "success",
            "advice": response.text,
            "type": advice_type
        })
    
    except Exception as e:
        print(f"Error generating advice: {str(e)}")
        return jsonify({
            "error": f"Failed to generate advice: {str(e)}",
            "status": "error"
        }), 500

@app.route('/chat', methods=['POST'])
def chat():
    """Interactive chat endpoint for follow-up questions"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        context = data.get('context', '')  # Previous conversation context
        
        if not message:
            return jsonify({
                "error": "No message provided",
                "status": "error"
            }), 400
        
        # Build chat prompt with context
        if context:
            full_prompt = f"""Previous context: {context}

User question: {message}

As an AI networking assistant, provide a helpful response."""
        else:
            full_prompt = f"""As an AI networking assistant, answer this question:

{message}"""
        
        response = model.generate_content(full_prompt)
        
        return jsonify({
            "status": "success",
            "response": response.text
        })
    
    except Exception as e:
        print(f"Error in chat: {str(e)}")
        return jsonify({
            "error": f"Chat failed: {str(e)}",
            "status": "error"
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "gemini_configured": bool(os.getenv('GEMINI_API_KEY'))
    })

if __name__ == '__main__':
    # Check if API key is configured
    if not os.getenv('GEMINI_API_KEY'):
        print("WARNING: GEMINI_API_KEY not found in environment variables!")
        print("Please create a .env file with your Gemini API key")
    
    app.run(debug=True, port=5000)