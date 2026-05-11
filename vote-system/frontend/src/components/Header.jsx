function Header({ activePage, navigateToPage }) {
  const pages = [
    { id: 'vote', label: 'Vote', path: '/vote' },
    { id: 'results', label: 'Résultats', path: '/results' },
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-branding">
          <h2>Election 2026</h2>
        </div>

        <nav className="header-nav">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              className={`header-nav-link ${activePage === page.id ? 'active' : ''}`}
              onClick={() => navigateToPage(page.id)}
              title={`Aller vers ${page.label}`}
            >
              <span className="nav-label">{page.label}</span>
              <span className="nav-path">{page.path}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
