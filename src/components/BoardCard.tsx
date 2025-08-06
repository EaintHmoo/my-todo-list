import Link from "next/link";

const BoardCard = ({ title, id }:{title:string, id: string}) => {
    return (
      <Link href={`/board-view/${id}`}>
        <div className="bg-white border border-zinc-200 rounded-lg p-4 cursor-pointer transition-colors hover:bg-zinc-50 shadow-sm">
          <span className="text-2xl mb-2 block" role="img" aria-label="document">
            📄
          </span>
          <h3 className="text-base font-semibold text-zinc-800 m-0">{title}</h3>
        </div>
      </Link>
    );
  };
  
  export default BoardCard;