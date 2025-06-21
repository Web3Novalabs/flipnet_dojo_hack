import React, { useState, useEffect } from "react";
import { User } from "@/types/user"; // Define this type based on your API/ABI response

const UserInfoSection: React.FC = () => {
  //   commented out the setUsers as it is not used now
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [users, setUsers] = useState<User[]>([
    { address: "0x1234...abcd", balance: 150.25, lastActivity: "2h ago" },
    { address: "0x5678...efgh", balance: 45.1, lastActivity: "5m ago" },
    { address: "0x7224...lmol", balance: 700, lastActivity: "2s ago" },
    { address: "0x2399...b56a", balance: 91.7, lastActivity: "47m ago" },
    { address: "0x9012...ijkl", balance: 300.0, lastActivity: "1d ago" },
  ]);

  // Placeholder for API/ABI fetch - replace with the actual fetch logic abi for this case
  useEffect(() => {
    // Example fetch using API or ABI
    // const fetchUserData = async () => {
    //   const response = await fetch("/api/users");
    //   const data = await response.json();
    //   setUsers(data);
    // };
    // fetchUserData();
  }, []);

  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4 shadow-2xl mt-4">
      <h3 className="text-lg font-black text-yellow-400 mb-2">USER INFO</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500/30 scrollbar-track-transparent">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center mt-3 justify-between text-xs"
          >
            <span className="text-yellow-300 truncate flex-1">
              {user.address}
            </span>
            <span className="text-yellow-200 mx-2">{user.balance} STRK</span>
            <span className="text-gray-400 flex-shrink-0">
              {user.lastActivity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInfoSection;
