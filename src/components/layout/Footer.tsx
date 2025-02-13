export default function Footer() {
  return (
    <footer className="bg-[hsl(var(--background))] pt-[1.63rem] text-center justify-center text-sm text-[hsl(var(--foreground))]">
      © {new Date().getFullYear()} DialWise.ai. All rights reserved.
    </footer>
  );


}
