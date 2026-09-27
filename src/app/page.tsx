import Link from 'next/link';
import { db } from '@/lib/db';
import { PropertyCard } from '@/components/PropertyCard';
import { Search, MapPin, ShieldCheck, Home, HeartHandshake } from 'lucide-react';

export default async function HomePage() {
  const featuredProperties = await db.property.findMany({
    where: { status: 'ACTIVE' },
    take: 8,
    include: { images: true, host: true },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch destination counts dynamically from the database
  const propertyCountsRaw = await db.property.groupBy({
    by: ['location'],
    where: { status: 'ACTIVE' },
    _count: true
  });

  const propertyCounts = propertyCountsRaw.reduce((acc, curr) => {
    acc[curr.location.toLowerCase()] = curr._count;
    return acc;
  }, {} as Record<string, number>);

  const destinations = [
    { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80' },
    { name: 'Bengaluru', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&q=80' },
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1522206090980-4c8e5e8e3d23?w=500&q=80' },
    { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80' },
    { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&q=80' },
    { name: 'Kochi', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80' },
    { name: 'Manali', image: 'https://images.unsplash.com/photo-1605649487212-4d4ce798faa4?w=500&q=80' },
    { name: 'Udaipur', image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=500&q=80' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=2000&q=80" 
            alt="Beautiful home interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-lg">
            Find your perfect stay.
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl font-medium drop-shadow">
            Discover extraordinary homes hosted by locals. From cozy mountain cabins to luxurious beachfront villas.
          </p>

          {/* Search Bar */}
          <form action="/properties" className="w-full max-w-4xl bg-white p-2 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-6 py-3 w-full border-b md:border-b-0 md:border-r border-stone-200">
              <MapPin className="w-5 h-5 text-stone-400 mr-3" />
              <input 
                type="text" 
                name="location"
                placeholder="Where are you going?" 
                className="w-full text-stone-800 focus:outline-none font-medium placeholder:text-stone-400 bg-transparent"
              />
            </div>
            <div className="flex-1 flex items-center px-6 py-3 w-full">
              <Home className="w-5 h-5 text-stone-400 mr-3" />
              <select name="type" className="w-full text-stone-800 focus:outline-none font-medium bg-transparent cursor-pointer">
                <option value="">Any property type</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Luxury stay">Luxury stay</option>
                <option value="Beach stay">Beach stay</option>
                <option value="Mountain stay">Mountain stay</option>
              </select>
            </div>
            <button type="submit" className="w-full md:w-auto bg-[#FF5A5F] hover:bg-[#E0484D] text-white px-8 py-4 rounded-full font-bold transition flex items-center justify-center gap-2 shadow-md">
              <Search className="w-5 h-5" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Popular Destinations</h2>
            <p className="text-stone-500 mt-2 text-lg">Explore the most loved locations across the country.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {destinations.map((dest) => {
            const count = propertyCounts[dest.name.toLowerCase()] || 0;
            return (
              <Link href={`/properties?location=${dest.name}`} key={dest.name} className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-md">{dest.name}</h3>
                  {count > 0 && (
                    <p className="text-white/80 text-sm font-medium mt-0.5">
                      {count} {count === 1 ? 'stay' : 'stays'}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-stone-100">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Featured Stays</h2>
            <p className="text-stone-500 mt-2 text-lg">Hand-picked properties for your next adventure.</p>
          </div>
          <Link href="/properties" className="hidden md:block text-stone-600 font-semibold hover:text-[#FF5A5F] transition">
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location}
              type={property.type}
              pricePerNight={Number(property.pricePerNight)}
              imageUrl={property.images[0]?.imageUrl}
              hostName={property.host.name || 'Stayly Host'}
            />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/properties" className="inline-block border border-stone-300 text-stone-700 font-semibold px-6 py-3 rounded-xl hover:bg-stone-50 transition w-full">
            View all stays
          </Link>
        </div>
      </section>

      {/* Why Stayly */}
      <section className="py-24 bg-stone-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Why book with Stayly?</h2>
            <p className="text-stone-500 mt-3 text-lg">We make finding your perfect stay easy, safe, and transparent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#FF5A5F] mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Verified stays</h3>
              <p className="text-stone-500 leading-relaxed">Every host and property is carefully vetted to ensure your safety and comfort during your trip.</p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#FF5A5F] mb-6">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Trusted hosts</h3>
              <p className="text-stone-500 leading-relaxed">Connect with locals who care about your experience and provide authentic hospitality.</p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#FF5A5F] mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Transparent booking</h3>
              <p className="text-stone-500 leading-relaxed">No hidden fees or surprises. What you see is exactly what you pay for your perfect stay.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900">
          <img
            src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1600&q=80"
            alt="Host your home"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative z-10 px-8 py-20 md:p-24 flex flex-col items-start max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Earn money doing what you love.
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Turn your extra space into extra income. Become a Stayly host today and join thousands of others opening their doors.
            </p>
            <Link href="/host" className="bg-white text-stone-900 px-8 py-4 rounded-xl font-bold hover:bg-stone-100 transition shadow-lg text-lg">
              Start Hosting
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-stone-800 mb-4">Explore</h4>
            <ul className="space-y-3 text-stone-500 text-sm">
              <li><Link href="/properties" className="hover:text-[#FF5A5F] transition">All Properties</Link></li>
              <li><Link href="/properties?location=Goa" className="hover:text-[#FF5A5F] transition">Stays in Goa</Link></li>
              <li><Link href="/properties?type=Villa" className="hover:text-[#FF5A5F] transition">Villas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-800 mb-4">Hosting</h4>
            <ul className="space-y-3 text-stone-500 text-sm">
              <li><Link href="/host" className="hover:text-[#FF5A5F] transition">Host your home</Link></li>
              <li><Link href="/host" className="hover:text-[#FF5A5F] transition">Host dashboard</Link></li>
              <li><a href="#" className="hover:text-[#FF5A5F] transition">Community forum</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-800 mb-4">Support</h4>
            <ul className="space-y-3 text-stone-500 text-sm">
              <li><a href="#" className="hover:text-[#FF5A5F] transition">Help Center</a></li>
              <li><a href="#" className="hover:text-[#FF5A5F] transition">Cancellation options</a></li>
              <li><a href="#" className="hover:text-[#FF5A5F] transition">Safety information</a></li>
            </ul>
          </div>
          <div>
            <div className="text-2xl font-black text-[#FF5A5F] tracking-tighter mb-4">stayly.</div>
            <p className="text-stone-500 text-sm mb-4">The modern way to discover and book beautiful properties globally.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Stayly, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-600">Privacy</a>
            <a href="#" className="hover:text-stone-600">Terms</a>
            <a href="#" className="hover:text-stone-600">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
