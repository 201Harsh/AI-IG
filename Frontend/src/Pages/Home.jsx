import { useState, useEffect } from "react";
import {
  FiImage,
  FiDownload,
  FiShare2,
  FiSettings,
  FiClock,
  FiTrash2,
  FiSquare,
  FiMonitor,
  FiSmartphone,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Axios from "../Config/Axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("UltraReal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [orientation, setOrientation] = useState("portrait");
  const [credits, setCredits] = useState(() => {
    // Initialize credits from localStorage or default to 2
    const savedCredits = localStorage.getItem("credits");
    return savedCredits ? parseInt(savedCredits) : 5;
  });

  const Navigate = useNavigate();

  // Sample styles for the AI generator
  const styles = [
    { value: "UltraReal", label: "UltraReal" },
    { value: "realistic", label: "Realistic" },
    { value: "fantasy", label: "Fantasy" },
    { value: "anime", label: "Anime" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "abstract", label: "Abstract" },
    { value: "cartoon", label: "Cartoon" },
    { value: "oil_painting", label: "Oil Painting" },
    { value: "sketch", label: "Sketch" },
    { value: "pixel_art", label: "Pixel Art" },
    { value: "3d_render", label: "3D Render" },
    { value: "vintage", label: "Vintage" },
  ];

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("aiImageHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("credits", credits.toString());
  }, [credits]);

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
      .catch((error) => {});
  };

  // Function to add an image to history (in memory only)
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
        // Keep only the last 50 items
        const newHistory = [newHistoryItem, ...prev].slice(0, 50);
        return newHistory;
      });
    } catch (error) {}
  };

  // Optional image URL compressor for data URLs
  const compressImageUrl = (dataUrl) => {
    if (!dataUrl.startsWith("data:image")) return dataUrl;

    try {
      const img = new Image();
      img.src = dataUrl;
      const canvas = document.createElement("canvas");
      canvas.width = 200; // Thumbnail width
      canvas.height = 200 * (img.height / img.width);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.7);
    } catch {
      return dataUrl;
    }
  };

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

    if (credits <= 0) {
      toast.error("You've reached your credit limit", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    if (credits === 5) {
      toast.success("Enjoying So Help Me...", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });

      setTimeout(() => {
        window.location.href = "https://www.instagram.com/201harshs/";
      }, 2000);
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedImage(null);

    // Start a continuous progress counter
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Stop at 99% until we get the response
        return prev < 99 ? prev + 1 : prev;
      });
    }, 100); // Adjust timing as needed (100ms = 10 steps per second)

    try {
      const response = await Axios.post(
        "/ai/imageGen",
        {
          prompt,
          style,
          orientation,
        },
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const uploadProgress = Math.round(
                (progressEvent.loaded * 0) / progressEvent.total
              );
              setProgress((prev) => Math.max(prev, uploadProgress));
            }
          },
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const downloadProgress =
                50 +
                Math.round((progressEvent.loaded * 90) / progressEvent.total);
              setProgress((prev) => Math.max(prev, downloadProgress));
            }
          },
        }
      );

      if (response.status === 200) {
        // Only decrement credits if the generation was successful
        setCredits((prev) => {
          const newCredits = prev - 1;
          if (newCredits <= 0) {
            toast.info("You've reached your credit limit", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            });
          }
          return newCredits;
        });

        const newImage = response.data.image;
        if (!newImage) throw new Error("No image URL returned");

        setProgress(100);
        setGeneratedImage(newImage);
        addToHistory(newImage, prompt, style);
      }
    } catch (error) {
      clearInterval(progressInterval);

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
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error, {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        // Generic error
        toast.error("Failed to generate this image.", {
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
    "Image of Lord Ram and Sita",
    "Image of Lord Shiva",
    "A old village in between Mountains with a lake",
    "A Girl in a Flower Field",
    "A Beautiful Landscape with Lake",
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

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentFullscreenImage, setCurrentFullscreenImage] = useState(null);

  // Add this function to handle fullscreen toggling
  const toggleFullscreen = (imageUrl) => {
    setCurrentFullscreenImage(imageUrl);
    setIsFullscreen(!isFullscreen);
  };

  const LogOutHandle = () => {
    localStorage.clear();
    toast.success("Logged Out Successfully", {
      position: "top-right",
      autoClose: 5000,
      theme: "dark",
    });
    setTimeout(() => {
      Navigate("/");
    }, 2000);
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
      <header className="flex relative justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <HiOutlineSparkles className="w-6 h-6 text-purple-400" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            EndPix AI
          </span>
          <button
            onClick={LogOutHandle}
            className="absolute right-2 md:hidden cursor-pointer px-4 py-2 rounded-md bg-red-700 hover:bg-red-700 transition"
          >
            LogOut
          </button>
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
          <button
            onClick={LogOutHandle}
            className="cursor-pointer px-4 py-2 rounded-md bg-red-700 hover:bg-red-700 transition"
          >
            LogOut
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
                      placeholder="Make Images With EndGaming AI"
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
                            Image Orientation
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setOrientation("square")}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center ${
                                orientation === "square"
                                  ? "bg-blue-600 text-white border-blue-500"
                                  : "bg-gray-700/50 border border-gray-600 hover:bg-gray-700"
                              }`}
                            >
                              <FiSquare className="mr-2" /> Square
                            </button>
                            <button
                              onClick={() => setOrientation("landscape")}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center ${
                                orientation === "landscape"
                                  ? "bg-blue-600 text-white border-blue-500"
                                  : "bg-gray-700/50 border border-gray-600 hover:bg-gray-700"
                              }`}
                            >
                              <FiMonitor className="mr-2" /> Landscape
                            </button>
                            <button
                              onClick={() => setOrientation("portrait")}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center ${
                                orientation === "portrait"
                                  ? "bg-blue-600 text-white border-blue-500"
                                  : "bg-gray-700/50 border border-gray-600 hover:bg-gray-700"
                              }`}
                            >
                              <FiSmartphone className="mr-2" /> Portrait
                            </button>
                          </div>
                        </div>

                        {/* Orientation Preview */}
                        <div className="pt-2">
                          <div className="relative">
                            <div
                              className={`mx-auto bg-gray-700/30 border border-gray-600 rounded-md overflow-hidden ${
                                orientation === "square"
                                  ? "aspect-square w-40"
                                  : orientation === "landscape"
                                  ? "aspect-video w-48"
                                  : "aspect-[9/16] w-32"
                              }`}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <FiImage className="text-gray-500" />
                              </div>
                              <div className="absolute bottom-2 left-2 right-2 text-center">
                                <p className="text-xs text-gray-400 truncate">
                                  {orientation === "square" && "1:1 (Square)"}
                                  {orientation === "landscape" &&
                                    "16:9 (Landscape)"}
                                  {orientation === "portrait" &&
                                    "9:16 (Portrait)"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: credits > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: credits > 0 ? 0.98 : 1 }}
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim() || credits <= 0}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
                    isGenerating || !prompt.trim() || credits <= 0
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  }`}
                >
                  {credits <= 0 ? (
                    "No Credits Left"
                  ) : isGenerating ? (
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
                    <button
                      className={`p-2 rounded-lg ${
                        !generatedImage
                          ? "text-gray-500 cursor-not-allowed"
                          : "hover:bg-gray-700"
                      }`}
                      disabled={!generatedImage}
                    >
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
                      <motion.div
                        className="relative w-64 h-64 mx-auto"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Glowing outer ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-blue-400/20"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(96, 165, 250, 0.3)",
                              "0 0 0 10px rgba(96, 165, 250, 0)",
                              "0 0 0 20px rgba(96, 165, 250, 0)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />

                        {/* Animated gradient circle */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <defs>
                            <linearGradient
                              id="progressGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="50%" stopColor="#6366F1" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#1F2937"
                            strokeWidth="6"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * progress) / 100}
                            transform="rotate(-90 50 50)"
                            initial={{ strokeDashoffset: 283 }}
                          />
                        </svg>

                        {/* Floating AI icon with pulse animation */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.div
                            className="relative"
                            animate={{
                              y: [0, -10, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <motion.div
                              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                              animate={{
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <HiOutlineSparkles className="w-10 h-10 text-white" />
                            </motion.div>

                            {/* Subtle floating dots */}
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute rounded-full bg-blue-400"
                                style={{
                                  width: 6,
                                  height: 6,
                                  left: `${
                                    Math.cos((i * 45 * Math.PI) / 180) * 30 + 50
                                  }%`,
                                  top: `${
                                    Math.sin((i * 45 * Math.PI) / 180) * 30 + 50
                                  }%`,
                                }}
                                animate={{
                                  scale: [0.8, 1.2, 0.8],
                                  opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </motion.div>

                          {/* Animated progress text */}
                          <motion.p
                            className="text-gray-300 mt-6 text-lg font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            Creating magic...
                          </motion.p>

                          {/* Progress percentage with count-up animation */}
                          <motion.p
                            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-2xl font-bold mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            {Math.round(progress)}%
                          </motion.p>
                        </div>
                      </motion.div>

                      {/* Subtle animated dots below */}
                      <div className="flex justify-center mt-8 space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            animate={{
                              y: [0, -5, 0],
                              opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>

                      <motion.p
                        className="text-xs text-gray-400 mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Crafting your masterpiece with AI magic
                      </motion.p>
                    </div>
                  ) : generatedImage ? (
                    <>
                      {isFullscreen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                          onClick={() => setIsFullscreen(false)}
                        >
                          <div className="relative max-w-full max-h-full">
                            <button
                              className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFullscreen(false);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>

                            <motion.img
                              src={generatedImage}
                              alt="Fullscreen preview"
                              className="max-w-full max-h-screen object-contain"
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFullscreen(false);
                              }}
                            />

                            <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 p-2">
                              <p className="text-sm">{prompt}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group w-full cursor-zoom-in"
                        onClick={() => setIsFullscreen(true)}
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
                    </>
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
                {history.slice(0, 10).map((item) => (
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
          © {new Date().getFullYear()} Endpix AI Image Generator. All rights
          reserved | Powered by{" "}
          <a
            className="text-blue-500 font-bold"
            href="https://emoaichatbot.onrender.com/"
          >
            Endgaming AI
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
