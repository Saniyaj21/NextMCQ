import ReferralLinkGenerator from '../ReferralLinkGenerator';

export default function ReferralSection({ userData }) {
    if (!userData) return null;

    return (
        <div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-medium mb-2">Your Impact</h4>
                <div className="text-3xl font-bold text-blue-600">{userData.referralCount}</div>
                <p className="text-sm text-gray-600">Users referred</p>
            </div>


            {userData.referralHistory?.length > 0 ? (
                <div className="space-y-4">
                    <h4 className="font-medium mb-4">Referral History</h4>
                    {userData.referralHistory.map((referral, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{referral.user.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Joined {new Date(referral.joinedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-green-600">
                                        {referral.milestones.length} milestones reached
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No referrals yet. Share your code to get started!</p>
            )}
            <ReferralLinkGenerator referralCode={userData.referralCode} />
        </div>
    );
}