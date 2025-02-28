import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import App from './components/App/App';
import { MoviesProvider } from "./contexts/MoviesContext";
import { GenresProvider } from "./contexts/GenresContext";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GenresProvider>
            <MoviesProvider>
                <App />
            </MoviesProvider>
        </GenresProvider>
    </StrictMode>
);
