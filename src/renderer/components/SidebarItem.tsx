import React, { useState } from 'react';

type SidebarItemProps = {
  item:
    | { name: string; path: string; type: 'file' }
    | {
        name: string;
        children: SidebarItemProps[];
        type: 'directory';
      };
};

function SidebarItem({ item }: SidebarItemProps) {
  const [dirFilesVisible, setDirFilesVisible] = useState(false);
  // const containerRef = useRef<any>(null);

  // useEffect(() => {
  //   const handleKeyDown = (e: any) => {
  //     if (containerRef.current) {
  //       const interactiveElements: any = Array.from(
  //         containerRef.current.querySelectorAll('button'),
  //       );

  //       if (e.key === 'j') {
  //         e.preventDefault();
  //         const currentIndex = interactiveElements.indexOf(
  //           document.activeElement,
  //         );
  //         const nextIndex =
  //           currentIndex === interactiveElements.length - 1
  //             ? 0
  //             : currentIndex + 1;
  //         interactiveElements[nextIndex].focus();
  //       } else if (e.key === 'k') {
  //         e.preventDefault();
  //         const currentIndex = interactiveElements.indexOf(
  //           document.activeElement,
  //         );
  //         const prevIndex =
  //           currentIndex === 0
  //             ? interactiveElements.length - 1
  //             : currentIndex - 1;
  //         interactiveElements[prevIndex].focus();
  //       }
  //     }
  //   };

  //   document.addEventListener('keydown', handleKeyDown);

  //   return () => document.removeEventListener('keydown', handleKeyDown);
  // }, []);

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setDirFilesVisible(!dirFilesVisible);
  };

  // Render file
  if (item.type === 'file')
    return (
      <button type="button" key={item.path} className="note">
        FILE: {item.name}
      </button>
    );

  // Render directory
  return (
    <button
      type="button"
      key={item.name}
      className="note"
      onClick={handleButtonClick}
    >
      DIR: {item.name}
      {dirFilesVisible && (
        <div className="directory-container">
          {/* TODO: Write a type for the child prop */}
          {item.children.map((child: any) => (
            <SidebarItem key={child.name} item={child} />
          ))}
        </div>
      )}
    </button>
  );
}

export default SidebarItem;
