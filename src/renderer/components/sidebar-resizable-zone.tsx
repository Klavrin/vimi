import { useEffect } from 'react';
import StyledSidebarResizableZone from './styles/sidebar-resizable-zone.styled';

type SidebarResizableZoneProps = {
  sidebarWidth: number;
  setSidebarWidth: (value: number) => void;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
};

function SidebarResizableZone({
  sidebarWidth,
  setSidebarWidth,
  isDragging,
  setIsDragging,
}: SidebarResizableZoneProps) {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        if (e.clientX > 220) setSidebarWidth(e.clientX);
        else setSidebarWidth(220);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = 'auto';
      localStorage.setItem('sidebar-width', JSON.stringify(sidebarWidth));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <div>
      <StyledSidebarResizableZone onMouseDown={handleMouseDown} />
    </div>
  );
}

export default SidebarResizableZone;
