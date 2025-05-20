import logo from "@/assets/logo.svg";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-6 w-6" }: LogoProps) {
  return <img src={logo} alt="Elevatify Logo" className={className} />;
} 