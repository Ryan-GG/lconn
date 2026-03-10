import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const HomePage = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className="text-center py-16">
        <h1 className="text-6xl m-0 text-foreground">LCONN</h1>
        <p className="text-2xl text-muted-foreground mt-2">
          Crowdsourced LEGO Connection Specifications
        </p>
        <p className="text-lg text-muted-foreground max-w-[800px] mx-auto mt-8 leading-relaxed">
          Welcome to LCONN. Sign in with GitHub to get started.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/parts" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded no-underline text-lg font-semibold">
            Browse Parts
          </Link>
          <a href={`${API_URL}/api/docs`} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded no-underline text-lg font-semibold">
            API Docs
          </a>
        </div>
      </div>
    </div>
  );
};
