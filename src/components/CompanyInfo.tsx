import { CheckCircle2 } from "lucide-react";

const CompanyInfo = () => {
  const features = [
    "Customized packaging solutions",
    "Innovative design and functionality",
    "Sustainable and eco-friendly options",
    "Expert consultation and support",
    "Quality assurance and testing",
    "Fast turnaround times"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your Partner in
              <br />
              <span className="text-primary">Packaging Excellence</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              With decades of experience in the packaging industry, we specialize in creating solutions that not only protect and preserve your products but also enhance their market appeal. Our commitment to innovation and quality makes us the preferred choice for brands worldwide.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">25+</div>
                <p className="text-xl text-foreground font-semibold mb-2">Years of Experience</p>
                <p className="text-muted-foreground">Serving industries worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfo;
