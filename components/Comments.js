import { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebase';

export function Comments({ user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const commentsRef = ref(db, 'comments');

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsList = data ? Object.entries(data).map(([id, comment]) => ({ id, ...comment })) : [];
      setComments(commentsList);
    });

    return () => unsubscribe();
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (user && newComment.trim()) {
      const commentsRef = ref(db, 'comments');
      const timestamp = new Date().toISOString();
      push(commentsRef, {
        text: newComment,
        timestamp,
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        provider: user.providerData[0]?.providerId,
      })
      .then(() => {
        setNewComment('');
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
      });
    }
  };

  return (
    <div className="p-4">
      {user && (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full max-w-xl p-2 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              required
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none"
            >
              Send
            </button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className={`p-4 rounded shadow-md ${comment.provider === 'google.com' ? 'bg-gray-800 dark:bg-gray-900' : comment.provider === 'github.com' ? 'bg-gray-700 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
            <p className={`text-lg ${comment.provider === 'google.com' ? 'text-gray-100 dark:text-gray-300' : comment.provider === 'github.com' ? 'text-gray-200 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {comment.text}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              {new Date(comment.timestamp).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })} {new Date(comment.timestamp).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

