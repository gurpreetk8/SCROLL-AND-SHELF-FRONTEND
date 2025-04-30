// components/Dashboard/Recommendations.jsx
export default function Recommendations() {
    const recommendations = [
      {
        id: 1,
        title: "Beyond the Stars",
        author: "C. Vega",
        cover: "https://via.placeholder.com/100x150?text=Rec+1",
      },
      {
        id: 2,
        title: "Mindful Moments",
        author: "L. Grace",
        cover: "https://via.placeholder.com/100x150?text=Rec+2",
      },
    ];
  
    return (
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended for You</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recommendations.map((book) => (
            <div
              key={book.id}
              className="min-w-[120px] flex-shrink-0 text-center"
            >
              <img
                src={book.cover}
                alt={book.title}
                className="w-24 h-36 object-cover rounded mx-auto"
              />
              <h3 className="text-sm font-medium mt-2">{book.title}</h3>
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  