import { Loader2 } from "lucide-react"

export default function LoadingPage()
{
    return( 
    <div className="fixed inset-0 bg-gray-100/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in z-10">
         <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-20 w-20 animate-spin text-indigo-600" />
        </div>
    </div>
    );
}