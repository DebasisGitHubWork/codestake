import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "../../lib/AuthContext";
import { useAuth } from "../../lib/AuthContext";
import Login from "../Login";
import Register from "../Register";
import Dashboard from "../Dashboard";
import Challenges from "../Challenges";
import ProtectedRoute from "../../components/ProtectedRoute";
import { CheckIcon, GithubIcon } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";

// Enhance global fetch for debugging
const enhanceFetch = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async function(...args) {
    console.log('📡 Fetch Request:', args[0], args[1] || {});
    
    try {
      const response = await originalFetch.apply(this, args);
      
      // Clone the response so we can read the body
      const responseClone = response.clone();
      
      // Log response information
      console.log('📡 Fetch Response:', {
        url: args[0],
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = await responseClone.json();
          console.log('📡 Response JSON:', data);
        } catch (error) {
          console.error('📡 Error parsing JSON response:', error);
        }
      }
      
      return response;
    } catch (error) {
      console.error('📡 Fetch Error:', error, 'Request:', args[0]);
      throw error;
    }
  };
};

// Main Frame component
export const Frame = (): JSX.Element => {
  // Set up enhanced fetch for debugging
  useEffect(() => {
    enhanceFetch();
    console.log('📡 Enhanced fetch API for debugging');
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenges" 
            element={
              <ProtectedRoute>
                <Challenges />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Home page component
const HomePage = (): JSX.Element => {
  const { user } = useAuth();
  
  // Pricing plan data
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      popular: false,
      description: "Basic features for solo coders",
      features: [
        "Deadline Extension",
        "Extra reward on task completion",
        "Some Stake amount will be credited if failed.",
        "Automated peer group joining",
      ],
      buttonText: "Get Started",
      buttonVariant: "secondary" as const,
    },
    {
      name: "Pro",
      price: "$12",
      popular: true,
      description: "Everything you need to stay motivated",
      features: [
        "Deadline Extension",
        "Extra reward on task completion",
        "Some Stake amount will be credited if failed.",
        "Automated peer group joining",
      ],
      buttonText: "Go Pro",
      buttonVariant: "default" as const,
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-black">
      <header className="flex items-center justify-between w-full h-[72px] px-4">
        <div className="font-bold text-purple-600 text-[22.9px] leading-8 [font-family:'Inter',Helvetica]">
          CodeStake
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/challenges">
                <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                  Challenges
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white">
                  Log In
                </Button>
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Check if the backend is available before redirecting
                  fetch('http://localhost:5000/api/auth/debug', { method: 'GET' })
                    .then(response => response.json())
                    .then(data => {
                      if (data.githubConfigured) {
                        window.location.href = 'http://localhost:5000/api/auth/github';
                      } else {
                        alert('GitHub authentication is not configured on the server. Please use email/password login instead.');
                      }
                    })
                    .catch(() => {
                      alert('Cannot connect to the server. Please ensure the backend server is running.');
                    });
                }}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white"
              >
                <GithubIcon className="w-4 h-4" />
                <span className="text-[12.9px]">Login with GitHub</span>
              </button>
            </>
          )}
        </div>
      </header>

      <section className="flex flex-col items-center justify-center w-full pt-16 pb-24 text-center">
        <h1 className="font-bold text-purple-600 text-[58.5px] leading-[60px] [font-family:'Inter',Helvetica]">
          Stake Your Code.
        </h1>

        <h2 className="mt-4 font-bold text-purple-600 text-[47.2px] leading-[48px] [font-family:'Inter',Helvetica]">
          Level Up Your Career.
        </h2>

        <p className="max-w-[628px] mt-8 text-gray-400 text-[14.9px] leading-6">
          Join a community of developers who bet on themselves. Create coding
          challenges, stake
          <br />
          crypto, and earn rewards for consistent progress.
        </p>

        <div className="flex gap-4 mt-12">
          {user ? (
            <>
              <Link to="/challenges">
                <Button className="h-12 px-8 text-[17px] bg-purple-600 hover:bg-purple-700">
                  View Challenges
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="h-12 px-8 text-[17px] bg-purple-600 hover:bg-purple-700">
                  Go to Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/register">
              <Button className="h-12 px-8 text-[17px] bg-purple-600 hover:bg-purple-700">
                Create Account
              </Button>
            </Link>
          )}
        </div>
      </section>

      <section className="w-full bg-gray-950 py-16">
        <div className="flex flex-col items-center max-w-6xl mx-auto">
          <h2 className="font-bold text-purple-600 text-[35.7px] leading-10 mb-6 [font-family:'Inter',Helvetica]">
            Choose Your Plan
          </h2>

          <p className="text-gray-400 text-[14.8px] leading-6 mb-16 max-w-[656px] text-center">
            Select a plan that works for you and supercharge your coding
            consistency with accountability
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative ${index === 1 ? "-mt-4" : ""}`}
              >
                <div
                  className={`absolute w-[370px] h-[494px] top-[3px] left-1 rounded-2xl border border-solid border-[#4b556333] rotate-1 backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)] ${
                    plan.popular
                      ? "shadow-[0px_4px_6px_-4px_#a855f74c,0px_10px_15px_-3px_#a855f74c] [background:linear-gradient(118deg,rgba(107,33,168,0.4)_0%,rgba(147,51,234,0.4)_100%)]"
                      : "[background:linear-gradient(119deg,rgba(31,41,55,0.4)_0%,rgba(55,65,81,0.4)_100%)]"
                  }`}
                />

                <Card
                  className={`relative w-[363px] bg-[#111827b2] rounded-lg overflow-hidden border border-solid ${
                    plan.popular ? "border-[#a855f780]" : "border-[#37415180]"
                  } shadow-[0px_1px_2px_#0000000d] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)]`}
                >
                  {plan.popular && (
                    <Badge className="absolute top-0 right-0 px-3 py-1 rounded-[0px_0px_0px_8px] bg-purple-600 text-xs font-bold">
                      POPULAR
                    </Badge>
                  )}

                  <CardHeader className="flex flex-col items-center pt-6 pb-0">
                    <h3
                      className={`text-${plan.popular ? "purple-400" : "white"} ${plan.popular ? "text-2xl" : "text-[19.2px]"} font-bold tracking-[-0.5px]`}
                    >
                      {plan.name}
                    </h3>

                    <div className="flex items-end mt-2">
                      <span className="text-white font-bold text-3xl leading-10">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 text-[14.5px] ml-1">
                        /month
                      </span>
                    </div>

                    <p className="text-gray-400 text-[13px] mt-4">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full ${
                              plan.popular ? "bg-[#9333ea4c]" : "bg-gray-800"
                            } flex items-center justify-center mr-3`}
                          >
                            {plan.popular ? (
                              <CheckIcon className="w-3 h-3" />
                            ) : (
                              <div className="w-2.5 h-0.5 bg-gray-600" />
                            )}
                          </div>
                          <span className="text-gray-300 text-[14.9px] leading-6">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="mt-8">
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full ${
                        plan.popular
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full py-8 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-[14.9px]">
          © 2025 Code Stake. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
