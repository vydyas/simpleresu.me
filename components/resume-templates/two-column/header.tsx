export function TwoColumnHeader({ userData }: { userData: any }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{userData.name}</h1>
      <div className="text-sm text-gray-600 space-y-1">
        <p>{userData.email}</p>
        <p>{userData.phone}</p>
        <p>{userData.location}</p>
      </div>
    </div>
  );
} 