export default function Footer() {
  const version = "1.0.0";
  
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            Desenvolvido por <span className="font-semibold text-foreground">Fernando Mesquita</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Versão {version}</span>
            <span>© {new Date().getFullYear()} DOM / EARA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
