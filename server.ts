import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env['PORT'] || 3000;
const API_KEY = process.env['MOVIES_API_KEY'];
const BASE_URL = 'https://www.omdbapi.com/';

interface OMDbResponse {
  Response: 'True' | 'False';
  Error?: string;
  Search?: any[];
  [key: string]: any;
}

if (!API_KEY) {
  throw new Error(' API key is missing in .env');
}

async function fetchFromBFF(params: Record<string, string>): Promise<OMDbResponse> {
  const urlParams = new URLSearchParams({ ...params, apikey: API_KEY! }); // el ! garantiza que no es undefined
  const response = await fetch(`${BASE_URL}?${urlParams.toString()}`);

  if (!response.ok) throw new Error(` API error: ${response.status}`);

  const json = (await response.json()) as OMDbResponse;

  if (json.Response === 'False') throw new Error(json.Error);

  return json;
}
// 🎬 Buscar películas
app.get('/api/movies', async (req, res) => {
  try {
    const query = (req.query['query'] as string) || 'movie';
    const page = (req.query['page'] as string) || '1';

    const data = await fetchFromBFF({ s: query, type: 'movie', page });

    // Obtener detalles completos
    const movies = await Promise.all((data.Search || []).map((movie: any) => fetchFromBFF({ i: movie.imdbID })));

    return res.json(movies);
  } catch (error: any) {
    console.error('Error fetching movies:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Detalles de película
app.get('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromBFF({ i: id });
    return res.json(data);
  } catch (error: any) {
    console.error('Error fetching movie details:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Listado de series
app.get('/api/series', async (req, res) => {
  try {
    const page = (req.query['page'] as string) || '1';
    const data = await fetchFromBFF({ s: 'series', type: 'series', page });

    const series = await Promise.all((data.Search || []).map((serie: any) => fetchFromBFF({ i: serie.imdbID })));

    return res.json(series);
  } catch (error: any) {
    console.error('Error fetching series:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Estrenos recientes
app.get('/api/premieres', async (req, res) => {
  try {
    const page = (req.query['page'] as string) || '1';
    const year = new Date().getFullYear().toString();

    const data = await fetchFromBFF({
      s: 'movie',
      type: 'movie',
      y: year,
      page,
    });

    const movies = await Promise.all((data.Search || []).map((movie: any) => fetchFromBFF({ i: movie.imdbID })));

    return res.json(movies);
  } catch (error: any) {
    console.error('Error fetching premieres:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Búsqueda general
app.get('/api/search', async (req, res) => {
  try {
    // Recibir query desde query params
    const query = (req.query['query'] as string) || '';

    if (!query || query.length < 3) {
      return res.status(400).json({ message: 'Query must have at least 3 characters' });
    }

    // Realizar búsqueda en películas y series
    const movieReq = fetchFromBFF({ s: query, type: 'movie' });
    const seriesReq = fetchFromBFF({ s: query, type: 'series' });

    const [moviesData, seriesData] = await Promise.all([movieReq, seriesReq]);

    // Obtener detalles completos de cada resultado
    const movies = await Promise.all((moviesData.Search || []).map((m: any) => fetchFromBFF({ i: m.imdbID })));

    const series = await Promise.all((seriesData.Search || []).map((s: any) => fetchFromBFF({ i: s.imdbID })));

    return res.json({ movies, series });
  } catch (error: any) {
    console.error('Error fetching search results:', error.message);
    return res.status(500).json({ message: error.message || 'Error fetching search results' });
  }
});

app.listen(PORT, () => {
  console.log(`BFF server running on http://localhost:${PORT}`);
});
