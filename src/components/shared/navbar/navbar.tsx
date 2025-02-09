import DynamicThemeToggler from "./dynamic-theme-toggler";
import ProfileMenu from "./profile-menu";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[var(--header)] items-center justify-center border-b bg-transparent backdrop-blur-md">
      <nav className="flex w-full items-center justify-between px-6">
        <span
          aria-label="logo"
          className="font-rubik-gemstone text-sm font-thin tracking-widest md:text-2xl"
        >
          Playlists<span className="text-primary">Genius</span>
        </span>

        <ul>
          <li>Header</li>
        </ul>

        <div className="flex items-center space-x-2">
          <DynamicThemeToggler />
          <ProfileMenu />
        </div>
      </nav>
    </header>
  );
};

export default Header;
