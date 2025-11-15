import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ padding: '1rem' }}>
      <h1>404</h1>
      <p>
        Page not found. Go <Link to="/">home</Link>.
      </p>
    </main>
  );
}
