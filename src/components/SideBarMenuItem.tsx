"use client";
import Link from 'next/link';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
import { usePathname } from "next/navigation";

interface SidebarMenuItemProps{
    item: {
        icon: JSX.Element;
        name: string;
        link: string;
        boardId?: string;
    };
};

export default function SidebarMenuItem({ item }:SidebarMenuItemProps)
{
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isActive = pathname === item.link;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleMenuToggle = (e: React.MouseEvent) => {
        setIsMenuOpen(prev => !prev);
    };

    const handleEdit = (e: React.MouseEvent) => {
        setIsMenuOpen(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        setIsMenuOpen(false);
    };
    return (
        <div
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
            isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            <Link href={item.link} className="flex items-center space-x-3 flex-1">
            {item.icon}
            <span>{item.name}</span>
            </Link>
        
            {item.boardId && (
            <div ref={menuRef} className="relative">
                <button
                onClick={handleMenuToggle}
                className="p-1 text-gray-500 hover:bg-gray-200 rounded-full opacity-100 transition-opacity"
                >
                <Ellipsis size={16} />
                </button>
                {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-xl z-20 border border-gray-100">
                    <ul className="py-1">
                    <li>
                        <button
                        onClick={handleEdit}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                        <Pencil size={14} className="mr-3" />
                        Rename
                        </button>
                    </li>
                    <li>
                        <button
                        onClick={handleDelete}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                        >
                        <Trash2 size={14} className="mr-3" />
                        Delete
                        </button>
                    </li>
                    </ul>
                </div>
                )}
            </div>
            )}
        </div>
    );
}