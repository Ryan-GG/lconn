import { Link } from 'react-router-dom';
import type { LdrawPartSummary } from '@lconn/shared';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartTileViewer } from './PartTileViewer';
import { useInView } from '@/hooks/useInView';

interface PartTileProps {
  part: LdrawPartSummary;
}

export function PartTile({ part }: PartTileProps) {
  const { ref, inView } = useInView();
  const partNumber = part.filename.replace(/\.dat$/i, '');

  return (
    <Card ref={ref} className="flex flex-col overflow-hidden">
      <PartTileViewer filename={part.filename} enabled={inView} />
      <CardContent className="flex-1 p-3">
        <p className="text-sm font-semibold text-foreground">{partNumber}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {part.description}
        </p>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/parts/${part.filename}/submissions`}>Submissions</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
