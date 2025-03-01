import { useNavigate } from "react-router-dom"; // Import useNavigate
import Logo from "./dashboard/charts/logo/Logo";
import { SupervisedUserCircleOutlined } from "@mui/icons-material";

const Intro = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGetStarted = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-100 to-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Take control of <span className="text-blue-600">Your Money</span>
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Personal financing is the secret to financial freedom. Start your
          journey today with tools that help you track, manage, and grow your
          wealth.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Join thousands of satisfied users who are achieving their financial
          goals with our user-friendly platform.
        </p>
        <button
          onClick={handleGetStarted} // Handle button click
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <span>Get Started</span>
          <SupervisedUserCircleOutlined className="ml-2" />
        </button>
      </div>
      <div className="mt-10 py-20">
        <Logo />
      </div>
      <footer className="mt-10 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Financio. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Intro;
