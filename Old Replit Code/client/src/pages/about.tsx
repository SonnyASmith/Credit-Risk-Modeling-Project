import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const teamMembers = [
  {
    name: "Aidan Valentine",
    description: "Master of Finance student at Case Western Reserve University focusing in Corporate Finance."
  },
  {
    name: "Christian Asimou",
    description: "Master of Finance student at Case Western Reserve University focusing in Big Data Analytics."
  },
  {
    name: "Sonny Smith",
    description: "Master of Finance student at Case Western Reserve University focusing in Big Data Analytics."
  },
  {
    name: "Khamil Panni",
    description: "Master of Finance student at Case Western Reserve University focusing in Risk Management."
  },
  {
    name: "Jarrod West",
    description: "Master of Finance student at Case Western Reserve University focusing in Corporate Financial Analytics."
  }
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">About Our Team</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We are dedicated to providing innovative risk assessment solutions that help businesses 
                make informed decisions. Our team combines expertise in technology, finance, and data 
                science to deliver powerful yet intuitive tools for risk modeling and analysis.
              </p>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-semibold mb-6">Meet The Team</h2>
          
          <div className="grid gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-secondary/20 pb-2">
                  <CardTitle>{member.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-base text-foreground/80">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}