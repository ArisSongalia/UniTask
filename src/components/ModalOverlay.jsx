export default function ModalOverlay({ children, onClick }){
  return (
    <div 
      className="fixed inset-0 z-10 bg-black bg-opacity-50 text-gray-700 flex justify-center items-center w-[100vw] h-[100vh] hover:cursor-pointer p-4"
      onClick={onClick}
      >

      <div onClick={(e) => e.stopPropagation()} className="flex max-w-2xl cursor-default h-full items-center justify-center">
        {children}
      </div>
    </div>
  );
} 