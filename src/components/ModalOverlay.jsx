export default function ModalOverlay({ children, onClick }){
  return (
    <div 
      className="fixed inset-0 z-10 bg-black bg-opacity-50 text-gray-700 flex justify-center items-center w-[100vw] h-[100vh] hover:cursor-pointer"
      onClick={onClick}
      >

      <div onClick={(e) => e.stopPropagation()} className="cursor-default">
        {children}
      </div>
    </div>
  );
}