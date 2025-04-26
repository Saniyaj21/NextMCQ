export default function ProfileInfo({ userData }) {
  if (!userData) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Profile Information</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 break-words overflow-hidden">
            {userData.name}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 break-all overflow-hidden">
            {userData.email}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 capitalize">
            {userData.role}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
          <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
            {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
          <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
            {userData.referralCode}
          </p>
        </div>
      </div>
    </div>
  );
}