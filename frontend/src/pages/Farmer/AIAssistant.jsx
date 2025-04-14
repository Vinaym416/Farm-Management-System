// import React, { useState, useEffect } from 'react';
// import { Mic, Send, History, Leaf } from 'lucide-react';
// import { GoogleGenAI } from '@google/genai';

// const ai = new GoogleGenAI({ apiKey: 'AIzaSyDN91XIzuHfgmh9Y8HviEUezJDxes7Fhuc' });

// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;

// // Updated formatJsonParagraph function
// function formatJsonParagraph(jsonString, width = 80) {
//   try {
//     // Parse JSON input
//     let data = JSON.parse(jsonString);

//     // Extract the paragraph text
//     let paragraph = data.paragraph || "";

//     // Remove lines starting with '*'
//     paragraph = paragraph
//       .split('\n')
//       .filter(line => !line.trim().startsWith('*'))
//       .join(' ');

//     // Normalize spaces
//     paragraph = paragraph.replace(/\s+/g, ' ').trim();

//     // Add line breaks after sentences (., !, ?)
//     paragraph = paragraph.replace(/([.!?])\s+/g, "$1\n");

//     // Wrap text to a fixed width
//     function wrapText(text, width) {
//       let words = text.split(" ");
//       let line = "";
//       let formattedText = "";

//       words.forEach(word => {
//         if ((line + word).length > width) {
//           formattedText += line.trim() + "\n";
//           line = "";
//         }
//         line += word + " ";
//       });

//       return formattedText + line.trim();
//     }

//     let formattedParagraph = wrapText(paragraph, width);

//     // Update the JSON structure
//     data.formatted_paragraph = formattedParagraph;

//     // Return formatted JSON string
//     return JSON.stringify(data, null, 4);
//   } catch (error) {
//     return JSON.stringify({ error: "Invalid JSON input" }, null, 4);
//   }
// }

// function AIAssistant() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [suggestedQuestions, setSuggestedQuestions] = useState([]);
//   const [location, setLocation] = useState('');

//   useEffect(() => {
//     // Fetch user location
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
//       },
//       (error) => {
//         console.error('Error fetching location:', error);
//         setLocation('Location not available');
//       }
//     );

//     // Add welcome message and initial suggested questions
//     setMessages([
//       {
//         text: "Hello! How can I help you today? Choose one of the options below or enter your question.",
//         isUser: false,
//         timestamp: new Date(),
//       },
//     ]);
//     setSuggestedQuestions([
//       'Which crops can I grow in Karnataka?',
//       'How much fertilizer should I use?',
//       'What is the best time to plant rice?',
//       'How do I prevent pests in my crops?',
//     ]);
//   }, []);

//   // Modify the handleSend function to format AI responses
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const newMessage = {
//       text: input,
//       isUser: true,
//       timestamp: new Date(),
//     };

//     setMessages([...messages, newMessage]);

//     try {
//       const response = await ai.models.generateContent({
//         model: 'gemini-2.0-flash',
//         contents: input,
//       });

//       // Format the AI response using formatJsonParagraph
//       const formattedResponse = formatJsonParagraph(
//         JSON.stringify({ paragraph: response.text.trim() })
//       );

//       const aiResponse = {
//         text: JSON.parse(formattedResponse).formatted_paragraph,
//         isUser: false,
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiResponse]);
//       updateSuggestedQuestions(input);
//     } catch (error) {
//       console.error('Error fetching AI response:', error);
//       const errorMessage = {
//         text: 'An error occurred while fetching the AI response. Please try again later.',
//         isUser: false,
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     }

//     setInput('');
//   };

//   const updateSuggestedQuestions = (context) => {
//     // Simulate API call to fetch dynamic suggestions
//     if (context.toLowerCase().includes('fertilizer')) {
//       setSuggestedQuestions([
//         'How much fertilizer should I use for wheat?',
//         'What are the best organic fertilizers?',
//         'How often should I apply fertilizer?',
//       ]);
//     } else if (context.toLowerCase().includes('irrigation')) {
//       setSuggestedQuestions([
//         'What are the best irrigation methods for rice?',
//         'How can I conserve water during irrigation?',
//         'What is drip irrigation and how does it work?',
//       ]);
//     } else if (context.toLowerCase().includes('pests')) {
//       setSuggestedQuestions([
//         'How do I prevent pests in my crops?',
//         'What are natural ways to control pests?',
//         'Which pesticides are safe for vegetables?',
//       ]);
//     } else {
//       setSuggestedQuestions([
//         'Which crops can I grow in Karnataka?',
//         'How much fertilizer should I use?',
//         'What is the best time to plant rice?',
//         'How do I prevent pests in my crops?',
//       ]);
//     }
//   };

//   const toggleMic = () => {
//     if (!SpeechRecognition) {
//       alert('Speech recognition is not supported in this browser.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';

//     if (!isListening) {
//       recognition.start();
//       setIsListening(true);

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setInput(transcript); // Set the recognized text as input
//         setIsListening(false);
//       };

//       recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         setIsListening(false);
//       };

