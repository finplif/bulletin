import ExhibitionsClient from './ExhibitionsClient';
import { getExhibitions } from '../utils';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const allExhibitions = await getExhibitions();

  return (
    <>
      <ExhibitionsClient allExhibitions={allExhibitions} />
    </>
  );
}
