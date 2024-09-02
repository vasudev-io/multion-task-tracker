import React, { useState, useEffect } from 'react';

const messages = [
  "Wrangling pixels and herding bytes...",
  "Teaching AI to juggle ones and zeros...",
  "Convincing the internet gremlins to cooperate...",
  "Untangling the web of infinite possibilities...",
  "Politely asking the server to hurry up...",
  "I swear I am trying my best...",
  "Ahhhh, it's just not working, or is it....!"
];

const LoadingSpinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-sm font-semibold text-gray-600">{messages[messageIndex]}</p>
    </div>
  );
};

export default LoadingSpinner;