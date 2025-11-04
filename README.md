# 🤝 AI Networking Assistant

An intelligent web application that helps professionals and students prepare for networking events, interviews, and professional communications using Google's Gemini AI.

## 🌟 Features

- **Personalized Networking Prep** - Get custom elevator pitches and conversation starters
- **Interview Preparation** - Receive tailored interview advice and practice questions
- **Email Drafting** - Generate professional networking emails and follow-ups
- **Context-Aware AI** - Smart detection of your needs based on input
- **Real-time Generation** - AI-powered advice in seconds
- **Copy-to-Clipboard** - Easy saving and sharing of generated content
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **CSS3** - Custom styling with animations
- **Fetch API** - Backend communication

### Backend
- **Flask** - Python web framework
- **Google Gemini API** - AI content generation
- **Flask-CORS** - Cross-origin resource sharing
- **Python-dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+**
- **Node.js 16+** and npm
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-networking-assistant.git
cd ai-networking-assistant
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv env

# Activate virtual environment
# On macOS/Linux:
source env/bin/activate
# On Windows:
env\Scripts\activate

# Install dependencies
pip install flask flask-cors google-generativeai python-dotenv

# Create .env file
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
```

**Important:** Replace `your_actual_api_key_here` with your actual Gemini API key!

### 3. Frontend Setup

```bash
# Navigate to frontend directory (open new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Start the Backend

```bash
# In the backend directory (with virtual environment activated)
python app.py
```

## 🎯 Usage

1. **Open your browser** and navigate to `http://localhost:5173` (or your React dev server port)

2. **Fill out the form** with your information:
   - Who you are (background)
   - What you want to achieve (goals)
   - Who you're talking to (audience)
   - Where it's happening (platform)
   - Preferred tone/style
   - Prior interactions
   - What help you need

3. **Click "Generate AI Networking Advice"** and wait for personalized recommendations

4. **Review your AI-generated advice** including:
   - Elevator pitches
   - Conversation starters
   - Follow-up strategies
   - Email templates (if requested)
   - Interview tips (if requested)

5. **Copy to clipboard** or save the advice for later use

## 📁 Project Structure

```
ai-networking-assistant/
├── backend/
│   ├── env/                 # Virtual environment
│   ├── app.py              # Flask application
│   ├── .env                # API keys (gitignored)
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   └── components/
│   │       ├── askAi.jsx   # Main React component
│   │       └── askAi.css   # Styles
│   ├── package.json
│   └── ...
└── README.md
```

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🌐 API Endpoints

### Backend (Flask - Port 5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check and API info |
| `/health` | GET | Check API configuration status |
| `/generate-advice` | POST | Generate AI networking advice |
| `/chat` | POST | Interactive follow-up questions |
| `/process-text` | POST | Simple text processing (legacy) |

### Example Request

```javascript
POST /generate-advice
Content-Type: application/json

{
  "text": "Who are you? - Background: Junior CS major...",
  "type": "networking_prep"
}
```

### Example Response

```javascript
{
  "status": "success",
  "advice": "Based on your background as a junior CS major...",
  "type": "networking_prep"
}
```

## 🎨 Customization

### Changing the Color Scheme

Edit `frontend/src/components/askAi.css`:

```css
/* Primary color (form background) */
background-color: #451515;

/* Accent color (buttons) */
background-color: #007BFF;
```

### Modifying AI Prompts

Edit `backend/app.py` in the `PROMPTS` dictionary:

```python
PROMPTS = {
    'networking_prep': """Your custom prompt here...""",
    'interview_prep': """Your custom prompt here...""",
    # ... etc
}
```

## 🐛 Troubleshooting

### Backend Not Connecting
- Ensure Flask is running on port 5000
- Check that `GEMINI_API_KEY` is set in `.env`
- Verify CORS is allowing your frontend origin

### API Key Issues
- Confirm your Gemini API key is valid
- Check API quota limits at [Google AI Studio](https://aistudio.google.com/)

### Frontend Errors
- Check browser console (F12) for error messages
- Ensure backend URL matches in fetch calls
- Verify all dependencies are installed

## 📝 To-Do / Future Features

- [ ] User authentication and saved sessions
- [ ] History of generated advice
- [ ] Export advice as PDF
- [ ] Multiple language support
- [ ] Voice input for mobile users
- [ ] Company-specific advice database
- [ ] LinkedIn profile integration

## 👤 Author

**Your Name**
- GitHub: [@femi123-4](https://github.com/femi123-4)

## 🙏 Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for AI capabilities
- [Flask](https://flask.palletsprojects.com/) for the backend framework
- [React](https://react.dev/) for the frontend framework
- Inspired by the need for better networking preparation tools

**Made with ❤️ by femi123-4**
