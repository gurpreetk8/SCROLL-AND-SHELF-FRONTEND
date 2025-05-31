import React from 'react';
import { Link } from 'react-router-dom';

const RequestBookLanding = () => {
  return (
    <div>
      <h1>Request a Book</h1>
      <p>Looking for a specific book? Let us know.</p>
      
      <Link to="/request-book">
        <button>
          Go to Request Form
        </button>
      </Link>
    </div>
  );
};

export default RequestBookLanding;