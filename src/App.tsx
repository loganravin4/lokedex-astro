import PokedexShell from './components/shell/PokedexShell';
import { PokedexProvider } from './hooks/usePokedex';
import ClarityInit from './analytics/ClarityInit';

export default function App() {
  return (
    <PokedexProvider>
      {/* Mounts once, injects the Clarity tag, renders nothing. */}
      <ClarityInit />
      <PokedexShell />
    </PokedexProvider>
  );
}
