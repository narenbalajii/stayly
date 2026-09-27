import Link from 'next/link';
import { db } from '@/lib/db';
import Image from 'next/image';

export default async function HomePage() {
  const featuredProperties = await db.property.findMany({
    where: { status: 'ACTIVE' },
    take: 6,
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-orange-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find your next place to stay</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">Discover amazing properties hosted by locals around the world.</p>
          <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex flex-col md:flex-row gap-2 shadow-lg">
            <input 
              type="text" 
              placeholder="Where are you going?" 
              className="flex-grow px-6 py-3 rounded-full text-stone-800 focus:outline-none"
            />
            <button className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-stone-800 mb-8">Featured Properties</h2>
        
        {featuredProperties.length === 0 ? (
          <div className="text-center py-12 text-stone-500 bg-white rounded-xl shadow-sm border border-stone-100">
            <p>No properties available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Link href={`/properties/${property.id}`} key={property.id} className="group cursor-pointer">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 transition hover:shadow-md">
                  <div className="aspect-[4/3] bg-stone-200 relative overflow-hidden">
                    {property.images[0] ? (
                      <img 
                        src={property.images[0].imageUrl} 
                        alt={property.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-stone-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-stone-800 text-lg mb-1 truncate">{property.title}</h3>
                    <p className="text-stone-500 mb-2">{property.location}</p>
                    <p className="text-stone-900 font-semibold">
                      ${property.pricePerNight.toString()} <span className="text-stone-500 font-normal">night</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
