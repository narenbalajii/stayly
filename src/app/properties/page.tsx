import { db } from '@/lib/db';
import Link from 'next/link';

export default async function PropertiesPage() {
  const properties = await db.property.findMany({
    where: { status: 'ACTIVE' },
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">All Properties</h1>
        
        {properties.length === 0 ? (
          <div className="text-center py-12 text-stone-500 bg-white rounded-xl shadow-sm border border-stone-100">
            <p>No properties found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <Link href={`/properties/${property.id}`} key={property.id} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 transition hover:shadow-md">
                  <div className="aspect-square bg-stone-200 relative overflow-hidden">
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
                  <div className="p-4">
                    <h3 className="font-bold text-stone-800 truncate">{property.title}</h3>
                    <p className="text-stone-500 text-sm mb-2">{property.location}</p>
                    <p className="text-stone-900 font-semibold">
                      ${property.pricePerNight.toString()} <span className="text-stone-500 font-normal">night</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
