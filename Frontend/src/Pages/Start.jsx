import { useState, useEffect } from "react";
import {
  FiDownload,
  FiImage,
  FiCpu,
  FiSliders,
  FiArrowRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Start = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const Navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sample features data
  const features = [
    {
      icon: <HiOutlineSparkles className="w-8 h-8" />,
      title: "AI-Powered Creativity",
      description:
        "Generate stunning images with cutting-edge AI technology from Endgaming AI",
    },
    {
      icon: <FiSliders className="w-8 h-8" />,
      title: "Customizable Outputs",
      description: "Fine-tune your results with advanced parameters and styles",
    },
    {
      icon: <FiDownload className="w-8 h-8" />,
      title: "Instant Downloads",
      description: "Get high-resolution images ready for your projects",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
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
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 fixed z-50 md:top-4 top-2 left-0 right-0 bg-gray-950/30 bg-opacity-50 backdrop-blur-lg p-5 rounded-lg shadow-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <FiCpu className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              EndPix AI
            </span>
          </motion.div>

          <Link
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-medium shadow-lg"
            to="/home"
          >
            Sign In
          </Link>
        </header>

        {/* Hero section */}
        <section className="text-center mb-24 md:mt-8 mt-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AI Image Generator
            </span>
            <br />
            Powered by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-300 to-pink-400">
              Endgaming AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Transform your ideas into stunning visual art with our advanced AI
            technology. Create unique images in seconds with just a few clicks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/home">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(96, 165, 250, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-bold shadow-xl flex items-center mx-auto"
              >
                Get Started <FiArrowRight className="ml-2" />
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* Features section */}
        <section className="mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Why Choose Our AI Generator?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-xl border border-gray-700"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Demo section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 bg-opacity-50 rounded-2xl overflow-hidden border border-gray-700"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <FiImage className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold">Try It Out</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-300 mb-6">
                    Enter a description and let our AI create a unique image for
                    you. Experiment with different styles and settings.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Prompt
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Describe the image you want to generate..."
                        className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Style
                      </label>
                      <select className="w-full bg-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Realistic</option>
                        <option>Digital Art</option>
                        <option>Fantasy</option>
                        <option>Anime</option>
                        <option>Watercolor</option>
                      </select>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 rounded-md font-medium flex items-center justify-center"
                      onClick={() => {
                        toast.error("Login to generate image", {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: false,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                          transition: Bounce,
                        });

                        setTimeout(() => {
                          Navigate("/home");
                        }, 1500);
                      }}
                    >
                      Generate Image
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center justify-center bg-gray-900 rounded-lg min-h-[300px] max-h-[350px] overflow-hidden">
                  {generatedImage ? (
                    <motion.img
                      src={generatedImage}
                      alt="Generated AI art"
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div className="text-center p-6">
                      <FiImage className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Your generated image will appear here
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        Try "sunset over mountains" or "cyberpunk cityscape"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample prompts section */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Try these prompts:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Majestic lion in savanna",
                    "Futuristic neon city",
                    "Watercolor landscape",
                    "Cyberpunk samurai",
                    "Surreal dreamscape",
                  ].map((prompt) => (
                    <motion.button
                      key={prompt}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-3 py-1.5 text-sm bg-gray-700 rounded-full text-gray-300"
                      onClick={() => {
                        // Set the prompt in the input field
                        document.querySelector('input[type="text"]').value =
                          prompt;
                      }}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 md:p-12 rounded-2xl border border-blue-500/30"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Create Amazing AI Art?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators using our AI Image Generator to bring
              their ideas to life.
            </p>
            <Link to="/home">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 cursor-pointer py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-bold shadow-xl"
              >
                Get Started Now
              </motion.button>
            </Link>
          </motion.div>
        </section>

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
    </div>
  );
};

export default Start;
