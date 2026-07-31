import { Link } from "react-router-dom";
import { hasPermission } from "../utils/permission";

export default function SidebarItem({ item }) {

    if (
        item.permission &&
        !hasPermission(item.permission)
    ) {
        return null;
    }

    return (
        <li className="nav-item">
            <Link
                to={item.path}
                className="nav-link text-white"
            >
                <i className={`${item.icon} me-2`}></i>

                {item.title}
            </Link>
        </li>
    );
}