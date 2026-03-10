import { useParams, Link } from 'react-router-dom';

export function SubmissionsPage() {
  const { filename } = useParams<{ filename: string }>();

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <Link to="/parts" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to Parts
      </Link>
      <h1 className="text-2xl font-semibold mt-4 text-foreground">
        Submissions for {filename}
      </h1>
      <p className="text-muted-foreground mt-4">Coming soon.</p>
    </div>
  );
}
