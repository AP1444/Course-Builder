import { useEffect, useState, useRef } from 'react';

const OutlineSidebar = ({ modules }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      let foundIdx = 0;
      modules.forEach((module, idx) => {
        const el = document.getElementById(`module-${module.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2) {
            foundIdx = idx;
          }
        }
      });
      setActiveIdx(foundIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [modules]);

  const handleClick = idx => {
    const module = modules[idx];
    const el = document.getElementById(`module-${module.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="outline-sidebar-fixed-plain">
      <div className="outline-pipe-list-plain" ref={listRef}>
        <div className="outline-pipe-plain">
          {modules.map((_, idx) => (
            <div
              key={idx}
              className={`outline-pipe-segment-plain${
                activeIdx === idx ? ' active' : ''
              }`}
            />
          ))}
        </div>
        <ul className="outline-list-plain">
          {modules.map((module, idx) => (
            <li
              key={module.id}
              className={`outline-list-item-plain${
                activeIdx === idx ? ' active' : ''
              }`}
              onClick={() => handleClick(idx)}
            >
              {module.name}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default OutlineSidebar;
