import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import Home from "@/pages/Home";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsConditions from "@/pages/TermsConditions";
import DriverTerms from "@/pages/DriverTerms";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import { trackPageView } from "@/lib/analytics";

function Analytics() {
  const [location] = useLocation();
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <Analytics />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsConditions} />
        <Route path="/driver-terms" component={DriverTerms} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
