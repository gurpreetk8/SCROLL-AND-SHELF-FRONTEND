import { BookOpen, Download } from "lucide-react";

// Dummy book data – replace with real user library data
const books = [
  {
    id: 1,
    title: "The Time Traveler's Guide",
    author: "E. Morgan",
    cover: "https://via.placeholder.com/100x150?text=Book+1",
    pdfUrl: "#",
  },
  {
    id: 2,
    title: "Mysteries of the Cosmos",
    author: "D. Newton",
    cover: "https://via.placeholder.com/100x150?text=Book+2",
    pdfUrl: "#",
  },
];

export default function MyLibrary() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Library</h2>
      {books.length === 0 ? (
        <p className="text-gray-500">You haven’t added any books yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition"
            >
              <img
                src={book.cover}
                alt={book.title}
                className="w-24 h-36 object-cover rounded"
              />
              <h3 className="mt-3 font-semibold text-gray-700">{book.title}</h3>
              <p className="text-sm text-gray-500">{book.author}</p>
              <div className="mt-4 flex flex-col gap-2 w-full">
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <BookOpen className="w-4 h-4" />
                  Continue Reading
                </button>
                <a
                  href={book.pdfUrl}
                  download
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
