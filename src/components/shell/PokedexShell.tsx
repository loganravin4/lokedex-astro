import LeftHalf from './LeftHalf';
import Hinge from './Hinge';
import RightHalf from './RightHalf';

// Outer plastic housing. Centers the device on the dark backdrop and
// lays out the two halves around the hinge (Section 7 / Section 8).
export default function PokedexShell() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--page-bg)',
      }}
    >
      <div
        className="pokedex-shell"
        style={{
          width: 'var(--device-width)',
          height: 'var(--device-height)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
      >
        <LeftHalf />
        <Hinge />
        <RightHalf />
      </div>
    </div>
  );
}
