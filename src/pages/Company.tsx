import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBackground from "@/components/HeroBackground";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Company = () => {
  const stats = [
    { number: "25+", label: "anni di esperienza" },
    { number: "500+", label: "clienti soddisfatti" },
    { number: "2 milioni", label: "prodotti venduti ogni anno" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroBackground 
        title="Sicopack" 
        subtitle="Rappresentante commerciale Skycom Packaging Solutions"
      />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Dal 2007, diamo forma alle idee dei nostri clienti con passione e competenza.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              In Skycom, il packaging non è mai solo un contenitore: è identità, esperienza, innovazione.
            </p>
            <Button asChild size="lg">
              <Link to="/">Tutti i prodotti</Link>
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-6">
                  <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Two Paths Section */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
              Due strade, un solo obiettivo: il tuo packaging perfetto.
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Path 1 */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Scegli dal nostro catalogo
                </h3>
                <p className="text-muted-foreground">
                  Puoi scegliere tra un'ampia gamma di articoli a catalogo per trovare 
                  il packaging più adatto alla tua linea. Puoi combinare flaconi, tappi, 
                  dispenser e accessori per creare il set perfetto.
                </p>
                <p className="text-muted-foreground">
                  Richiedi un campione gratuito, testalo con mano, e procedi all'ordine 
                  solo quando sei sicuro della tua scelta.
                </p>
              </div>

              {/* Path 2 */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Crea il tuo packaging da zero
                </h3>
                <p className="text-muted-foreground">
                  Hai bisogno di qualcosa che ancora non esiste? Con noi puoi partire 
                  da un'idea o una necessità specifica: il nostro team di esperti ti 
                  affianca nell'analisi, nel design e nella realizzazione dello stampo 
                  su misura.
                </p>
                <p className="text-muted-foreground">
                  Dallo studio tecnico al prototipo finale, ti garantiamo efficienza, 
                  affidabilità e un risultato che parla davvero del tuo brand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Customization Section */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Scopri tutte le possibilità su misura per il tuo packaging
            </h2>
            <p className="text-center text-xl text-muted-foreground mb-12">
              Personalizza ogni dettaglio per rendere unico il tuo prodotto
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Colori", "Serigrafia", "Finish", "Rilievo"].map((feature) => (
                <div 
                  key={feature} 
                  className="bg-background p-8 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Section */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Materiali d'eccellenza, fornitori di fiducia
            </h2>
            <p className="text-lg text-muted-foreground">
              La qualità dei nostri prodotti nasce dalla scelta dei migliori materiali, 
              forniti da partner selezionati che condividono il nostro impegno per 
              l'innovazione e la sostenibilità. Ogni componente del nostro packaging è 
              frutto di un'attenta ricerca, per garantire prestazioni elevate e un ridotto 
              impatto ambientale. Collaboriamo con fornitori affidabili per offrirti 
              soluzioni all'altezza delle tue esigenze.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Company;
