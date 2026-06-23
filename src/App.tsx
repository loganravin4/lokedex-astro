import PokedexShell from './components/shell/PokedexShell';
import { PokedexProvider } from './hooks/usePokedex';

export default function App() {
  return (
    <PokedexProvider>
      <PokedexShell />
    </PokedexProvider>
  );
}
