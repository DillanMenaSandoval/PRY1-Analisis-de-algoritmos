import Header from './Header.jsx';
import './layout.css';

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        Mochila 0/1 exacta · Tiempo O(n·W) · Memoria O(n·W)
      </footer>
    </div>
  );
}

export default MainLayout;
