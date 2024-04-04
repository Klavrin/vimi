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
  // Render file
  if (item.type === 'file')
    return (
      <div key={item.path} className="note">
        {item.name}
      </div>
    );

  // Render directory
  return (
    <div key={item.name} className="note">
      {item.name}
      <ul>
        {/* TODO: Write a type for the child prop */}
        {item.children.map((child: any) => (
          <SidebarItem key={child.name} item={child} />
        ))}
      </ul>
    </div>
  );
}

export default SidebarItem;
