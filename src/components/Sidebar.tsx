import { LayoutGrid, CheckCircle, Clock, List, Settings, Projector,Columns3, ChevronRight, X } from 'lucide-react';
import { useBoard } from '../store/BoardContext';
import SidebarMenuItem from './SideBarMenuItem';


interface SidebarProps{
    isSidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ isSidebarOpen, setSidebarOpen }: SidebarProps){
    const {boards, deleteBoard, editBoard} = useBoard();
    const menuItems = [
        // Home Section
        {
          icon: <LayoutGrid size={20} />,
          name: 'Home',
          link: '/',
        },
      
        // Dynamic Board Items
        ...boards.map((board) => ({
          icon: <Columns3 size={20} />,
          name: board.title,
          link: `/board-view/${board.id}`,
          boardId: board.id,
        })),
      
        // Tasks Section
        {
          icon: <List size={20} />,
          name: 'All Tasks',
          link: '/all-tasks',
        },
        {
          icon: <CheckCircle size={20} />,
          name: 'Completed',
          link: '/completed',
        },
        {
          icon: <Clock size={20} />,
          name: 'Pending',
          link: '/pending',
        },
    ];
      

    return (
        <>
            <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black/50 z-10 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
            <aside className={`bg-white border-r border-gray-200 flex flex-col flex-shrink-0 fixed h-full w-64 z-10 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="py-4 px-6 h-[75px] flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-600"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
                        <h1 className="text-xl font-bold text-gray-800">ToDo App</h1>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                </div>
                <nav className="flex-1 py-6 px-4 space-y-2">
                    {menuItems.map((item, index) => <SidebarMenuItem item={item} key={index} deleteBoard={deleteBoard} editBoard={editBoard}/>)}
                </nav>
                <div className="p-4 border-t border-gray-200"><a href="#" className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100"><Settings size={20} /><span>Settings</span></a></div>
            </aside>
        </>
    );
};