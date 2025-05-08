import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Key, MessageSquare, UtensilsCrossed } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-3xl" role="img" aria-label="hotel">🏨</span>
              <h1 className="text-2xl font-bold text-white">HMS</h1>
            </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline" className="bg-white text-purple-600 hover:bg-white/90 border-purple-300">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-white text-purple-600 hover:bg-white/90">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center space-y-8 text-white">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Welcome to Hostel Management System
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Streamline your hostel experience with our comprehensive management system. 
              Book rooms, manage payments, and more - all in one place.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 transform hover:scale-105 transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <FeatureCard 
            icon={<Home />}
            title="Room Booking"
            description="Easy and quick room booking process with instant updates"
          />
          <FeatureCard 
            icon={<Key />}
            title="Room Management"
            description="Efficient room allocation and management system"
          />
          <FeatureCard 
            icon={<MessageSquare />}
            title="Complaints Portal"
            description="Submit and track your complaints with real-time status updates"
          />
          <FeatureCard 
            icon={<UtensilsCrossed />}
            title="Mess Management"
            description="View mess menu and provide feedback for better service"
          />
        </div>

        <div className="mt-32 text-center text-white/80">
          <h2 className="text-3xl font-bold mb-4">Why Choose HMS?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:transform hover:scale-105 transition-all"
              >
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-white/70">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:transform hover:scale-105 transition-all">
    <div className="text-white/90 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </div>
);

const benefits = [
  {
    title: "Easy to Use",
    description: "Intuitive interface designed for both students and administrators"
  },
  {
    title: "Real-time Updates",
    description: "Get instant notifications about your requests and complaints"
  },
  {
    title: "24/7 Support",
    description: "Our support team is always ready to help you"
  }
];

export default LandingPage;
