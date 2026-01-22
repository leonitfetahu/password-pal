import { Shield } from "lucide-react";
import PasswordGenerator from "@/components/PasswordGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">SecurePass</h1>
        </div>
        <p className="text-muted-foreground">Generate strong, secure passwords instantly</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <PasswordGenerator />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Your passwords are generated locally and never stored</p>
      </footer>
    </div>
  );
};

export default Index;
