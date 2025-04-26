import { FiUser } from 'react-icons/fi';

export default function ProfileHeader({ user, stats, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center mb-6">
        {user?.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt={user.fullName || 'User'} 
            className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-blue-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-500 text-4xl">
            <FiUser />
          </div>
        )}
        <h2 className="text-xl font-semibold">{user.fullName || user.username || 'User'}</h2>
        <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress || ''}</p>
        
        {stats && (
          <div className="mt-4 w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">XP Level</span>
              <span className="text-sm font-medium">{stats.rank}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Children content will be rendered here */}
      {children}
    </div>
  );
}