import { useEffect, useState } from "react"
import { fetchPostCount } from "../api/post"

export default function Feed() {
  const [postCount, setPostCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

      // Fetch post count on component mount
      useEffect(() => {
        fetchPostCount()
        .then((data) => { 
          setPostCount(data.post_count);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    }, []);

    // Render Loading or Error states if necessary
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-red-900 to-red-500 text-white">
      <div className="text-center py-10 px-4">
        <h1 className="text-3xl font-bold">Feed Page</h1>
        <p className="text-gray-300">Live Feed: {postCount}</p>


        
        </div>
      </div>
    
  )
}