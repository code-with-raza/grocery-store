import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="render-error"><span><CircleAlert size={24}/></span><h1>We hit a little snag.</h1><p>Reload the page to get back to your Good Basket.</p><button onClick={() => window.location.reload()}>Reload storefront</button></main>;
  }
}
import { CircleAlert } from "lucide-react";

