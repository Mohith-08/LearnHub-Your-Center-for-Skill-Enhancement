
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="text-brand-text">
      <div className="relative h-[60vh] md:h-[70vh] bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/1600/900?grayscale&blur=2)` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Small App, Big Dreams
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
              Elevating Your Education
            </p>
            <Link 
              to="/dashboard"
              className="bg-brand-primary hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="py-16 bg-brand-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-brand-primary text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Expert-Led Courses</h3>
              <p className="text-brand-light-text">Learn from industry professionals with real-world experience.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-brand-primary text-5xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-2">Flexible Learning</h3>
              <p className="text-brand-light-text">Access courses anytime, anywhere, and learn at your own pace.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-brand-primary text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-2">Career Growth</h3>
              <p className="text-brand-light-text">Gain valuable skills and earn certificates to advance your career.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
