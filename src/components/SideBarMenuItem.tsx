"use client";
import Link from 'next/link';
import { Ellipsis, Pencil, Trash2,CheckCheck } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
import { usePathname } from "next/navigation";

interface SidebarMenuItemProps{
    item: {
        icon: JSX.Element;
        name: string;
        link: string;
        boardId?: string;
    };
    deleteBoard: (boardId: string) => Promise<void>;
    editBoard:(boardId: string, newTitle: string) => Promise<void>;
};

export default function SidebarMenuItem({ item, deleteBoard,editBoard }:SidebarMenuItemProps)
{
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [boardTitle, setBoardTitle] = useState(item.name);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isActive = pathname === item.link;
    console.log('inside sidebarmenu ', item)
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsRenameOpen(false);
            }
        };

        if (isRenameOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isRenameOpen]);

    useEffect(() => {
        if (isRenameOpen) {
          setBoardTitle(item.name);
        }
      }, [isRenameOpen, item.name]);

    const handleMenuToggle = (e: React.MouseEvent) => {
        setIsMenuOpen(prev => !prev);
    };

    const handleEdit = (e: React.MouseEvent) => {
        setIsMenuOpen(false);
        setIsRenameOpen(true);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!item.boardId) return;
        deleteBoard(item.boardId)
        setIsMenuOpen(false);
    };

    const handleRename = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!item.boardId) return;
        editBoard(item.boardId, boardTitle);
        setIsRenameOpen(false);
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
                <div className="absolute font-normal right-0 mt-1 w-48 bg-white rounded-md shadow-xl z-20 border border-gray-100">
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
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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

            {
            isRenameOpen && (
            <div ref={menuRef} className="relative">
                <div className="absolute flex gap-1 font-normal right-[-48] mt-1 p-1 w-64 bg-white rounded-md shadow-xl z-20 border border-gray-100">
                    <input id="title" value={boardTitle} onChange={(e)=>setBoardTitle(e.target.value)} type="text" name="title" placeholder="Rename title" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    <button
                    onClick={handleRename}
                    className="p-1 text-gray-500 hover:bg-gray-200 rounded opacity-100 transition-opacity"
                    >
                    <CheckCheck size={16} />
                    </button>
                </div>
                
            </div>
            )
            }
        </div>
    );
}