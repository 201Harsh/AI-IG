import { useState, useEffect } from "react";
import {
  FiImage,
  FiDownload,
  FiShare2,
  FiSettings,
  FiClock,
  FiTrash2,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Axios from "../Config/Axios";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Sample styles for the AI generator
  const styles = [
    { value: "realistic", label: "Realistic" },
    { value: "fantasy", label: "Fantasy" },
    { value: "anime", label: "Anime" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "watercolor", label: "Watercolor" },
  ];

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("aiImageHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("aiImageHistory", JSON.stringify(history));
  }, [history]);

  // Function to handle image download
  const downloadImage = (imageUrl, promptText) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `Endpix AI-${promptText.substring(
          0,
          50
        )}- By Harsh.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
      });
  };

  // Function to add an image to history
const addToHistory = (imageUrl, promptText, styleType) => {
  try {
    const newHistoryItem = {
      id: Date.now(),
      imageUrl,
      prompt: promptText,
      style: styleType,
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => {
      // Keep only the last 20 items to prevent quota issues
      const newHistory = [newHistoryItem, ...prev].slice(0,2);
      
      // Compress data before saving
      const compressedHistory = newHistory.map(item => ({
        ...item,
        // Optional: Use thumbnails for history items instead of full URLs
        imageUrl: item.imageUrl.includes('data:image') ? 
          compressImageUrl(item.imageUrl) : 
          item.imageUrl
      }));

      try {
        localStorage.setItem("aiImageHistory", JSON.stringify(compressedHistory));
      } catch (storageError) {
        console.warn("Failed to save history:", storageError);
        // Fallback: Keep in memory only
        return newHistory;
      }
      
      return newHistory;
    });
  } catch (error) {
    console.error("Error adding to history:", error);
  }
};

// Optional image URL compressor for data URLs
const compressImageUrl = (dataUrl) => {
  if (!dataUrl.startsWith('data:image')) return dataUrl;
  
  try {
    const img = new Image();
    img.src = dataUrl;
    const canvas = document.createElement('canvas');
    canvas.width = 200; // Thumbnail width
    canvas.height = 200 * (img.height / img.width);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.7); // Convert to JPEG with 70% quality
  } catch {
    return dataUrl; // Fallback to original if compression fails
  }
};

// In your useEffect for saving history
useEffect(() => {
  const saveHistory = () => {
    try {
      if (history.length > 0) {
        const compressedHistory = history.map(item => ({
          ...item,
          imageUrl: item.imageUrl.includes('data:image') ? 
            compressImageUrl(item.imageUrl) : 
            item.imageUrl
        }));
        localStorage.setItem("aiImageHistory", JSON.stringify(compressedHistory));
      }
    } catch (error) {
      console.warn("Failed to save history to localStorage:", error);
      // Implement fallback strategy here if needed
    }
  };

  // Debounce the save operation
  const debounceTimer = setTimeout(saveHistory, 500);
  return () => clearTimeout(debounceTimer);
}, [history]);

  // Function to remove an item from history
  const removeFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Mock generation process
  const generateImage = async () => {
  if (!prompt.trim()) {
    toast.error("Please enter a prompt", {
      position: "top-right",
      autoClose: 5000,
      theme: "dark",
      transition: Bounce,
    });
    return;
  }

  setIsGenerating(true);
  setProgress(0);
  setGeneratedImage(null);

  try {
    const response = await Axios.post(
      "/ai/imageGen",
      {
        prompt,
        style,
      },
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const uploadProgress = Math.round(
              (progressEvent.loaded * 50) / progressEvent.total
            );
            setProgress(uploadProgress);
          }
        },
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const downloadProgress =
              50 +
              Math.round((progressEvent.loaded * 50) / progressEvent.total);
            setProgress(downloadProgress);
          }
        },
      }
    );

    const newImage = response.data.image;
    if (!newImage) throw new Error("No image URL returned");

    setProgress(100);
    setGeneratedImage(newImage);
    addToHistory(newImage, prompt, style);
  

  } catch (error) {
    console.error("Generation error:", error);
    
    // Handle different error formats
    if (error.response?.data?.errors) {
      // Handle array of errors
      error.response.data.errors.forEach((err) => {
        toast.error(`${err.msg} at ${err.path}`, {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
          transition: Bounce,
        });
      });
    } else if (error.response?.data?.message) {
      // Handle single error message
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      // Generic error
      toast.error("Failed to generate image. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    }
  } finally {
    setIsGenerating(false);
  }
};

  // Sample prompts for quick generation
  const samplePrompts = [
    "Cyberpunk city at night with neon lights",
    "Fantasy castle floating in the clouds",
    "Portrait of a steampunk inventor",
    "Cute cat wearing a wizard hat",
    "Futuristic city skyline at sunset",
    "A Girl love a Boy in a Starry Night",
    "A Beautiful Sunset on a Beach",
    "Two People in Love",
    "A Robot Playing Guitar",
  ];

  // Format timestamp for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <HiOutlineSparkles className="w-6 h-6 text-purple-400" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            EndPix AI
          </span>
        </div>
        <nav className="md:flex hidden space-x-4">
          <button className="px-4 py-2 rounded-md hover:bg-gray-700/50 transition">
            Gallery
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 rounded-md hover:bg-gray-700/50 transition flex items-center ${
              showHistory ? "bg-purple-600/50" : ""
            }`}
          >
            <FiClock className="mr-1" /> History
          </button>
          <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition">
            Upgrade
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="font-medium flex items-center">
                  <FiClock className="mr-2" /> Generation History
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {history.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FiImage className="w-12 h-12 mx-auto mb-4" />
                    <p>No generation history yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-700/20 rounded-lg border border-gray-700 overflow-hidden"
                      >
                        <div className="relative group">
                          <img
                            src={item.imageUrl}
                            alt={item.prompt}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                            <div className="text-white">
                              <p className="text-sm font-medium truncate">
                                {item.prompt}
                              </p>
                              <p className="text-xs opacity-70">
                                Style: {item.style}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() =>
                                  downloadImage(item.imageUrl, item.prompt)
                                }
                                className="p-2 bg-gray-800/80 rounded-full hover:bg-gray-700"
                                title="Download"
                              >
                                <FiDownload className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeFromHistory(item.id)}
                                className="p-2 bg-gray-800/80 rounded-full hover:bg-red-500/80"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-400 truncate">
                            {item.prompt}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(item.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showHistory && (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Generation Panel */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-6"
              >
                <h1 className="text-3xl font-bold mb-2">AI Image Generator</h1>
                <p className="text-gray-400 mb-6">
                  Transform your ideas into stunning visuals with our AI
                  technology
                </p>

                {/* Prompt Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Describe your image
                  </label>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="A beautiful sunset over mountains..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                      {prompt.length}/500
                    </div>
                  </div>
                </div>

                {/* Style Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Style
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {styles.map((s) => (
                      <motion.button
                        key={s.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStyle(s.value)}
                        className={`py-2 px-3 rounded-lg text-sm ${
                          style === s.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 hover:bg-gray-700"
                        }`}
                      >
                        {s.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="mb-8">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center text-sm text-gray-400 hover:text-white"
                  >
                    <FiSettings className="mr-1" />
                    {showAdvanced ? "Hide" : "Show"} advanced options
                  </button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4 overflow-hidden"
                      >
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Creativity Level
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            className="w-full accent-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Image Resolution
                          </label>
                          <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-sm">
                            <option>1024x1024</option>
                            <option>768x1024</option>
                            <option>1024x768</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
                    isGenerating || !prompt.trim()
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating ({progress}%)
                    </span>
                  ) : (
                    <>
                      <HiOutlineSparkles className="mr-2" />
                      Generate Image
                    </>
                  )}
                </motion.button>

                {/* Sample Prompts */}
                <div className="mt-6">
                  <p className="text-sm text-gray-400 mb-2">
                    Try these prompts:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {samplePrompts.map((sample, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPrompt(sample)}
                        className="px-3 py-1 text-xs bg-gray-700/50 hover:bg-gray-700 rounded-full"
                      >
                        {sample}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Output Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="font-medium">Generated Image</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg">
                      <FiShare2 />
                    </button>
                    <button
                      onClick={() =>
                        generatedImage && downloadImage(generatedImage, prompt)
                      }
                      className={`p-2 rounded-lg ${
                        generatedImage
                          ? "hover:bg-gray-700"
                          : "text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!generatedImage}
                    >
                      <FiDownload />
                    </button>
                  </div>
                </div>

                <div className="h-full min-h-[500px] flex items-center justify-center p-4">
                  {isGenerating ? (
                    <div className="text-center">
                      <div className="w-64 h-64 mx-auto bg-gray-700/50 rounded-lg flex items-center justify-center mb-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-gray-400">
                        AI is creating your masterpiece...
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {progress}% complete
                      </p>
                    </div>
                  ) : generatedImage ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group w-full"
                    >
                      <img
                        src={generatedImage}
                        alt="Generated AI art"
                        className="w-full h-auto max-h-[500px] md:max-h-[400px] object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="text-white">
                          <p className="font-medium">Prompt:</p>
                          <p className="text-sm opacity-90">{prompt}</p>
                          <p className="text-xs mt-1 opacity-70">
                            Style: {style}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center p-8">
                      <FiImage className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-300 mb-2">
                        No Image Generated Yet
                      </h3>
                      <p className="text-gray-500">
                        Enter a prompt and click "Generate Image" to create your
                        first AI artwork
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </section>

            {/* Recent Creations */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <HiOutlineSparkles className="mr-2 text-yellow-400" />
                Recent Creations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {history.slice(0, 4).map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 cursor-pointer"
                    onClick={() => {
                      setGeneratedImage(item.imageUrl);
                      setPrompt(item.prompt);
                      setStyle(item.style);
                    }}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                        <div>
                          <p className="text-xs text-white truncate">
                            {item.prompt}
                          </p>
                          <p className="text-[10px] text-gray-300 mt-1">
                            {formatTime(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm truncate">
                        {item.prompt.substring(0, 30)}
                        {item.prompt.length > 30 ? "..." : ""}
                      </p>
                      <p className="text-xs text-gray-500">{item.style}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-400">
        <p>
          © {new Date().getFullYear()} Endgaming AI Image Generator. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
