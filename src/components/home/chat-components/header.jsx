export function Header(){
  return(
    <main className="sticky top-0 left-0 w-full grid grid-cols-10 backdrop-blur-sm relative pb-2 border-b z-10">
      <div className="col-span-1 p-2 rounded-full bg-primary">
      </div>
      <h3 className="col-span-6">Chats</h3>
      <div className="col-span-1 p-2 rounded-full bg-gray-900">
      </div>
      <div className="col-span-1 p-2 rounded-full bg-gray-900">
      </div>
      <div className="col-span-1 p-2 rounded-full bg-primary">
      </div>
    </main>
  )
}