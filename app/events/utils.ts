export async function getEvents() {
    const res = await fetch(
      'https://api.sheetbest.com/sheets/18fc5c53-3ee1-44bf-a147-dda2473191fd',
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data;
  }