//       recognition.onend = () => {
//         setIsListening(false);
//       };
//     } else {
//       recognition.stop();
//       setIsListening(false);
//     }
//   };

//   const handleSuggestedQuestionClick = (question) => {
//     setInput(question);
//     handleSend();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8">
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-green-600 p-4 flex items-center gap-3">
//           <Leaf className="text-white h-8 w-8 animate-bounce" />
//           <h1 className="text-2xl font-bold text-white">Farmer's AI Assistant</h1>
//         </div>

//         {/* Chat Area */}
//         <div className="h-[500px] overflow-y-auto p-4 bg-gradient-to-b from-green-50 to-white">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
//             >
//               <div
//                 className={`max-w-[80%] p-3 rounded-2xl ${
//                   message.isUser
//                     ? 'bg-green-600 text-white rounded-tr-none'
//                     : 'bg-gray-100 text-gray-800 rounded-tl-none'
//                 } animate-fadeIn`}
//               >
//                 <p>{message.text}</p>
//                 <span className="text-xs opacity-70">
//                   {message.timestamp.toLocaleTimeString()}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Suggested Questions */}
//         <div className="p-4 bg-gray-100 border-t border-gray-200">
//           <h3 className="text-lg font-semibold mb-2">Suggested Questions:</h3>
//           <div className="flex flex-wrap gap-2">
//             {suggestedQuestions.map((question, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleSuggestedQuestionClick(question)}
//                 className="bg-green-200 hover:bg-green-300 text-green-800 px-3 py-1 rounded-full text-sm transition-all duration-300"
//               >
//                 {question}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Input Area */}
//         <div className="p-4 bg-white border-t border-gray-200">
//           <div className="flex items-center gap-2">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//               placeholder="Ask a question..."
//               className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//             <button
//               onClick={toggleMic}
//               className={`p-3 rounded-full transition-all duration-300 ${
//                 isListening
//                   ? 'bg-red-500 animate-pulse'
//                   : 'bg-gray-200 hover:bg-gray-300'
//               }`}
//             >
//               <Mic className="h-6 w-6" />
//             </button>
//             <button
//               onClick={handleSend}
//               className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-all duration-300"
//             >
//               <Send className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AIAssistant;


function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Fetch user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
      },
      (error) => {
        console.error('Error fetching location:', error);
        setLocation('Location not available');
      }
    );

    // Add welcome message and initial suggested questions
    setMessages([
      {
        text: "Hello! How can I help you today? Choose one of the options below or enter your question.",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setSuggestedQuestions([
      'Which crops can I grow in Karnataka?',
      'How much fertilizer should I use?',
      'What is the best time to plant rice?',
      'How do I prevent pests in my crops?',
    ]);
  }, []);

  // Function to download messages as a JSON file
  const downloadMessages = () => {
    const dataStr = JSON.stringify(messages, null, 4);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'messages.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: input,
      });

      const formattedResponse = formatJsonParagraph(
        JSON.stringify({ paragraph: response.text.trim() })
      );

      const aiResponse = {
        text: JSON.parse(formattedResponse).formatted_paragraph,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      updateSuggestedQuestions(input);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = {
        text: 'An error occurred while fetching the AI response. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput('');
  };

  const updateSuggestedQuestions = (context) => {
    if (context.toLowerCase().includes('fertilizer')) {
      setSuggestedQuestions([
        'How much fertilizer should I use for wheat?',
        'What are the best organic fertilizers?',
        'How often should I apply fertilizer?',
      ]);
    } else if (context.toLowerCase().includes('irrigation')) {
      setSuggestedQuestions([
        'What are the best irrigation methods for rice?',
        'How can I conserve water during irrigation?',
        'What is drip irrigation and how does it work?',
      ]);
    } else if (context.toLowerCase().includes('pests')) {
      setSuggestedQuestions([
        'How do I prevent pests in my crops?',
        'What are natural ways to control pests?',
        'Which pesticides are safe for vegetables?',
      ]);
    } else {
      setSuggestedQuestions([
        'Which crops can I grow in Karnataka?',
        'How much fertilizer should I use?',
        'What is the best time to plant rice?',
        'How do I prevent pests in my crops?',
      ]);
    }
  };

  const toggleMic = () => {
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    if (!isListening) {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleSuggestedQuestionClick = (question) => {
    setInput(question);
    handleSend();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-4 flex items-center gap-3">
          <Leaf className="text-white h-8 w-8 animate-bounce" />
          <h1 className="text-2xl font-bold text-white">Farmer's AI Assistant</h1>
        </div>

        {/* Chat Area */}
        <div className="h-[500px] overflow-y-auto p-4 bg-gradient-to-b from-green-50 to-white">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-green-600 text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                } animate-fadeIn`}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Suggested Questions:</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestionClick(question)}
                className="bg-green-200 hover:bg-green-300 text-green-800 px-3 py-1 rounded-full text-sm transition-all duration-300"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Mic className="h-6 w-6" />
            </button>
            <button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-all duration-300"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Download Button */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 text-center">
          <button
            onClick={downloadMessages}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Download Chat as JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;