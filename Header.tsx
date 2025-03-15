import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-primary">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.028-.696-.083-1.036A4.5 4.5 0 0010 11z" 
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="ml-2 text-2xl font-bold text-primary">Skin Genie</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="#" className="text-gray-500 hover:text-primary font-medium">About</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-primary font-medium">Help</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-primary font-medium">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
