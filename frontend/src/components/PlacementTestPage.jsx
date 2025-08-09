import React from 'react';
import PlacementTest from '../components/PlacementTest';
import { Link } from 'react-router-dom';

const PlacementTestPage = ({ user }) => {
  const handleTestComplete = (results) => {
    // You can handle the completion here, e.g., update user context or redirect
    console.log('Test completed:', results);
  };

  return (
    <div className="placement-test-page p-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/"
          className="text-blue-600 hover:text-blue-800 inline-block mb-6"
        >
          ← Back to lessons
        </Link>
        
        <div className="bg-white rounded-lg shadow p-6">
          <PlacementTest 
            userId={user?.id} 
            onComplete={handleTestComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default PlacementTestPage;
