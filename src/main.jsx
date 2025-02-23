import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css';
import App from './components/App/App'
import { MoviesProvider } from "./contexts/MoviesContext.jsx";
import { GenresProvider } from "./contexts/GenresContext";

createRoot(document.getElementById('root')).render(
    <GenresProvider>
    <MoviesProvider>
        <App />
    </MoviesProvider>
    </GenresProvider>
)
