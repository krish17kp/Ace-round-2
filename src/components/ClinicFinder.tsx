import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Search, 
  Phone, 
  Clock, 
  Star,
  Navigation,
  Filter,
  Heart,
  Users,
  Shield
} from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  distance: string;
  specialty: string[];
  hours: string;
  type: 'clinic' | 'therapist' | 'counselor' | 'hospital';
  acceptsInsurance: boolean;
  isOpen: boolean;
}

export const ClinicFinder = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Mock clinic data
  const mockClinics: Clinic[] = [
    {
      id: 1,
      name: "MindWell Psychology Center",
      address: "123 Wellness Ave, Downtown",
      phone: "(555) 123-4567",
      rating: 4.8,
      reviews: 127,
      distance: "0.5 mi",
      specialty: ["Anxiety", "Depression", "PTSD"],
      hours: "Mon-Fri 9AM-6PM",
      type: "clinic",
      acceptsInsurance: true,
      isOpen: true
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson, LCSW",
      address: "456 Therapy St, Midtown",
      phone: "(555) 234-5678",
      rating: 4.9,
      reviews: 89,
      distance: "1.2 mi",
      specialty: ["Individual Therapy", "Couples Counseling"],
      hours: "Mon-Thu 10AM-7PM",
      type: "therapist",
      acceptsInsurance: true,
      isOpen: false
    },
    {
      id: 3,
      name: "Serenity Mental Health Services",
      address: "789 Peace Blvd, Uptown",
      phone: "(555) 345-6789",
      rating: 4.6,
      reviews: 203,
      distance: "2.1 mi",
      specialty: ["Group Therapy", "Substance Abuse", "Family Therapy"],
      hours: "Mon-Sat 8AM-8PM",
      type: "clinic",
      acceptsInsurance: true,
      isOpen: true
    },
    {
      id: 4,
      name: "Crisis Support Hotline",
      address: "24/7 Phone Support",
      phone: "(555) 911-HELP",
      rating: 4.7,
      reviews: 1456,
      distance: "Available Now",
      specialty: ["Crisis Intervention", "Suicide Prevention"],
      hours: "24/7 Available",
      type: "counselor",
      acceptsInsurance: false,
      isOpen: true
    }
  ];

  const types = [
    { id: "all", label: "All Types", icon: Heart },
    { id: "clinic", label: "Clinics", icon: Shield },
    { id: "therapist", label: "Therapists", icon: Users },
    { id: "counselor", label: "Counselors", icon: Phone }
  ];

  useEffect(() => {
    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocation("Current Location");
        },
        () => {
          setLocation("Enter your location");
        }
      );
    }
  }, []);

  useEffect(() => {
    // Load initial clinic data
    setClinics(mockClinics);
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredClinics = mockClinics;
      
      if (selectedType !== "all") {
        filteredClinics = filteredClinics.filter(clinic => clinic.type === selectedType);
      }
      
      if (searchQuery) {
        filteredClinics = filteredClinics.filter(clinic =>
          clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clinic.specialty.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      setClinics(filteredClinics);
      setIsLoading(false);
    }, 1000);
  };

  const getLocationAutomatically = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocation("Current Location");
          setIsLoading(false);
          handleSearch();
        },
        () => {
          setLocation("Location access denied");
          setIsLoading(false);
        }
      );
    }
  };

  const getTypeIcon = (type: string) => {
    const typeData = types.find(t => t.id === type);
    return typeData?.icon || Heart;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 gradient-card shadow-emotion text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-glow/10" />
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full gradient-wellness shadow-glow">
              <MapPin className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Find Mental Health Support
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Locate nearby mental health clinics, therapists, and counselors. 
            Get the professional support you deserve.
          </p>
        </div>
      </Card>

      {/* Search Controls */}
      <Card className="p-6 gradient-card shadow-soft">
        <div className="space-y-4">
          {/* Location and Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter city or zip code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={getLocationAutomatically}
                  disabled={isLoading}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search specialties, symptoms, or provider names"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Type Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Provider Type</label>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            variant="hero"
            size="lg"
            disabled={isLoading}
            className="w-full shadow-glow"
          >
            <Search className="h-5 w-5 mr-2" />
            {isLoading ? "Searching..." : "Find Providers"}
          </Button>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {clinics.length} Providers Found
          </h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {clinics.map((clinic) => {
          const TypeIcon = getTypeIcon(clinic.type);
          return (
            <Card key={clinic.id} className="p-6 gradient-card shadow-soft hover:shadow-emotion transition-smooth">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <TypeIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{clinic.name}</h3>
                        <p className="text-muted-foreground">{clinic.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{clinic.rating}</span>
                      <span className="text-sm text-muted-foreground">({clinic.reviews})</span>
                    </div>
                    <Badge variant={clinic.isOpen ? "outline" : "secondary"} className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {clinic.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{clinic.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{clinic.distance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{clinic.hours}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {clinic.specialty.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {clinic.specialty.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{clinic.specialty.length - 3} more
                        </Badge>
                      )}
                    </div>
                    {clinic.acceptsInsurance && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Accepts Insurance
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="hero" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Emergency Banner */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-red-100">
              <Phone className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Crisis Support Available 24/7</h3>
            <p className="text-red-700 mb-4">
              If you're experiencing a mental health emergency, please call immediately:
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="lg" className="bg-white text-red-700 border-red-300 hover:bg-red-50">
                <Phone className="h-5 w-5 mr-2" />
                988 - Suicide & Crisis Lifeline
              </Button>
              <p className="text-sm text-red-600">
                Or text "HELLO" to 741741 for Crisis Text Line
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};