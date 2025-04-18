import { Route, Switch } from "wouter";
import HomeScreen from "./screens/HomeScreen";
import AuthScreen from "./screens/AuthScreen";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Switch>
          <Route path="/chat" component={HomeScreen} nest />
          <Route path="/auth" component={AuthScreen} />
        </Switch>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
