export default function Home() {
  return (
    <main style={{ padding: '1rem' }}>
      <h1>Welcome</h1>
      <p>
        VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL ?? '(not set)'}
      </p>
    </main>
  );
}
