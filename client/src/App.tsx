import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { NavBar } from "./components/nav-bar";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";
import Home from "./pages/home";
import AdminDashboard from "./pages/admin/dashboard";
import Auth from "./pages/auth";
import TireForm from "./pages/admin/tire-form";
import SeasonalTires from "./pages/admin/tires/[season]";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <ProtectedRoute
        path="/admin"
        component={AdminDashboard}
        requireAdmin
      />
      <ProtectedRoute
        path="/admin/tires/new"
        component={TireForm}
        requireAdmin
      />
      <ProtectedRoute
        path="/admin/tires/:id/edit"
        component={TireForm}
        requireAdmin
      />
      <ProtectedRoute
        path="/admin/tires/:season"
        component={SeasonalTires}
        requireAdmin
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen">
          <NavBar />
          <Router />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;