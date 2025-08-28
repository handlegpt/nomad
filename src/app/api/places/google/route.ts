import { GooglePlacesService } from '@/lib/google-places-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Osaka';
  const lat = parseFloat(searchParams.get('lat') || '34.6937');
  const lng = parseFloat(searchParams.get('lng') || '135.5023');
  
  try {
    const googleService = new GooglePlacesService();
    const places = await googleService.searchNomadFriendlyPlaces(city, lat, lng);
    
    return Response.json({ places });
  } catch (error) {
    console.error('Error fetching Google Places:', error);
    return Response.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
