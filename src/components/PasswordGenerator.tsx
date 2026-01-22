import { useState, useCallback, useEffect } from "react";
import { Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const calculateStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  if (score <= 2) return { score: 25, label: "Weak", color: "bg-strength-weak" };
  if (score <= 4) return { score: 50, label: "Fair", color: "bg-strength-fair" };
  if (score <= 5) return { score: 75, label: "Good", color: "bg-strength-good" };
  return { score: 100, label: "Strong", color: "bg-strength-strong" };
};

const StrengthIcon = ({ score }: { score: number }) => {
  if (score <= 25) return <ShieldAlert className="w-5 h-5 text-strength-weak" />;
  if (score <= 50) return <Shield className="w-5 h-5 text-strength-fair" />;
  return <ShieldCheck className="w-5 h-5 text-strength-strong" />;
};

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = useCallback(() => {
    let charset = "";
    if (options.lowercase) charset += LOWERCASE;
    if (options.uppercase) charset += UPPERCASE;
    if (options.numbers) charset += NUMBERS;
    if (options.symbols) charset += SYMBOLS;

    if (!charset) {
      setPassword("");
      return;
    }

    let newPassword = "";
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < options.length; i++) {
      newPassword += charset[array[i] % charset.length];
    }
    
    setPassword(newPassword);
  }, [options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = calculateStrength(password);
  const hasAnyOption = options.lowercase || options.uppercase || options.numbers || options.symbols;

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      {/* Password Display */}
      <div className="relative group">
        <div className="password-display">
          <span className="password-text">
            {password || "Select at least one option"}
          </span>
        </div>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={generatePassword}
            disabled={!hasAnyOption}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            disabled={!password}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-strength-strong" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Strength Meter */}
      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <StrengthIcon score={strength.score} />
              <span className="text-muted-foreground">Password Strength</span>
            </div>
            <span className="font-medium text-foreground">{strength.label}</span>
          </div>
          <div className="strength-meter-track">
            <div
              className={`strength-meter-fill ${strength.color}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-6 p-6 rounded-xl bg-card border border-border">
        {/* Length Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Length</Label>
            <span className="text-sm font-mono font-medium text-foreground bg-muted px-2 py-1 rounded">
              {options.length}
            </span>
          </div>
          <Slider
            value={[options.length]}
            onValueChange={(value) => setOptions({ ...options, length: value[0] })}
            min={4}
            max={32}
            step={1}
            className="cursor-pointer"
          />
        </div>

        {/* Toggle Options */}
        <div className="grid grid-cols-2 gap-4">
          <OptionToggle
            label="Lowercase (a-z)"
            checked={options.lowercase}
            onChange={(checked) => setOptions({ ...options, lowercase: checked })}
          />
          <OptionToggle
            label="Uppercase (A-Z)"
            checked={options.uppercase}
            onChange={(checked) => setOptions({ ...options, uppercase: checked })}
          />
          <OptionToggle
            label="Numbers (0-9)"
            checked={options.numbers}
            onChange={(checked) => setOptions({ ...options, numbers: checked })}
          />
          <OptionToggle
            label="Symbols (!@#$)"
            checked={options.symbols}
            onChange={(checked) => setOptions({ ...options, symbols: checked })}
          />
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={generatePassword}
        disabled={!hasAnyOption}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Generate New Password
      </Button>
    </div>
  );
}

function OptionToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <Label className="text-sm text-foreground cursor-pointer">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
