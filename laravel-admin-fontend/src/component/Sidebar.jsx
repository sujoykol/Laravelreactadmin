import SidebarItem from "./SidebarItem";
import { menu } from "../config/menu";

export default function Sidebar({ isSidebarOpen }) {

    return (
        <div
            className={`bg-dark text-white p-3 ${
                isSidebarOpen
                    ? "d-block"
                    : "d-none"
            }`}
            style={{ width: "250px" }}
        >
            <h4 className="mb-4">
                Admin Panel
            </h4>

            <ul className="nav flex-column">

                {menu.map((item) => (
                    <SidebarItem
                        key={item.path}
                        item={item}
                    />
                ))}

            </ul>

        </div>
    );
}