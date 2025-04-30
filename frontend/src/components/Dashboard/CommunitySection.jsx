// components/Dashboard/CommunitySection.jsx
export default function CommunitySection() {
    const posts = [
      { id: 1, title: "Loved this book!" },
      { id: 2, title: "Looking for sci-fi suggestions." },
    ];
  
    return (
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Community Activity</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">You haven't posted yet.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700">
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <a
            href="/community"
            className="text-blue-600 hover:underline font-medium"
          >
            Visit Community Page →
          </a>
        </div>
      </div>
    );
  }
  