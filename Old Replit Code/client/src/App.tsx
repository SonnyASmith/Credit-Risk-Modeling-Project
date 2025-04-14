import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Application from "@/pages/application";
import About from "@/pages/about";
import HowItWorks from "@/pages/how-it-works";
import FAQ from "@/pages/faq";

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Switch key={location}>
        <Route path="/" component={Home} />
        <Route path="/application" component={Application} />
        <Route path="/about" component={About} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/faq" component={FAQ} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
