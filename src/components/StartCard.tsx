type StatCardProps = {
    icon: React.ReactNode;
    title: string;
    color: string;
    value: number;
};

export default function StatCard({ icon, title, value, color } : StatCardProps){
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}
    
