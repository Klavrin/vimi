import './sidebar.css';

function InteractiveZone() {
  return (
    <div
      className="interactive-zone"
      onMouseOver={() => console.log('sidebar visible')}
      onMouseLeave={() => console.log('sidebar invisible')}
    />
  );
}

export default InteractiveZone;
