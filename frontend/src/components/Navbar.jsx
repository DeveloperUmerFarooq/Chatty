import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, MessageSquare, Settings, Menu, UserRound, HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="shadow-sm bg-base-100">
      <div className="navbar max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl" to="/">
            <div className="flex gap-2 items-center">
              <MessageSquare className="w-5 h-5 text-[#4647a8]" />
              <h1>Chatty</h1>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {authUser && (
              <>
              <li>
              <Link to="/">
                <HomeIcon className="size-5" />
                Home
              </Link>
            </li>
              <li>
                <Link to="/profile">
                  <UserRound className="size-5" />
                  Profile
                </Link>
              </li>
              </>
            )}
            <li>
              <Link to="/settings">
                <Settings className="size-5" />
                Settings
              </Link>
            </li>
            {authUser && (
              <li>
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Menu className="w-6 h-6" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {authUser && (
              <>
              <li>
              <Link to="/">
                <HomeIcon className="size-5" />
                Home
              </Link>
            </li>
              <li>
                <Link to="/profile">
                  <UserRound className="size-4" />
                  Profile
                </Link>
              </li>
              </>
            )}
            <li>
              <Link to="/settings">
                <Settings className="size-4" />
                Settings
              </Link>
            </li>
            {authUser && (
              <li>
                <button onClick={logout} className="flex items-center">
                  <LogOut className="size-4" />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
