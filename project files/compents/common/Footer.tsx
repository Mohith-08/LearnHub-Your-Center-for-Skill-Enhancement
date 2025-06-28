
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-8 border-t">
      <div className="container mx-auto px-6 py-4 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Copyright: Study App
      </div>
    </footer>
  );
};

export default Footer;
