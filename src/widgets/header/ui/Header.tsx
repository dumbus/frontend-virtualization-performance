import { useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();

  const currentPath = location.pathname.replace(/^\//, '');

  const menuItems = [
    { path: '', label: 'Настройки' },
    { path: 'ag-grid', label: 'ag-grid' },
    { path: 'handsontable', label: 'handsontable' },
    { path: 'react-virtualized', label: 'react-virtualized' },
    { path: 'react-virtuoso', label: 'react-virtuoso' },
    { path: 'react-window', label: 'react-window' },
    { path: 'slickgrid', label: 'slickgrid' },
    { path: 'tanstack-virtual', label: 'tanstack-virtual' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        height: '64px',
        padding: '10px 64px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd'
      }}
    >
      {menuItems.map((item) => (
        <a
          className="menu-link"
          key={item.path}
          href={`/${item.path}`}
          style={{
            color: currentPath === item.path ? '#1890ff' : '#333',
            fontWeight: currentPath === item.path ? 'bold' : 'normal',
            textDecoration: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            backgroundColor: currentPath === item.path ? '#e6f7ff' : 'transparent',
            transition: 'all 0.3s ease'
          }}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
};
