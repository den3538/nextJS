import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center space-x-2">
          <Briefcase className="h-5 w-5 text-gray-800" />
          <span className="text-sm text-gray-600">Job Tracker &copy; 2026</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;