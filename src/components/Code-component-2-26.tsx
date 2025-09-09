import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const categories = [
  {
    name: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1638408201374-ff177f17e7a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwY2xvdGhpbmclMjB2aW50YWdlfGVufDF8fHx8MTc1NzQzMjU5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    itemCount: "2,340 items"
  },
  {
    name: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1604182459406-fefa32508ab0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbnMlMjBmYXNoaW9uJTIwc3VzdGFpbmFibGV8ZW58MXx8fHwxNzU3NDMyNTk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    itemCount: "3,560 items"
  },
  {
    name: "Kids' Clothing",
    image: "https://images.unsplash.com/photo-1601925240970-98447486fcdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2hpbGRyZW4lMjBjbG90aGluZ3xlbnwxfHx8fDE3NTczMzc5Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    itemCount: "1,890 items"
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1754824164042-39a9104f974e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWdzJTIwc2hvZXN8ZW58MXx8fHwxNzU3NDMyNTk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    itemCount: "980 items"
  }
];

export function CategoryBrowse() {
  return (
    <section id="browse" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-800 mb-4">Browse by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover unique, pre-loved fashion pieces across all categories. 
            Every purchase helps reduce textile waste and supports sustainable fashion.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.itemCount}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}