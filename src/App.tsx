
import { Providers } from "@/app/providers/Providers";
import { AppRouter } from "@/app/router/AppRouter";

const App = () => (
  <Providers>
    <AppRouter />
  </Providers>
);

export default App;
